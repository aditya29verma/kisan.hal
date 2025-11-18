// This is a mock service to simulate Gemini API responses for the chatbot.
// In a real application, this would use @google/genai to make API calls.
import { VoiceLanguage } from '../types';

const dummyResponsesEN: { [key: string]: string } = {
  "hello": "Hi there! How can I assist you with your farming needs today?",
  "weather": "The forecast for the next few days shows sunny skies with a slight chance of rain on Friday. Temperatures will be around 32°C.",
  "soil": "For black cotton soil, it's best to plant crops like cotton, soybean, and jowar. Ensure good drainage to prevent waterlogging.",
  "fertilizer": "A balanced NPK fertilizer (Nitrogen, Phosphorus, Potassium) is recommended. For wheat, a ratio of 120:60:40 kg/ha is generally effective. Always perform a soil test for precise recommendations.",
  "pest": "For aphids on your cotton crop, you can use a solution of neem oil and water. Spray it on the affected plants every 7-10 days.",
  "default": "That's a great question. Could you provide more details? For example, which crop and what growth stage are you concerned about?",
};

const dummyResponsesHI: { [key: string]: string } = {
    "नमस्ते": "नमस्ते! मैं आपकी खेती-बाड़ी में कैसे मदद कर सकता हूँ?",
    "मौसम": "अगले कुछ दिनों के मौसम का पूर्वानुमान है कि आसमान साफ रहेगा और शुक्रवार को हल्की बारिश की संभावना है। तापमान 32°C के आसपास रहेगा।",
    "durg me weather": "दुर्ग में मौसम साफ है, तापमान 27 डिग्री सेल्सियस के आसपास है और बारिश की कोई आशंका नहीं है।",
    "मिट्टी": "काली कपास मिट्टी के लिए, कपास, सोयाबीन और ज्वार जैसी फसलें लगाना सबसे अच्छा है। जलभराव को रोकने के लिए अच्छी जल निकासी सुनिश्चित करें।",
    "default": "यह एक बहुत अच्छा सवाल है। क्या आप अधिक जानकारी प्रदान कर सकते हैं? उदाहरण के लिए, आप किस फसल और किस विकास चरण के बारे में चिंतित हैं?",
};

const dummyResponsesMR: { [key: string]: string } = {
    "नमस्कार": "नमस्कार! मी तुमच्या शेतीच्या गरजांसाठी कशी मदत करू शकेन?",
    "हवामान": "पुढील काही दिवसांचा हवामान अंदाज ढगाळ आकाशाचा आहे आणि शुक्रवारी पावसाची शक्यता आहे. तापमान ३०°C च्या आसपास राहील.",
    "माती": "काळी कापूस मातीसाठी कापूस, सोयाबीन आणि ज्वारीसारखी पिके घेणे उत्तम आहे. पाणी साचू नये म्हणून चांगल्या निचऱ्याची खात्री करा.",
    "default": "हा एक चांगला प्रश्न आहे. तुम्ही अधिक तपशील देऊ शकता का?",
};

const dummyResponsesPA: { [key: string]: string } = {
    "ਨਮਸਤੇ": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਅੱਜ ਤੁਹਾਡੀਆਂ ਖੇਤੀ ਦੀਆਂ ਲੋੜਾਂ ਵਿੱਚ ਕਿਵੇਂ ਸਹਾਇਤਾ ਕਰ ਸਕਦਾ ਹਾਂ?",
    "ਮੌਸਮ": "ਅਗਲੇ ਕੁਝ ਦਿਨਾਂ ਲਈ ਮੌਸਮ ਦੀ ਭਵਿੱਖਬਾਣੀ ਹੈ ਕਿ ਅਸਮਾਨ ਸਾਫ ਰਹੇਗਾ ਅਤੇ ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਹਲਕੀ ਬਾਰਿਸ਼ ਹੋ ਸਕਦੀ ਹੈ। ਤਾਪਮਾਨ 32°C ਦੇ ਆਸ-ਪਾਸ ਰਹੇਗਾ।",
    "ਮਿੱਟੀ": "ਕਾਲੀ ਕਪਾਹ ਦੀ ਮਿੱਟੀ ਲਈ, ਕਪਾਹ, ਸੋਇਆਬੀਨ ਅਤੇ ਜਵਾਰ ਵਰਗੀਆਂ ਫਸਲਾਂ ਬੀਜਣੀਆਂ ਸਭ ਤੋਂ ਵਧੀਆ ਹਨ। ਪਾਣੀ ਭਰਨ ਤੋਂ ਰੋਕਣ ਲਈ ਚੰਗੇ ਨਿਕਾਸ ਨੂੰ ਯਕੀਨੀ ਬਣਾਓ।",
    "default": "ਇਹ ਇੱਕ ਬਹੁਤ ਵਧੀਆ ਸਵਾਲ ਹੈ। ਕੀ ਤੁਸੀਂ ਹੋਰ ਵੇਰਵੇ ਦੇ ਸਕਦੇ ਹੋ?",
};


const responseMaps: Record<VoiceLanguage, { [key: string]: string }> = {
    'en-US': dummyResponsesEN,
    'hi-IN': dummyResponsesHI,
    'mr-IN': dummyResponsesMR,
    'pa-IN': dummyResponsesPA,
};

export const generateChatResponse = (prompt: string, lang: VoiceLanguage = 'en-US'): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerCasePrompt = prompt.toLowerCase();
      const responses = responseMaps[lang] || responseMaps['en-US'];
      let response = responses.default;

      // Simple keyword matching
      for (const key in responses) {
        if (lowerCasePrompt.includes(key)) {
          response = responses[key];
          break;
        }
      }
      resolve(response);
    }, 1000 + Math.random() * 1000); // Simulate network latency
  });
};
