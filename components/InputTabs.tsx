
import React from 'react';
import { InputType } from '../types';

interface InputTabsProps {
  activeInputType: InputType;
  onTabChange: (type: InputType) => void;
}

const InputTabs: React.FC<InputTabsProps> = ({ activeInputType, onTabChange }) => {
  const tabStyle = (isActive: boolean) =>
    `px-4 py-2 font-semibold rounded-t-lg focus:outline-none transition-colors duration-200 ease-in-out
     ${isActive ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`;

  return (
    <div className="flex border-b border-slate-300 mb-4">
      <button
        onClick={() => onTabChange('image')}
        className={tabStyle(activeInputType === 'image')}
        aria-pressed={activeInputType === 'image'}
      >
        Upload Image
      </button>
      <button
        onClick={() => onTabChange('text')}
        className={tabStyle(activeInputType === 'text')}
        aria-pressed={activeInputType === 'text'}
      >
        Paste Text
      </button>
    </div>
  );
};

export default InputTabs;
