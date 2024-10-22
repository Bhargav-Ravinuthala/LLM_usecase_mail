// LLMAnalysisDashboard.js
import React, { useState } from 'react';
import AWS from 'aws-sdk';
import logo from './company-logo.png'
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
      const response = await fetch('https://7f92-146-190-241-217.ngrok-free.app/analyze', {
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
<div style={{display:'flex' , justifyContent:"end" , padding:'10px'}}>
  <img src={logo} alt="logo" width="120" height="40"/>
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

        {/* {analysisResult && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Analysis Results</h2>
          </div>
        )} */}
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

export default App;
