
import React from 'react';
import { ActiveResultTab } from '../types';

interface ResultTabsProps {
  activeTab: ActiveResultTab;
  onTabChange: (tab: ActiveResultTab) => void;
  disabled: boolean;
}

const tabOptions: { key: ActiveResultTab; label: string }[] = [
  { key: 'summary', label: 'Summary' },
  { key: 'explanation', label: 'Explanation' },
  { key: 'quiz', label: 'Quiz' },
  { key: 'mindmap', label: 'Mind Map' },
];

const ResultTabs: React.FC<ResultTabsProps> = ({ activeTab, onTabChange, disabled }) => {
  const getTabStyle = (isActive: boolean) =>
    `px-4 py-3 font-medium text-sm focus:outline-none transition-all duration-200 ease-in-out border-b-2
     ${isActive ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
     ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`;

  return (
    <div className="flex border-b border-slate-200 space-x-1 sm:space-x-2">
      {tabOptions.map((tab) => (
        <button
          key={tab.key}
          onClick={() => !disabled && onTabChange(tab.key)}
          className={getTabStyle(activeTab === tab.key)}
          disabled={disabled}
          aria-pressed={activeTab === tab.key}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ResultTabs;
