import React, { useState } from 'react';
import FormSection from './FormSection';
import ResultBox from './ResultBox';
import { FormGroup, Select, SubmitButton } from './formElements';
import { optimizationGoals, currentYields, irrigationMethods, fertilizerPrograms } from '../constants';
import { AgriculturalData, LocationData } from '../types';

interface CropOptimizationFormProps {
    agriculturalData: AgriculturalData | null;
    locationData: LocationData | null;
}

const CropOptimizationForm: React.FC<CropOptimizationFormProps> = ({ agriculturalData, locationData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<React.ReactNode | null>(null);

    const isLocked = !agriculturalData || !locationData;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLocked) return;

        setIsLoading(true);
        setResult(null);

        const formData = new FormData(e.target as HTMLFormElement);
        const goal = formData.get('goal') as string;
        const irrigation = formData.get('irrigation') as string;
        const fertilizer = formData.get('fertilizer') as string;

        // Dummy optimization advice generation
        let advice = [];
        if (goal.toLowerCase().includes("yield")) {
            advice.push(`To increase the yield of your ${agriculturalData?.crop}, consider precision nutrient management. Based on your ${fertilizer.toLowerCase()} program, a supplementary micronutrient spray (Zinc, Boron) during the ${agriculturalData?.growthStage.toLowerCase()} stage can be highly effective.`);
        }
        if (goal.toLowerCase().includes("quality")) {
            advice.push(`For better quality, especially in ${locationData?.soil.toLowerCase()}, potassium supplementation is key. A foliar spray of potassium nitrate can improve fruit size and shelf life.`);
        }
        if (irrigation.toLowerCase().includes("drip")) {
            advice.push("Since you are using drip irrigation, fertigation is a highly efficient option. This will deliver nutrients directly to the root zone, maximizing uptake and minimizing waste.");
        } else {
             advice.push("Consider mulching to conserve soil moisture, which is crucial for nutrient uptake and overall plant health, especially with your current irrigation method.");
        }
        advice.push(`Regularly monitor for pests and diseases, as a healthy plant is better able to utilize resources for growth and yield.`);


        setTimeout(() => {
            setResult(
                <>
                    <h3 className="text-2xl font-bold text-primary mb-4 text-center">📈 Crop Optimization Plan</h3>
                    <div className="bg-white p-4 rounded-md mb-4 shadow-sm text-left w-full">
                        <p><strong>Target Crop:</strong> {agriculturalData?.crop} ({agriculturalData?.soil})</p>
                        <p><strong>Location:</strong> {locationData?.city}, {locationData?.state}</p>
                        <p><strong>Primary Goal:</strong> {goal}</p>
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-text-primary text-left w-full">💡 Recommended Actions:</h4>
                    <ul className="list-disc list-inside space-y-2 text-left w-full">
                        {advice.map((step, index) => <li key={index}>{step}</li>)}
                    </ul>
                </>
            );
            setIsLoading(false);
        }, 1500);
    };

    return (
        <FormSection
            id="optimization-form"
            title="Crop Optimization"
            subtitle="Get an advanced plan to enhance your crop's performance."
        >
            {isLocked && (
                <div className="w-full p-4 mb-6 text-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md">
                    <p className="font-bold">This section is locked.</p>
                    <p>Please complete and submit the "Agricultural Information" and "Location Information" forms first to unlock.</p>
                </div>
            )}
            <form onSubmit={handleSubmit} className="w-full">
                <fieldset disabled={isLocked} className="disabled:opacity-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <FormGroup label="Primary Goal">
                            <Select name="goal" options={optimizationGoals} placeholder="Select your main goal" required />
                        </FormGroup>
                        <FormGroup label="Current Yield Status">
                            <Select name="yield" options={currentYields} placeholder="Select your current yield" required />
                        </FormGroup>
                        <FormGroup label="Irrigation Method">
                            <Select name="irrigation" options={irrigationMethods} placeholder="Select your irrigation type" required />
                        </FormGroup>
                        <FormGroup label="Fertilizer Program">
                            <Select name="fertilizer" options={fertilizerPrograms} placeholder="Select your fertilizer program" required />
                        </FormGroup>
                    </div>
                    <SubmitButton text="Generate Optimization Plan" disabled={isLoading || isLocked} />
                </fieldset>
            </form>
            <ResultBox isLoading={isLoading} loadingText="⚙️ Calculating Optimization Strategy..." result={result} />
        </FormSection>
    );
};

export default CropOptimizationForm;
