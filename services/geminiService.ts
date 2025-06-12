import { GoogleGenAI, GenerateContentResponse, Content, Part, GroundingChunk } from "@google/genai";
import { QuizQuestion } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn(
    "API_KEY environment variable not found. The application will not be able to connect to the Gemini API."
  );
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const textModel = 'gemini-2.5-flash-preview-04-17';

function parseJsonFromText(text: string): any {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse JSON response:", e, "Raw text:", text);
    throw new Error("Failed to parse AI response as JSON. The format might be incorrect.");
  }
}

const generateContentWithPrompt = async (
  prompt: string, 
  inputContent: string | Part,
  isJsonOutput: boolean = false
): Promise<{ text: string; groundingChunks?: GroundingChunk[] }> => {
  if (!API_KEY) throw new Error("API Key for Gemini not configured.");

  const contents: Content[] = [{ role: "user", parts: [] }];
  if (typeof inputContent === 'string') {
    contents[0].parts.push({ text: inputContent });
  } else {
    contents[0].parts.push(inputContent); // Assumes inputContent is a Part object (e.g., for image)
  }
   contents[0].parts.push({text: prompt});


  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: textModel,
      contents: contents,
      config: {
        ...(isJsonOutput && { responseMimeType: "application/json" }),
      },
    });
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    return {
      text: response.text,
      groundingChunks: groundingMetadata?.groundingChunks as GroundingChunk[] | undefined,
    };
  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API error: ${error.message}`);
    }
    throw new Error("An unknown error occurred with the Gemini API.");
  }
};


export const generateSummary = async (content: string | Part): Promise<string> => {
  const prompt = "Summarize the following lesson content concisely:";
  const result = await generateContentWithPrompt(prompt, content);
  return result.text;
};

export const generateExplanation = async (content: string | Part): Promise<string> => {
  const prompt = "Explain the following lesson content in a clear and detailed manner, as if explaining to a student, and provide the explanation in Arabic:";
  const result = await generateContentWithPrompt(prompt, content);
  return result.text;
};

export const generateQuiz = async (content: string | Part): Promise<QuizQuestion[]> => {
  const prompt = `Based on the following lesson content, generate a quiz. 
The quiz should consist of 3-5 multiple-choice questions. 
For each question, provide:
1.  "question": The question text (string).
2.  "options": An array of 4 unique string options.
3.  "correctAnswer": The string of the correct answer, which must exactly match one of the provided options.

Format the entire output as a single JSON array of objects. Example:
[
  {
    "question": "What is the primary function of the mitochondria?",
    "options": ["Protein synthesis", "Energy production (ATP)", "Waste disposal", "Cellular movement"],
    "correctAnswer": "Energy production (ATP)"
  }
]`;
  const result = await generateContentWithPrompt(prompt, content, true);
  try {
    const parsedQuiz = parseJsonFromText(result.text);
    if (Array.isArray(parsedQuiz)) {
      return parsedQuiz.map((q: any) => ({
        question: q.question || "Missing question",
        options: Array.isArray(q.options) && q.options.length > 0 ? q.options : ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: q.correctAnswer || (q.options && q.options[0]) || "N/A",
      })) as QuizQuestion[];
    }
    console.error("Parsed quiz is not an array:", parsedQuiz);
    throw new Error("Quiz data is not in the expected array format.");
  } catch (error) {
     console.error("Error processing quiz data:", error);
     throw error; // Re-throw to be caught by the caller
  }
};

export const generateMindMap = async (content: string | Part): Promise<string> => {
  const prompt = `Generate a text-based mind map for the following lesson content. 
Outline key concepts and their relationships hierarchically. 
Use indentation (e.g., tabs or spaces) or bullet points (e.g., -, *, +) to represent the structure. 
The main topic should be at the top level. Sub-topics and details should be nested underneath.`;
  const result = await generateContentWithPrompt(prompt, content);
  return result.text;
};
