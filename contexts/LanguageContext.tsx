
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AppLanguage } from '../types';
import { translations } from '../translations';

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<AppLanguage>('en');

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            // Fallback to English if missing in current language
            let fallbackValue: any = translations['en'];
            for (const fallbackK of keys) {
                if (fallbackValue && typeof fallbackValue === 'object' && fallbackK in fallbackValue) {
                    fallbackValue = fallbackValue[fallbackK];
                } else {
                    return key; // Return key if not found
                }
            }
            return fallbackValue as string;
        }
    }
    return value as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
