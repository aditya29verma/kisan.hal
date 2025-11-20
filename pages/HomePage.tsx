
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
