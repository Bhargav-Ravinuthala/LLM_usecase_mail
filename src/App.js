// LLMAnalysisDashboard.js
import React, { useState } from 'react';
import AWS from 'aws-sdk';
import {
  ArrowRight,
  Cpu,
  DollarSign,
  Download,
  FileText,
  BarChart2,
  Shield,
  Database,
  AlertTriangle,
  Target
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Reusable Card Components
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="p-4 border-b border-gray-200">{children}</div>
);

const CardTitle = ({ children }) => (
  <h3 className="text-lg font-semibold flex items-center gap-2">{children}</h3>
);

const CardDescription = ({ children }) => (
  <p className="text-sm text-gray-600 mt-1">{children}</p>
);

const CardContent = ({ children }) => (
  <div className="p-4">{children}</div>
);

// Button Component
const Button = ({ children, onClick, disabled, variant = 'primary', className = '' }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
    outline: 'border border-gray-300 hover:bg-gray-50'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Modal Component
const EmailModal = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    onSubmit(email);
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Enter Your Email</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <div className="flex justify-end space-x-2">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )
  );
};

// Main Dashboard Component
const App = () => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Configure AWS SDK
  AWS.config.update({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_KEY,
    region: process.env.REACT_APP_REGION
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleEmailSubmit = async (email) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://31e9-103-169-83-171.ngrok-free.app/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ use_case: userInput })
      });
      const data = await response.json();
      setAnalysisResult(data);

      // Save email and userInput to S3
      const s3 = new AWS.S3();
      const params = {
        Bucket: process.env.REACT_APP_BUCKET,
        Key: `analysis-${Date.now()}.json`,
        Body: JSON.stringify({ email, use_case: userInput }),
        ContentType: 'application/json',
      };
      await s3.putObject(params).promise();
      alert('Data saved to S3 successfully!');
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>LLM Use Case Analyzer</CardTitle>
            <CardDescription>
              Enter your AI use case description and get detailed analysis and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              placeholder="Describe your AI use case here..."
              className="w-full min-h-32 mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <Button
              onClick={openModal}
              disabled={!userInput || isLoading} // Button is disabled if no input or while loading
              className="w-full md:w-auto"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Use Case'}
            </Button>

          </CardContent>
        </Card>

        {analysisResult && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Analysis Results</h2>
            {/* Display the analysis results here */}
          </div>
        )}
      </div>

      {/* Email Modal */}
      <EmailModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleEmailSubmit} />
    </div>
  );
};

export default App;
