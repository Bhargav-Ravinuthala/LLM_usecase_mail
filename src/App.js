import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import logo from './company-logo.png';

import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import DocPage from './landingdoc.js';  // Import the documentation page

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
  Target,
  X,
  BookOpen // Add this new icon for documentation link
  
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

const WelcomeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-2xl relative shadow-2xl transform transition-all">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Cpu className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome to LLM Use Case Analyzer</h2>
          </div>
          <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Main message */}
          <p className="text-lg text-gray-600 leading-relaxed">
            Unlock insights about your AI use case with our powerful analysis tool. Get detailed recommendations, infrastructure requirements, and risk assessments tailored to your needs.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Use Case Analysis</h3>
                <p className="text-sm text-gray-500">Get detailed insights and classifications</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Risk Assessment</h3>
                <p className="text-sm text-gray-500">Identify potential challenges</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Cost Estimation</h3>
                <p className="text-sm text-gray-500">Get detailed pricing insights</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Infrastructure Guide</h3>
                <p className="text-sm text-gray-500">Technical requirements</p>
              </div>
            </div>
          </div>

          {/* Documentation link */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Need more information?</h3>
                <p className="text-sm text-gray-500">Check our comprehensive documentation for detailed steps</p>
              </div>
              <Link 
                to="/docs" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                onClick={onClose}
              >
                View Docs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Email Modal Component
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

// Model Card Component
const ModelCard = ({ model }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>
        <FileText className="w-4 h-4" />
        {model.model_name}
        <span className="ml-2 text-sm text-gray-500">
          ({(model.confidence_score * 100).toFixed(1)}% confidence)
        </span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="text-sm text-gray-600">
          <strong>Reasons:</strong>
          <ul className="list-disc pl-5 mt-1">
            {model.reasons.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
        </div>
        {model.estimated_performance && (
          <div className="mt-4">
            <strong className="text-sm">Performance Metrics:</strong>
            <div className="h-48 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { name: 'Accuracy', value: model.estimated_performance.accuracy * 100 },
                    { name: 'Latency', value: model.estimated_performance.latency / 2 },
                    { name: 'Throughput', value: model.estimated_performance.throughput / 2 }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

// Pricing Card Component
const PricingCard = ({ pricing }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>
        <DollarSign className="w-4 h-4" />
        Pricing Estimates
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold">${pricing.hourly_cost}/hour</div>
          <div className="text-sm text-gray-600">Base Cost</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold">${pricing.monthly_estimated_cost}/month</div>
          <div className="text-sm text-gray-600">Estimated Total</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold">{pricing.aws_instance_type}</div>
          <div className="text-sm text-gray-600">Instance Type</div>
        </div>
      </div>
      <div className="mt-4">
        <strong className="text-sm">Notes:</strong>
        <ul className="list-disc pl-5 mt-1 text-sm text-gray-600">
          {pricing.notes.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      </div>
    </CardContent>
  </Card>
);

// Main Dashboard Component
const Dashboard  = () => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Configure AWS SDK
  AWS.config.update({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_KEY,
    region: process.env.REACT_APP_REGION
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const closeWelcomeModal = () => setShowWelcome(false);

  const handleEmailSubmit = async (email) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ use_case: userInput })
      });
      const data = await response.json();
      console.log(data);
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
      <WelcomeModal isOpen={showWelcome} onClose={closeWelcomeModal} />
      
      <div style={{display:'flex', justifyContent:"end", padding:'10px'}}>
       
      </div>
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
    placeholder={`Describe your AI use case here...
Example: AI-based customer support chatbot hosted in Cloud with an estimated 1000 global customers`}
    className="w-full min-h-32 mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <Button
              onClick={openModal}
              disabled={!userInput || isLoading}
              className="w-full md:w-auto"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Use Case'}
            </Button>
          </CardContent>
        </Card>

        {analysisResult && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Analysis Results</h2>
              <Button variant="outline">
                <Download className="w-4 h-4" />
                Save as PDF
              </Button>
            </div>

            {/* Classification Summary */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <Target className="w-4 h-4" />
                  Use Case Classification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold">{analysisResult.classification.primary_category}</div>
                    <div className="text-sm text-gray-600">Primary Category</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold">{analysisResult.classification.task_type}</div>
                    <div className="text-sm text-gray-600">Task Type</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold">{analysisResult.classification.complexity_level}</div>
                    <div className="text-sm text-gray-600">Complexity Level</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Model Recommendations */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Recommended Models</h3>
              {analysisResult.recommended_models.map((model, idx) => (
                <ModelCard key={idx} model={model} />
              ))}
            </div>

            {/* Infrastructure Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <Cpu className="w-4 h-4" />
                  Infrastructure Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(analysisResult.infrastructure_requirements).map(([key, value]) => (
                    <div key={key} className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">{value}</div>
                      <div className="text-sm text-gray-600">{key.replace(/_/g, ' ').toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pricing Estimates */}
            <PricingCard pricing={analysisResult.pricing_estimates} />

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <AlertTriangle className="w-4 h-4" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResult.risk_assessment.map((risk, idx) => (
                    <div key={idx} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                      <div className="text-yellow-800">
                        <div className="font-semibold">{risk.risk}</div>
                        <div className="text-sm">
                          Impact: <span className="font-medium">{risk.impact}</span>
                        </div>
                        <div className="text-sm mt-1">{risk.mitigation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Email Modal */}
      <EmailModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleEmailSubmit} />
    </div>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="logo" width="120" height="40"/>
            
          </Link>
          <nav className="flex gap-6">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Analyzer
            </Link>
            <Link 
              to="/docs" 
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Documentation
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
};

// Main App component with routing
const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/docs" element={<DocPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};


export default App;
