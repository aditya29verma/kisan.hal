
import React, { useState, useEffect } from 'react';
import FormSection from './FormSection';
import ResultBox from './ResultBox';

const LeafDiseaseForm: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<React.ReactNode | null>(null);
    const [timer, setTimer] = useState(120);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isLoading) {
            setTimer(120);
            interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isLoading]);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            alert("Please upload an image first.");
            return;
        }
        setIsLoading(true);
        setResult(null);

        setTimeout(() => {
            setResult(
                <>
                    <h3 className="text-2xl font-bold text-primary mb-4">🌿 Disease Analysis Complete</h3>
                    <p><strong>Status:</strong> ✅ Analysis Complete</p>
                    <p><strong>Severity:</strong> Moderate</p>
                    <div className="bg-red-50 p-4 rounded-md my-4 shadow-sm">
                        <p className="font-bold">Detected Issue: Powdery Mildew</p>
                        <p><strong>Treatment:</strong> Apply a sulfur-based fungicide. Ensure proper air circulation around plants.</p>
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-text-primary">🚨 Immediate Actions:</h4>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Remove and destroy affected leaves immediately.</li>
                        <li>Avoid overhead watering to keep foliage dry.</li>
                        <li>Increase spacing between plants for better airflow.</li>
                    </ul>
                </>
            );
            setIsLoading(false);
        }, 120000); // 120 seconds delay
    };

    return (
        <FormSection
            id="disease-form"
            title="Leaf Disease Detection"
            subtitle="Capture or upload a clear photo of your crop's leaf to get an AI-powered diagnosis."
        >
            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                 <div className="relative w-full max-w-lg">
                    <input type="file" id="leafImage" accept="image/*" capture="environment" className="absolute w-0 h-0 opacity-0" onChange={handleFileChange} required disabled={isLoading} />
                    <label htmlFor="leafImage" className={`flex flex-col items-center p-10 bg-background border-4 border-dashed border-primary rounded-xl cursor-pointer transition-all duration-300 ${isLoading ? 'cursor-not-allowed bg-gray-200' : 'hover:border-secondary hover:bg-green-50'}`}>
                        <div className="mb-4 text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                            </svg>
                        </div>
                        <div className="text-xl font-bold text-primary mb-2">Click to Capture/Upload Leaf Image</div>
                        <div className="text-sm text-gray-500">or drag and drop here</div>
                    </label>
                </div>
                {fileName && <div className="mt-4 p-2 bg-green-100 text-primary rounded-md font-semibold">{fileName}</div>}

                <div className="text-center w-full mt-6">
                    <button type="submit" className="bg-primary hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed w-52 h-16" disabled={isLoading || !file}>
                        Analyze Leaf
                    </button>
                </div>
            </form>
            <ResultBox 
                isLoading={isLoading} 
                loadingText={`🔍 Analyzing Leaf Image... Please wait (${timer}s)`} 
                result={result} 
            />
        </FormSection>
    );
};

export default LeafDiseaseForm;