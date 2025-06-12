import React from 'react';

export type Language = 'en' | 'ar' | 'es';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onLanguageChange }) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <label className="text-sm font-medium text-gray-700">Language:</label>
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value as Language)}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="en">English</option>
        <option value="ar">العربية</option>
        <option value="es">Español</option>
      </select>
    </div>
  );
};

export default LanguageSelector; 