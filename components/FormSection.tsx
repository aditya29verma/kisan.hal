
import React from 'react';

interface FormSectionProps {
  id: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ id, title, subtitle, children }) => {
  return (
    <section id={id} className="py-20 bg-white border-t-2 border-border-color">
      <div className="container mx-auto px-5">
        <div className="max-w-3xl mx-auto flex flex-col items-center p-6 md:p-10 rounded-2xl shadow-xl bg-gray-50">
          <h2 className="text-4xl font-bold mb-4 text-primary text-center">{title}</h2>
          <p className="text-center mb-8">{subtitle}</p>
          {children}
        </div>
      </div>
    </section>
  );
};

export default FormSection;
