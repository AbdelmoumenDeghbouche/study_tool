
import React from 'react';

interface TextInputProps {
  text: string;
  onTextChange: (text: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ text, onTextChange }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="text-input" className="block text-sm font-medium text-slate-700">
        Paste or Type Lesson Content
      </label>
      <textarea
        id="text-input"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        rows={10}
        placeholder="Enter the lesson text here..."
        className="block w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
      />
      <p className="text-xs text-slate-500">
        Copy and paste text from your lesson materials (e.g., PDF, document).
      </p>
    </div>
  );
};

export default TextInput;
