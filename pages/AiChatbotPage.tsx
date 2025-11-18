
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Page, VoiceLanguage, voiceLanguages } from '../types';
import { generateChatResponse } from '../services/geminiService';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useTextToSpeech from '../hooks/useTextToSpeech';

interface AiChatbotPageProps {
  navigateTo: (page: Page) => void;
}

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

type ChatMode = 'text' | 'voice';

const welcomeMessages: Record<VoiceLanguage, string> = {
    'en-US': "Hello! I am Kisan.hal's AI assistant. Ready for your questions.",
    'hi-IN': "नमस्ते! मैं आपकी कैसे सहायता कर सकता हूँ?",
    'mr-IN': "नमस्कार! मी तुमची कशी मदत करू शकेन?",
    'pa-IN': "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
};

const ChatbotIcon: React.FC = () => (
    <div className="w-10 h-10 mr-2 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M12 7c-1.5 0-3 1.5-3 3v2" />
            <path d="M12 12c1.5 0 3 1.5 3 3v-2" />
        </svg>
    </div>
);


const AiChatbotPage: React.FC<AiChatbotPageProps> = ({ navigateTo }) => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Hello! I am Kisan.hal's AI assistant. How can I help you with your farming questions today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>('text');
  const [voiceLanguage, setVoiceLanguage] = useState<VoiceLanguage>('en-US');

  const { speak, isSpeaking, hasSpeechSupport, cancel } = useTextToSpeech();
  const { text: transcribedText, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition({
    lang: voiceLanguage
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isListening) {
      setInput(transcribedText);
    }
  }, [transcribedText, isListening]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const newUserMessage: Message = { sender: 'user', text: messageText.trim() };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const langForAPI = mode === 'voice' ? voiceLanguage : 'en-US';
      const aiResponse = await generateChatResponse(messageText, langForAPI);
      const newAiMessage: Message = { sender: 'ai', text: aiResponse };
      setMessages(prev => [...prev, newAiMessage]);
      
      if (mode === 'voice' && hasSpeechSupport) {
        speak({ text: aiResponse, lang: voiceLanguage });
      }

    } catch (error) {
      const errorMessage: Message = { sender: 'ai', text: "I'm sorry, I'm having trouble connecting. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, mode, hasSpeechSupport, speak, voiceLanguage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };
  
  const handleMicClick = () => {
    if (isListening) {
      stopListening();
       if (mode === 'voice') {
         // Use a timeout to allow the final transcript to process
         setTimeout(() => handleSendMessage(input), 500);
       }
    } else {
      startListening();
    }
  };

  const handleModeSwitch = (newMode: ChatMode) => {
    if (newMode === mode) return;

    if (isListening) stopListening();
    if (isSpeaking) cancel();
    setInput('');
    setMode(newMode);

    if (newMode === 'text') {
        setMessages([{ sender: 'ai', text: "Hello! How can I help you today?" }]);
    } else {
        const welcome = welcomeMessages[voiceLanguage];
        setMessages([{ sender: 'ai', text: welcome }]);
        if (hasSpeechSupport) speak({ text: welcome, lang: voiceLanguage });
    }
  }

  const handleLanguageChange = (newLang: VoiceLanguage) => {
    if (newLang === voiceLanguage) return;

    if (isListening) stopListening();
    if (isSpeaking) cancel();
    setInput('');
    setVoiceLanguage(newLang);

    const welcome = welcomeMessages[newLang];
    setMessages([{ sender: 'ai', text: welcome }]);
    if (hasSpeechSupport) speak({ text: welcome, lang: newLang });
  };


  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-primary text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10 flex-wrap gap-2">
        <div className="flex items-center">
            <ChatbotIcon />
            <h1 className="text-xl md:text-2xl font-bold">AI Farmer's Chatbot</h1>
        </div>
         <div className="flex items-center gap-2 md:gap-4">
             {hasSpeechSupport && (
                <div className="flex items-center gap-2">
                    <div className="bg-black/20 rounded-full p-1 flex">
                        <button onClick={() => handleModeSwitch('text')} className={`px-3 py-1 text-sm font-semibold rounded-full ${mode === 'text' ? 'bg-white text-primary' : 'text-white'}`}>Text</button>
                        <button onClick={() => handleModeSwitch('voice')} className={`px-3 py-1 text-sm font-semibold rounded-full ${mode === 'voice' ? 'bg-white text-primary' : 'text-white'}`}>Voice</button>
                    </div>
                    {mode === 'voice' && (
                        <div className="relative">
                            <select
                                value={voiceLanguage}
                                onChange={(e) => handleLanguageChange(e.target.value as VoiceLanguage)}
                                className="bg-secondary text-white font-semibold py-2 px-3 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
                                aria-label="Select voice language"
                            >
                                {voiceLanguages.map(lang => (
                                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            )}
            <button
              onClick={() => navigateTo(Page.Home)}
              className="bg-secondary hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              &larr; Back
            </button>
         </div>
      </header>

      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-white font-bold">AI</div>}
              <div className={`max-w-sm md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-text-primary rounded-bl-none shadow'}`}>
                <p className="text-base">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start gap-3 justify-start">
               <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-white font-bold">AI</div>
               <div className="max-w-sm md:max-w-md p-3 rounded-2xl bg-white text-text-primary rounded-bl-none shadow">
                  <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm p-4 sticky bottom-0">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
          {mode === 'text' && (
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about crops, soil, weather..."
                className="flex-1 w-full p-3 border border-border-color rounded-full focus:ring-2 focus:ring-secondary focus:outline-none"
                disabled={isLoading}
            />
          )}
          {hasRecognitionSupport && (
            <button
                type="button"
                onClick={handleMicClick}
                className={`p-3 rounded-full transition-colors duration-300 ${mode === 'voice' ? 'flex-1 h-16 text-2xl' : ''} ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-secondary text-white hover:bg-green-600'}`}
                disabled={isLoading || isSpeaking}
                title={isListening ? "Stop listening" : "Start listening"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          )}
          {mode === 'text' && (
            <button
                type="submit"
                className="p-3 rounded-full bg-primary text-white hover:bg-green-700 disabled:bg-gray-400 transition-colors duration-300"
                disabled={isLoading || !input.trim()}
                title="Send message"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </button>
          )}
        </form>
         {mode === 'voice' && isListening && <p className="text-center mt-2 text-gray-600 italic">{input || 'Listening...'}</p>}
      </footer>
    </div>
  );
};

export default AiChatbotPage;
