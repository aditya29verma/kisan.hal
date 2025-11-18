import { useState, useEffect, useCallback } from 'react';

const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;

  const speak = useCallback(({ text, lang = 'en-US' }: { text: string; lang?: string }) => {
    if (synth.speaking) {
      synth.cancel();
    }
    if (text !== '') {
      const utterThis = new SpeechSynthesisUtterance(text);
      
      utterThis.onstart = () => {
        setIsSpeaking(true);
      };

      utterThis.onend = () => {
        setIsSpeaking(false);
      };

      utterThis.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        setIsSpeaking(false);
      };
      
      const voices = synth.getVoices();
      let selectedVoice = voices.find(voice => voice.lang === lang);

      // Fallback to a related language if the specific one is not found
      if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang.startsWith(lang.split('-')[0]));
      }

      if (selectedVoice) {
        utterThis.voice = selectedVoice;
      } else {
        console.warn(`No voice found for lang: ${lang}`);
      }

      synth.speak(utterThis);
    }
  }, [synth]);
  
  const cancel = useCallback(() => {
    if (synth) {
      synth.cancel();
      setIsSpeaking(false);
    }
  }, [synth]);

  useEffect(() => {
    // Ensure voices are loaded
    if (synth && synth.getVoices().length === 0) {
        synth.onvoiceschanged = () => {}; // This helps trigger voice loading in some browsers
    }
    
    return () => {
      if (synth) {
        synth.cancel();
      }
    };
  }, [synth]);


  return {
    isSpeaking,
    speak,
    cancel,
    hasSpeechSupport: !!window.speechSynthesis,
  };
};

export default useTextToSpeech;
