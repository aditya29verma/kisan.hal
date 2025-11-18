import React, { useState } from 'react';
import FormSection from './FormSection';
import ResultBox from './ResultBox';
import { FormGroup, Select, SubmitButton } from './formElements';
import { cropTypes, growthStages, states, stateDistrictMap, soilTypes } from '../constants';

const DiseasePreventionForm: React.FC = () => {
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
        const growthStage = formData.get('growthStage') as string;

        // Dummy prevention advice generation
        let preventionSteps = [
            `Rotate ${crop} with non-host crops to break disease cycles.`,
            "Select and plant certified disease-resistant varieties suitable for your region.",
            "Ensure proper field sanitation by removing crop debris and weeds.",
            "Maintain optimal plant spacing to improve air circulation and reduce humidity within the canopy.",
            "Monitor weather forecasts and consider applying preventive fungicides if conditions are favorable for disease development.",
        ];

        if (crop.toLowerCase().includes("wheat")) {
            preventionSteps.push("Scout regularly for signs of rust and powdery mildew, especially during the vegetative stage.");
        } else if (crop.toLowerCase().includes("rice")) {
            preventionSteps.push("Manage water levels carefully to prevent conditions favorable for blast and sheath blight.");
        } else if (crop.toLowerCase().includes("cotton")) {
             preventionSteps.push("Be vigilant for signs of leaf curl virus and bacterial blight. Control insect vectors like whiteflies.");
        }


        setTimeout(() => {
            setResult(
                <>
                    <h3 className="text-2xl font-bold text-primary mb-4 text-center">✅ Disease Prevention Plan for {crop}</h3>
                    <div className="bg-white p-4 rounded-md mb-4 shadow-sm text-left w-full">
                        <p><strong>🌾 Crop:</strong> {crop}</p>
                        <p><strong>🌱 Growth Stage:</strong> {growthStage}</p>
                        <p><strong>📍 Location:</strong> {selectedDistrict}, {selectedState}</p>
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-text-primary text-left w-full">🛡️ Proactive Prevention Strategies:</h4>
                    <ul className="list-disc list-inside space-y-2 text-left w-full">
                        {preventionSteps.map((step, index) => <li key={index}>{step}</li>)}
                    </ul>
                </>
            );
            setIsLoading(false);
        }, 1500);
    };

    return (
        <FormSection
            id="prevention-form"
            title="Disease Prevention"
            subtitle="Get a proactive plan to protect your crops from common diseases."
        >
            <form onSubmit={handleSubmit} className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <FormGroup label="Crop Type"><Select name="cropType" options={cropTypes} placeholder="Select your crop" required /></FormGroup>
                    <FormGroup label="Growth Stage"><Select name="growthStage" options={growthStages} placeholder="Select growth stage" required /></FormGroup>
                    <FormGroup label="Soil Type"><Select name="soilType" options={soilTypes} placeholder="Select your soil type" required /></FormGroup>
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
                <SubmitButton text="Get Prevention Plan" disabled={isLoading} />
            </form>
            <ResultBox isLoading={isLoading} loadingText="🔬 Generating Prevention Strategy..." result={result} />
        </FormSection>
    );
};

export default DiseasePreventionForm;