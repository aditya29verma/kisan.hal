import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import FormSection from './FormSection';
import ResultBox from './ResultBox';
import { FormGroup, Select, SubmitButton } from './formElements';
import { states, stateDistrictMap, districtCityMap, soilTypes } from '../constants';
import { WeatherData, LocationData } from '../types';
import useGeolocation from '../hooks/useGeolocation';

interface LocationInfoFormProps {
    onSuccess: (data: LocationData) => void;
}

const WeatherChart: React.FC<{ data: WeatherData[], title: string }> = ({ data, title }) => (
    <div className="mt-6">
        <h4 className="text-xl font-bold text-center text-primary mb-4">{title}</h4>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight' }}/>
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="temp" name="Temperature" stroke="#ef4444" activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="humidity" name="Humidity" stroke="#3b82f6" />
            </LineChart>
        </ResponsiveContainer>
    </div>
);


const LocationInfoForm: React.FC<LocationInfoFormProps> = ({ onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<React.ReactNode | null>(null);
    const [manualLocation, setManualLocation] = useState({ state: '', district: '', city: '', soil: '' });
    const { location, error, loading: geoLoading, requestLocation } = useGeolocation();
    const [availableDistricts, setAvailableDistricts] = useState<{ value: string; label: string }[]>([]);
    const [availableCities, setAvailableCities] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        if(location) {
             const mockState = 'Chhattisgarh';
             const mockDistrict = 'Durg';
             const mockCity = 'Bhilai';
             
             setManualLocation({ state: mockState, district: mockDistrict, city: mockCity, soil: 'Black Cotton Soil' });
             
             const districtsForState = stateDistrictMap[mockState] || [];
             setAvailableDistricts(districtsForState.map(d => ({ value: d, label: d })));

             const citiesForDistrict = districtCityMap[mockDistrict] || [];
             setAvailableCities(citiesForDistrict.map(c => ({ value: c, label: c })));
        }
    }, [location]);

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'state') {
            const districts = stateDistrictMap[value] || [];
            setAvailableDistricts(districts.map(d => ({ value: d, label: d })));
            setManualLocation({ state: value, district: '', city: '', soil: '' });
            setAvailableCities([]);
        } else if (name === 'district') {
            const cities = districtCityMap[value] || districtCityMap['Default'];
            setAvailableCities(cities.map(c => ({ value: c, label: c })));
            setManualLocation(prev => ({ ...prev, district: value, city: '', soil: prev.soil }));
        } else {
            setManualLocation(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);

        const formData = new FormData(e.target as HTMLFormElement);
        const soilType = formData.get('soil') as string;

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const now = new Date();
        
        const pastMonthsData: WeatherData[] = [];
        for (let i = 4; i > 0; i--) {
            const d = new Date(now);
            d.setMonth(now.getMonth() - i);
            pastMonthsData.push({
                month: monthNames[d.getMonth()],
                temp: parseFloat((25 + Math.random() * 10 - 5).toFixed(1)),
                humidity: parseFloat((60 + Math.random() * 20).toFixed(1)),
                precipitation: parseFloat((50 + Math.random() * 100).toFixed(1))
            });
        }

        const futureMonthsData: WeatherData[] = [];
        for (let i = 1; i <= 4; i++) {
            const d = new Date(now);
            d.setMonth(now.getMonth() + i);
            futureMonthsData.push({
                month: monthNames[d.getMonth()],
                temp: parseFloat((28 + Math.random() * 5).toFixed(1)),
                humidity: parseFloat((70 + Math.random() * 15).toFixed(1)),
                precipitation: parseFloat((100 + Math.random() * 150).toFixed(1))
            });
        }
        
        let suggestion = "Based on the forecast, consider planting short-duration vegetables.";
        if (soilType.toLowerCase().includes('black')) {
            suggestion = `With the upcoming monsoon forecast for ${manualLocation.city} and your Black Cotton soil, this is an ideal time to prepare for sowing Cotton or Soybean.`;
        } else if (soilType.toLowerCase().includes('alluvial')) {
            suggestion = `The forecast is favorable for Wheat or Sugarcane in your Alluvial soil. Ensure proper irrigation planning for the drier months ahead.`;
        } else if (soilType.toLowerCase().includes('red')) {
             suggestion = `For your Red soil, the upcoming weather is suitable for millets like Ragi or groundnut. These crops are resilient to variable moisture levels.`;
        }


        setTimeout(() => {
            const submittedData: LocationData = {
                state: manualLocation.state,
                district: manualLocation.district,
                city: manualLocation.city,
                soil: soilType,
            };
            onSuccess(submittedData);
            
            setResult(
                 <>
                    <h3 className="text-2xl font-bold text-primary mb-4 text-center">📍 Location-Based Advisory</h3>
                    <div className="bg-white p-4 rounded-md mb-6 shadow-sm text-left w-full">
                        <p><strong>State:</strong> {manualLocation.state}</p>
                        <p><strong>District:</strong> {manualLocation.district}</p>
                        <p><strong>City:</strong> {manualLocation.city}</p>
                        <p><strong>Soil Type:</strong> {soilType}</p>
                        <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
                            <p className="font-bold">🌱 Crop Suggestion</p>
                            <p>{suggestion}</p>
                        </div>
                    </div>
                    <div className="w-full">
                        <WeatherChart data={pastMonthsData} title="Past 4-Month Weather Data" />
                    </div>
                    <div className="w-full mt-8">
                        <WeatherChart data={futureMonthsData} title="Next 4-Month Weather Forecast" />
                    </div>
                </>
            );
            setIsLoading(false);
        }, 1500);
    };

    return (
        <FormSection
            id="location-form"
            title="Location Information"
            subtitle="Get customized advisory report based on your location."
        >
             <div className="w-full text-center mb-6">
                <button onClick={requestLocation} disabled={geoLoading} className="bg-secondary hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-gray-400">
                    {geoLoading ? 'Fetching...' : '📍 Fetch My Location Automatically'}
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {location && <p className="text-green-700 mt-2 font-semibold">Location Fetched! Forms updated.</p>}
            </div>

            <form onSubmit={handleSubmit} className="w-full">
                <FormGroup label="State">
                    <Select name="state" value={manualLocation.state} onChange={handleInputChange} options={states} placeholder="Select your State" required />
                </FormGroup>
                <FormGroup label="District">
                     <Select name="district" value={manualLocation.district} onChange={handleInputChange} options={availableDistricts} placeholder="Select District" required disabled={!manualLocation.state} />
                </FormGroup>
                <FormGroup label="City">
                     <Select name="city" value={manualLocation.city} onChange={handleInputChange} options={availableCities} placeholder="Select your City" required disabled={!manualLocation.district} />
                </FormGroup>
                <FormGroup label="Soil Type">
                    <Select name="soil" value={manualLocation.soil} onChange={handleInputChange} options={soilTypes} placeholder="Select Soil Type" required />
                </FormGroup>
                <SubmitButton text="Get Location Information" disabled={isLoading} />
            </form>
            <ResultBox isLoading={isLoading} loadingText="📍 Analyzing Location Data..." result={result} />
        </FormSection>
    );
};

export default LocationInfoForm;
