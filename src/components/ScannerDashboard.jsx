import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ScannerDashboard() {
  const [targetUrl, setTargetUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  const runScan = async () => {
    if (!targetUrl) return; // Prevent empty scans
    
    setIsScanning(true);
    
    try {
      // Make sure "Listen for Test Event" is active in n8n
     const response = await axios.post('http://localhost:5678/webhook/vulnerability-scan', {
        url: targetUrl
      });
      
      console.log("Scan Data Received:", response.data);
      
      // Navigate to the results page and pass the URL and live n8n data
      navigate('/results', { 
        state: { 
          url: targetUrl, 
          liveScanData: response.data 
        } 
      });
      
    } catch (error) {
      console.error("Error reaching the scanning engine:", error);
      setIsScanning(false); // Reset button if it fails
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto border rounded-lg shadow-md mt-10 bg-white">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Vulnerability Scanner</h1>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={targetUrl} 
          onChange={(e) => setTargetUrl(e.target.value)} 
          placeholder="e.g., pro-tech-one.vercel.app"
          className="border-2 border-gray-300 p-2 rounded w-full text-black focus:outline-none focus:border-blue-500"
          disabled={isScanning}
        />
        <button 
          onClick={runScan} 
          disabled={isScanning}
          className={`${isScanning ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold p-2 px-6 rounded transition whitespace-nowrap`}
        >
          {isScanning ? 'Scanning...' : 'Start Scan'}
        </button>
      </div>
    </div>
  );
}