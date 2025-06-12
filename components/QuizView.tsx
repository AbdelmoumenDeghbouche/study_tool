
import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface QuizViewProps {
  questions: QuizQuestion[] | null;
  isLoading: boolean;
}

const QuizView: React.FC<QuizViewProps> = ({ questions: initialQuestions, isLoading }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [showAnswers, setShowAnswers] = useState<boolean[]>([]);

  useEffect(() => {
    if (initialQuestions) {
      setQuestions(initialQuestions.map(q => ({ ...q, userAnswer: undefined, isCorrect: undefined })));
      setShowAnswers(new Array(initialQuestions.length).fill(false));
    } else {
      setQuestions([]);
      setShowAnswers([]);
    }
  }, [initialQuestions]);

  const handleOptionSelect = (questionIndex: number, option: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].userAnswer = option;
    newQuestions[questionIndex].isCorrect = option === newQuestions[questionIndex].correctAnswer;
    setQuestions(newQuestions);
  };

  const toggleShowAnswer = (questionIndex: number) => {
    const newShowAnswers = [...showAnswers];
    newShowAnswers[questionIndex] = !newShowAnswers[questionIndex];
    setShowAnswers(newShowAnswers);
  };
  
  const getOptionClasses = (question: QuizQuestion, option: string, index: number) => {
    let classes = "w-full text-left p-3 border rounded-lg hover:bg-slate-100 transition-colors duration-150 flex items-center space-x-3 ";
    const isSelected = question.userAnswer === option;
    const isRevealed = showAnswers[index];

    if (isSelected) {
      classes += question.isCorrect ? "bg-green-100 border-green-400 text-green-700 " : "bg-red-100 border-red-400 text-red-700 ";
    } else {
      classes += "border-slate-300 ";
    }

    if (isRevealed) {
        if (option === question.correctAnswer) {
            classes += "ring-2 ring-green-500 ring-offset-1 ";
        } else if (isSelected && option !== question.correctAnswer) {
            classes += "ring-2 ring-red-500 ring-offset-1 ";
        }
    }
    return classes;
  };


  if (isLoading) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6 my-6 min-h-[200px] flex items-center justify-center">
        <LoadingSpinner size="w-12 h-12" />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6 my-6 min-h-[200px] flex items-center justify-center">
        <p className="text-slate-500 italic">Quiz will appear here once generated.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 my-6 space-y-8">
      <h3 className="text-xl font-semibold text-slate-700 mb-4">Quiz</h3>
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="p-4 border border-slate-200 rounded-lg shadow-sm">
          <p className="font-semibold text-slate-700 mb-3">{qIndex + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((option, oIndex) => (
              <button
                key={oIndex}
                onClick={() => handleOptionSelect(qIndex, option)}
                className={getOptionClasses(q, option, qIndex)}
                disabled={showAnswers[qIndex]} // Disable options if answer is shown
              >
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium 
                  ${q.userAnswer === option ? (q.isCorrect ? 'bg-green-500 border-green-500 text-white' : 'bg-red-500 border-red-500 text-white') : 'border-slate-400 text-slate-600'}`}>
                  {String.fromCharCode(65 + oIndex)}
                </span>
                <span>{option}</span>
              </button>
            ))}
          </div>
          <div className="mt-4">
            <button
              onClick={() => toggleShowAnswer(qIndex)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium py-1 px-3 rounded-md bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              {showAnswers[qIndex] ? 'Hide' : 'Show'} Answer
            </button>
            {showAnswers[qIndex] && (
              <p className={`mt-2 text-sm font-medium p-2 rounded-md ${q.correctAnswer === q.userAnswer && q.userAnswer !== undefined ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-700'}`}>
                Correct Answer: {q.correctAnswer}
                {q.userAnswer !== undefined && q.userAnswer !== q.correctAnswer && (
                    <span className="block text-red-600">Your answer: {q.userAnswer}</span>
                )}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizView;
