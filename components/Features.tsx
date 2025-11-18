
import React from 'react';

const FeatureCard: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg text-center transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-primary">{title}</h3>
    <p>{description}</p>
  </div>
);

const Features: React.FC = () => {
  const features = [
    { icon: '🌱', title: 'Soil Analysis', description: 'Get recommendations based on your specific soil type and conditions.' },
    { icon: '☀️', title: 'Weather Integration', description: 'Real-time weather data to optimize your farming decisions.' },
    { icon: '🌾', title: 'Crop Optimization', description: 'Maximize yields with stage-specific agricultural advice.' },
    { icon: '🦠', title: 'Disease Prevention', description: 'Early detection and prevention strategies for common crop diseases.' },
    { icon: '🔉', title: 'Voice Advisory', description: 'Personal Crop Advisor which suits your soil and crop.' },
    { icon: '📈', title: 'Market Pricing', description: 'Real-time accurate market prices on our hand.' },
  ];

  return (
    <section className="py-20 text-center">
      <div className="container mx-auto px-5">
        <h2 className="text-4xl font-bold mb-4 text-primary">Core Features</h2>
        <p className="text-lg mb-12 max-w-2xl mx-auto">Comprehensive agricultural intelligence powered by modern technology.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
