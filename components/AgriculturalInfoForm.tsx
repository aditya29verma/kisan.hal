import React, { useState } from 'react';
import FormSection from './FormSection';
import ResultBox from './ResultBox';
import { FormGroup, Select, SubmitButton } from './formElements';
import { soilTypes, cropTypes, seedTypes, seedNames, growthStages, states, stateDistrictMap } from '../constants';
import { AgriculturalData } from '../types';

interface AgriculturalInfoFormProps {
    onSuccess: (data: AgriculturalData) => void;
}

const AgriculturalInfoForm: React.FC<AgriculturalInfoFormProps> = ({ onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<React.ReactNode | null>(null);
    const [selectedState, setSelectedState] = useState('');
    const [availableDistricts, setAvailableDistricts] = useState<{ value: string; label: string }[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newState = e.target.value;
        setSelectedState(newState);
        setSelectedDistrict(''); // Reset district on state change
        const districtsForState = stateDistrictMap[newState] || [];
        setAvailableDistricts(districtsForState.map(d => ({ value: d, label: d })));
    };
    
    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDistrict(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);

        const formData = new FormData(e.target as HTMLFormElement);
        const crop = formData.get('cropType') as string;
        const soil = formData.get('soilType') as string;
        const district = formData.get('district') as string;
        const growthStage = formData.get('growthStage') as string;


        setTimeout(() => {
            const submittedData: AgriculturalData = {
                crop,
                soil,
                growthStage,
                state: selectedState,
                district,
            };
            onSuccess(submittedData);
            
            setResult(
                <>
                    <h3 className="text-2xl font-bold text-primary mb-4">✅ Your Personalized Crop Advisory</h3>
                    <div className="bg-white p-4 rounded-md mb-4 shadow-sm">
                        <p><strong>🌾 Crop:</strong> {crop}</p>
                        <p><strong>🌱 Soil:</strong> {soil}</p>
                        <p><strong>📍 Location:</strong> {district}, {selectedState}</p>
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-text-primary">💡 Expert Recommendations:</h4>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Ensure consistent irrigation, maintaining soil moisture at 60-70%.</li>
                        <li>Apply a balanced NPK fertilizer (12:32:16) at a rate of 50kg/acre.</li>
                        <li>Monitor for common pests like aphids and apply neem oil solution as a preventive measure.</li>
                        <li>Weed control is crucial during this growth stage. Perform manual weeding or use a selective herbicide.</li>
                    </ul>
                </>
            );
            setIsLoading(false);
        }, 1500);
    };

    return (
        <FormSection
            id="advisory-form"
            title="Agricultural Information"
            subtitle="Complete all fields to generate your customized crop advisory report."
        >
            <form onSubmit={handleSubmit} className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <FormGroup label="Soil Type"><Select name="soilType" options={soilTypes} placeholder="Select your soil type" required /></FormGroup>
                    <FormGroup label="Crop Type"><Select name="cropType" options={cropTypes} placeholder="Select your crop" required /></FormGroup>
                    <FormGroup label="Seed Type"><Select name="seedType" options={seedTypes} placeholder="Select your seed type" required /></FormGroup>
                    <FormGroup label="Name of Seed"><Select name="seedName" options={seedNames} placeholder="Select your seed" required /></FormGroup>
                    <FormGroup label="Growth Stage"><Select name="growthStage" options={growthStages} placeholder="Select growth stage" required /></FormGroup>
                    <FormGroup label="Your State">
                        <Select 
                            name="state" 
                            options={states} 
                            placeholder="Select your State" 
                            required 
                            value={selectedState} 
                            onChange={handleStateChange} 
                        />
                    </FormGroup>
                    <FormGroup label="Your District">
                        <Select 
                            name="district" 
                            options={availableDistricts} 
                            placeholder="Select District" 
                            required 
                            disabled={!selectedState} 
                            value={selectedDistrict}
                            onChange={handleDistrictChange}
                        />
                    </FormGroup>
                </div>
                <SubmitButton text="Generate Crop Advisory" disabled={isLoading} />
            </form>
            <ResultBox isLoading={isLoading} loadingText="🔄 Analyzing Your Farm Data..." result={result} />
        </FormSection>
    );
};

export default AgriculturalInfoForm;
