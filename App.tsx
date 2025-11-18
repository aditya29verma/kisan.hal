
import React, { useState, useCallback } from 'react';
import HomePage from './pages/HomePage';
import AiChatbotPage from './pages/AiChatbotPage';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background text-text-primary font-sans">
      {currentPage === Page.Home && <HomePage navigateTo={navigateTo} />}
      {currentPage === Page.AiChatbot && <AiChatbotPage navigateTo={navigateTo} />}
    </div>
  );
};

export default App;
