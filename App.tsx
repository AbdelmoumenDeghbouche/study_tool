import React, { useState, useCallback, useEffect } from 'react';
import { InputType, ActiveResultTab, QuizQuestion, GeneratedContent, LoadingStates } from './types';
import { Part } from "@google/genai";
import * as geminiService from './services/geminiService';
import InputTabs from './components/InputTabs';
import ImageUpload from './components/ImageUpload';
import TextInput from './components/TextInput';
import ResultTabs from './components/ResultTabs';
import ContentDisplayCard from './components/ContentDisplayCard';
import QuizView from './components/QuizView';
import ErrorMessage from './components/ErrorMessage';
import LoadingSpinner from './components/LoadingSpinner';
import LanguageSelector, { Language } from './components/LanguageSelector';

// Helper to convert base64 Data URL to Gemini Part
const fileToGenerativePart = (dataUrl: string, mimeType: string): Part => {
  return {
    inlineData: {
      data: dataUrl.split(',')[1], // Remove the "data:mime/type;base64," prefix
      mimeType
    }
  };
};

const App: React.FC = () => {
  const [inputType, setInputType] = useState<InputType>('image');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [inputText, setInputText] = useState<string>('');
  
  const [activeResultTab, setActiveResultTab] = useState<ActiveResultTab>('summary');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({
    summary: '',
    explanation: '',
    quiz: [],
    mindMap: '',
  });
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    generating: false, summary: false, explanation: false, quiz: false, mindMap: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');

  const resetResults = () => {
    setGeneratedContent({ summary: '', explanation: '', quiz: [], mindMap: '' });
    setError(null);
  };
  
  const handleImageChange = useCallback((file: File, dataUrl: string) => {
    setUploadedFile(file);
    setImageUrl(dataUrl);
    resetResults();
  }, []);

  const handleTextChange = useCallback((text: string) => {
    setInputText(text);
    if(uploadedFile || imageUrl) { // if switching from image to text, clear image
        setUploadedFile(null);
        setImageUrl(null);
    }
    resetResults();
  }, [uploadedFile, imageUrl]);

  const handleInputTabChange = (type: InputType) => {
    setInputType(type);
    resetResults(); // Reset results when switching input type
    // Optionally clear the other input type's data
    if (type === 'text') {
        setUploadedFile(null);
        setImageUrl(null);
    } else {
        setInputText('');
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!inputText && !uploadedFile && !imageUrl) {
      setError("Please enter some content first.");
      return;
    }

    setError(null);
    setGeneratedContent({ summary: '', explanation: '', quiz: [], mindMap: '' });
    setLoadingStates({ generating: true, summary: true, explanation: true, quiz: true, mindMap: true });

    try {
      let currentContent: string | Part | null = null;

      if (inputType === 'image' && uploadedFile && imageUrl) {
        currentContent = fileToGenerativePart(imageUrl, uploadedFile.type);
      } else if (inputType === 'text' && inputText.trim()) {
        currentContent = inputText.trim();
      } else {
        setError("No content provided to process.");
        return;
      }

      if (!currentContent) {
        setError("No content provided to process.");
        return;
      }

      try {
        const summary = await geminiService.generateSummary(currentContent, selectedLanguage);
        setGeneratedContent(prev => ({ ...prev, summary }));
      } catch (e: any) {
        setError(prev => prev ? `${prev}\nSummary failed: ${e.message}` : `Summary failed: ${e.message}`);
      } finally {
        setLoadingStates(prev => ({ ...prev, summary: false }));
      }

      try {
        const explanation = await geminiService.generateExplanation(currentContent, selectedLanguage);
        setGeneratedContent(prev => ({ ...prev, explanation }));
      } catch (e: any) {
        setError(prev => prev ? `${prev}\nExplanation failed: ${e.message}` : `Explanation failed: ${e.message}`);
      } finally {
        setLoadingStates(prev => ({ ...prev, explanation: false }));
      }

      try {
        const quiz = await geminiService.generateQuiz(currentContent, selectedLanguage);
        setGeneratedContent(prev => ({ ...prev, quiz }));
      } catch (e: any) {
        setError(prev => prev ? `${prev}\nQuiz generation failed: ${e.message}` : `Quiz generation failed: ${e.message}`);
      } finally {
        setLoadingStates(prev => ({ ...prev, quiz: false }));
      }
      
      try {
        const mindMap = await geminiService.generateMindMap(currentContent, selectedLanguage);
        setGeneratedContent(prev => ({ ...prev, mindMap }));
      } catch (e: any) {
        setError(prev => prev ? `${prev}\nMind map generation failed: ${e.message}` : `Mind map generation failed: ${e.message}`);
      } finally {
        setLoadingStates(prev => ({ ...prev, mindMap: false }));
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, generating: false }));
    }
  }, [inputType, uploadedFile, imageUrl, inputText, selectedLanguage]);

  // Effect to turn off global generating loader when all parts are done
  useEffect(() => {
    if (!loadingStates.summary && !loadingStates.explanation && !loadingStates.quiz && !loadingStates.mindMap) {
      setLoadingStates(prev => ({ ...prev, generating: false }));
    }
  }, [loadingStates.summary, loadingStates.explanation, loadingStates.quiz, loadingStates.mindMap]);


  const canGenerate = (inputType === 'image' && uploadedFile) || (inputType === 'text' && inputText.trim().length > 0);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400 sm:text-5xl">
            أداة الدراسة (Study Tool)
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Upload an image or paste text from your lesson to get AI-powered summaries, explanations, quizzes, and mind maps.
          </p>
        </header>

        <section className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl mb-10">
          <LanguageSelector 
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
          <InputTabs activeInputType={inputType} onTabChange={handleInputTabChange} />
          {inputType === 'image' ? (
            <ImageUpload onImageChange={handleImageChange} currentImageUrl={imageUrl} />
          ) : (
            <TextInput text={inputText} onTextChange={handleTextChange} />
          )}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || loadingStates.generating}
            className="mt-6 w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-150"
          >
            {loadingStates.generating ? (
              <>
                <LoadingSpinner size="w-5 h-5 mr-2" />
                Generating Insights...
              </>
            ) : (
              'Generate Insights'
            )}
          </button>
          <ErrorMessage message={error} />
        </section>
        
        {(generatedContent.summary || generatedContent.explanation || generatedContent.quiz.length > 0 || generatedContent.mindMap || loadingStates.generating) && (
          <section className="mt-10">
            <ResultTabs activeTab={activeResultTab} onTabChange={setActiveResultTab} disabled={loadingStates.generating && !Object.values(generatedContent).some(v => Array.isArray(v) ? v.length > 0 : !!v)} />
            <div className="mt-1">
              {activeResultTab === 'summary' && (
                <ContentDisplayCard title="Summary" content={generatedContent.summary} isLoading={loadingStates.summary} />
              )}
              {activeResultTab === 'explanation' && (
                <ContentDisplayCard title="Explanation" content={generatedContent.explanation} isLoading={loadingStates.explanation} />
              )}
              {activeResultTab === 'quiz' && (
                <QuizView questions={generatedContent.quiz} isLoading={loadingStates.quiz} />
              )}
              {activeResultTab === 'mindmap' && (
                <ContentDisplayCard title="Mind Map" content={generatedContent.mindMap} isLoading={loadingStates.mindMap} />
              )}
            </div>
          </section>
        )}
         <footer className="mt-12 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Study Tool. Powered by AI.</p>
            <p className="text-xs mt-1">Make sure your <code className="bg-slate-200 px-1 rounded">process.env.API_KEY</code> for Gemini is correctly set.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
