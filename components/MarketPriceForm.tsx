import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import FormSection from './FormSection';
import ResultBox from './ResultBox';
import { FormGroup, Select, SubmitButton } from './formElements';
import { states, stateDistrictMap, cropTypes, districtCityMap } from '../constants';
import { PriceDataPoint } from '../types';

const PriceHistoryChart: React.FC<{ data: PriceDataPoint[] }> = ({ data }) => (
    <div className="mt-6">
        <h4 className="text-xl font-bold text-center text-primary mb-4">4-Month Price History</h4>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={['dataMin - 100', 'dataMax + 100']} label={{ value: 'Price (₹/Quintal)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="price" name="Price" stroke="#38761d" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);


const MarketPriceForm: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<React.ReactNode | null>(null);
    const [selectedState, setSelectedState] = useState('');
    const [availableDistricts, setAvailableDistricts] = useState<{ value: string; label: string }[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [availableCities, setAvailableCities] = useState<{ value: string; label: string }[]>([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [priceHistory, setPriceHistory] = useState<PriceDataPoint[]>([]);

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newState = e.target.value;
        setSelectedState(newState);
        setSelectedDistrict('');
        setSelectedCity('');
        const districtsForState = stateDistrictMap[newState] || [];
        setAvailableDistricts(districtsForState.map(d => ({ value: d, label: d })));
        setAvailableCities([]);
    };
    
    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDistrict = e.target.value;
        setSelectedDistrict(newDistrict);
        setSelectedCity('');
        const citiesForDistrict = districtCityMap[newDistrict] || districtCityMap["Default"];
        setAvailableCities(citiesForDistrict.map(c => ({ value: c, label: c })));
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCity(e.target.value);
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);
        setPriceHistory([]);
        
        const formData = new FormData(e.target as HTMLFormElement);
        const crop = formData.get('cropType') as string;

        setTimeout(() => {
            const basePrice = 1800 + Math.random() * 500;
            const minPrice = (basePrice).toFixed(2);
            const maxPrice = (basePrice + Math.random() * 300).toFixed(2);

            const historicalData: PriceDataPoint[] = [
                { month: 'Mar', price: basePrice - 150 + Math.random() * 100 },
                { month: 'Apr', price: basePrice - 50 + Math.random() * 80 },
                { month: 'May', price: basePrice + 20 + Math.random() * 50 },
                { month: 'Jun', price: parseFloat(maxPrice) },
            ];
            setPriceHistory(historicalData);

            setResult(
                <>
                    <h3 className="text-2xl font-bold text-primary mb-4">💰 Market Price for {crop}</h3>
                    <div className="bg-yellow-50 p-4 rounded-md shadow-sm">
                        <p className="text-lg"><strong>Minimum Price:</strong> ₹{minPrice} / Quintal</p>
                        <p className="text-lg"><strong>Maximum Price:</strong> ₹{maxPrice} / Quintal</p>
                        <p className="mt-2 text-gray-600"><strong>Market:</strong> {selectedCity} Agricultural Produce Market Committee (APMC)</p>
                    </div>
                    <PriceHistoryChart data={historicalData} />
                </>
            );
            setIsLoading(false);
        }, 1500);
    };

    return (
        <FormSection
            id="market-price-form"
            title="Market Price Tracking"
            subtitle="Complete all fields for price of crops and pesticides."
        >
            <form onSubmit={handleSubmit} className="w-full">
                <FormGroup label="Your State">
                    <Select name="state" options={states} placeholder="Select your State" required value={selectedState} onChange={handleStateChange} />
                </FormGroup>
                <FormGroup label="Your District">
                    <Select name="district" options={availableDistricts} placeholder="Select District" required disabled={!selectedState} value={selectedDistrict} onChange={handleDistrictChange} />
                </FormGroup>
                <FormGroup label="Your City">
                    <Select name="city" options={availableCities} placeholder="Select your City" required disabled={!selectedDistrict} value={selectedCity} onChange={handleCityChange} />
                </FormGroup>
                <FormGroup label="Crop Type"><Select name="cropType" options={cropTypes} placeholder="Select your Crop" required /></FormGroup>
                <SubmitButton text="Check Price" disabled={isLoading} />
            </form>
            <ResultBox isLoading={isLoading} loadingText="📊 Fetching Market Prices..." result={result} />
        </FormSection>
    );
};

export default MarketPriceForm;
