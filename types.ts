export enum Page {
  Home = 'Home',
  AiChatbot = 'AiChatbot',
}

export interface WeatherData {
  month: string;
  temp: number;
  humidity: number;
  precipitation: number;
}

export interface PriceDataPoint {
    month: string;
    price: number;
}

// Updated for multi-language voice support
export type VoiceLanguage = 'en-US' | 'hi-IN' | 'mr-IN' | 'pa-IN';

export const voiceLanguages: { code: VoiceLanguage; name: string }[] = [
    { code: 'en-US', name: 'English' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'mr-IN', name: 'Marathi' },
    { code: 'pa-IN', name: 'Punjabi' },
];

export interface AgriculturalData {
    crop: string;
    soil: string;
    growthStage: string;
    state: string;
    district: string;
}

export interface LocationData {
    state: string;
    district: string;
    city: string;
    soil: string;
}
