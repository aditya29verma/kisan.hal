import React from 'react';

interface FormGroupProps {
  label: string;
  children: React.ReactNode;
}

export const FormGroup: React.FC<FormGroupProps> = ({ label, children }) => (
  <div className="mb-6 w-full">
    <label className="block font-bold mb-2 text-primary">{label} *</label>
    {children}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder: string;
}

export const Select: React.FC<SelectProps> = ({ options, placeholder, ...props }) => (
  <select defaultValue="" {...props} className="w-full p-3 border border-border-color rounded-lg box-border text-base focus:ring-2 focus:ring-secondary focus:outline-none text-text-primary bg-white">
    <option value="" disabled>{placeholder}</option>
    {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
  </select>
);

export const SubmitButton: React.FC<{ text: string; disabled?: boolean }> = ({ text, disabled }) => (
  <div className="text-center w-full mt-4">
    <button type="submit" className="bg-primary hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={disabled}>
      {text}
    </button>
  </div>
);
