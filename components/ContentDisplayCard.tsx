
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ContentDisplayCardProps {
  title: string;
  content: string | null;
  isLoading: boolean;
}

const ContentDisplayCard: React.FC<ContentDisplayCardProps> = ({ title, content, isLoading }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 my-6 min-h-[200px] flex flex-col">
      <h3 className="text-xl font-semibold text-slate-700 mb-4">{title}</h3>
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner size="w-12 h-12" />
        </div>
      ) : content ? (
        <div className="text-slate-600 prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed">
          {content}
        </div>
      ) : (
        <p className="text-slate-500 italic flex-grow flex items-center justify-center">
          Content will appear here once generated.
        </p>
      )}
    </div>
  );
};

export default ContentDisplayCard;
