import React, { useState } from 'react';
import Header from '../components/Header';
import Features from '../components/Features';
import AgriculturalInfoForm from '../components/AgriculturalInfoForm';
import MarketPriceForm from '../components/MarketPriceForm';
import LeafDiseaseForm from '../components/LeafDiseaseForm';
import DiseasePreventionForm from '../components/DiseasePreventionForm';
import LocationInfoForm from '../components/LocationInfoForm';
import CropOptimizationForm from '../components/CropOptimizationForm';
import Footer from '../components/Footer';
import { Page, AgriculturalData, LocationData } from '../types';

interface HomePageProps {
  navigateTo: (page: Page) => void;
}

const SectionDivider: React.FC = () => (
  <hr className="border-0 h-px bg-gradient-to-r from-transparent via-secondary/70 to-transparent my-16" />
);

const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
  const [agriculturalData, setAgriculturalData] = useState<AgriculturalData | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  return (
    <>
      <Header onNavigate={() => navigateTo(Page.AiChatbot)} />
      <main className="main-content">
        <section className="py-20">
          <div className="container mx-auto px-5 max-w-4xl">
            <h2 className="text-4xl font-bold text-center mb-6 text-primary">The Agricultural Challenge</h2>
            <p className="text-lg text-center leading-relaxed">
              Farmers face complex decisions daily about crop management, fertilizer application, and irrigation timing. Our Smart Crop Advisory System leverages data science and agricultural expertise to provide actionable insights, helping farmers optimize yields while reducing costs and environmental impact.
            </p>
            <p className="mt-4 text-center leading-relaxed">
              A majority of small and marginal farmers in India rely on traditional knowledge, local shopkeepers, or guesswork. They lack access to personalized, real-time advisory services. This often leads to poor yield, excessive input costs, and environmental degradation. Our smart advisory solution empowers farmers with scientific insights in their native language and reduces dependency on unreliable third-party advice.
            </p>
          </div>
        </section>
        <SectionDivider />
        <Features />
        <AgriculturalInfoForm onSuccess={setAgriculturalData} />
        <MarketPriceForm />
        <LeafDiseaseForm />
        <DiseasePreventionForm />
        <LocationInfoForm onSuccess={setLocationData} />
        <CropOptimizationForm agriculturalData={agriculturalData} locationData={locationData} />
        <SectionDivider />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
