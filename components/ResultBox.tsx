
import React from 'react';

interface ResultBoxProps {
  isLoading: boolean;
  loadingText: string;
  result: React.ReactNode | null;
}

const ResultBox: React.FC<ResultBoxProps> = ({ isLoading, loadingText, result }) => {
  if (!isLoading && !result) return null;

  return (
    <div className="mt-10 w-full bg-green-50 border-2 border-secondary/50 p-6 rounded-lg animate-fade-in">
      {isLoading ? (
        <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h3 className="text-primary font-semibold">{loadingText}</h3>
        </div>
      ) : (
        result
      )}
    </div>
  );
};

export default ResultBox;
