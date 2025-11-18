
import React from 'react';

interface HeaderProps {
  onNavigate: () => void;
}

const SmartFarmLogo: React.FC = () => (
    <div className="mx-auto mb-4 w-32 h-32 relative flex items-center justify-center">
        {/* Farmer Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white opacity-90 drop-shadow-md">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
         {/* Phone Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute bottom-5 right-1 text-white drop-shadow-md">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" stroke="black" strokeWidth="2" />
        </svg>
    </div>
);

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header 
        className="bg-cover bg-center text-white text-center py-20 px-4 relative"
        style={{ backgroundImage: "linear-gradient(rgba(56, 118, 29, 0.8), rgba(56, 118, 29, 0.8)), url('https://images.unsplash.com/photo-1615822365239-a81e39a3f23a?q=80&w=1600&auto=format&fit=crop')" }}
    >
      <div className="container mx-auto">
        <button className="absolute top-4 right-4 bg-secondary/80 hover:bg-secondary text-white font-semibold py-2 px-4 rounded-lg transition duration-300">🌐 हिंदी</button>
        
        {/* New Logo */}
        <div className="flex flex-col items-center">
            <SmartFarmLogo />
            <h1 className="text-6xl font-bold tracking-tight drop-shadow-md">Kisan.hal</h1>
            <p className="text-2xl mt-1 drop-shadow-md">yaha milega hal</p>
        </div>
        
        <p className="text-lg md:text-xl max-w-3xl mx-auto mt-8 mb-2">
          Revolutionizing agriculture with AI-powered insights. Get personalized recommendations for your crops based on soil type, weather conditions, location, and growth stages.
        </p>
        <p className="font-semibold text-xl mb-8">Check it out !!</p>
        <button onClick={onNavigate} className="bg-primary hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105">
          Get Started with our AI Chatbot
        </button>
      </div>
    </header>
  );
};

export default Header;
