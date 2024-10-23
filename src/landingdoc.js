import React, { useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  MessageSquare,
  BarChart,
  Shield,
  AlertTriangle,
  Check,
  ArrowRight,
  Search
} from 'lucide-react';

const DocPage = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  // Navigation items
  const navItems = [
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'features', label: 'Key Features' },
    { id: 'use-cases', label: 'Example Use Cases' },
    { id: 'best-practices', label: 'Best Practices' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              LLM Use Case Analyzer Documentation
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Learn how to analyze and optimize your AI use cases
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2">
                Quick Start Guide
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                View Examples
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="col-span-12 md:col-span-3">
            <nav className="space-y-1 sticky top-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center justify-between ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 md:col-span-9 space-y-12">
            {/* Getting Started Section */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Getting Started</h2>
              
              {/* Step 1 */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold">1. Describe Your Use Case</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Start by providing a detailed description of your AI use case in the text area. Be specific about:
                  </p>
                  <ul className="space-y-2 text-gray-600 mb-6">
                    {['Purpose and goals', 'Expected usage patterns', 'Scale requirements', 'Specific constraints'].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="font-medium text-gray-700 mb-2">Example Input:</div>
                    <div className="text-gray-600">
                      "AI-based customer support chatbot hosted in Cloud with an estimated 1000 global customers, requiring 24/7 availability and support for multiple languages."
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <BarChart className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold">2. Review Analysis Results</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-900 mb-1">Model Recommendations</div>
                      <p className="text-sm text-gray-600">Get tailored model suggestions with performance metrics</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-900 mb-1">Infrastructure Setup</div>
                      <p className="text-sm text-gray-600">Technical requirements and deployment guidelines</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-900 mb-1">Cost Estimates</div>
                      <p className="text-sm text-gray-600">Detailed pricing breakdowns and projections</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold">3. Assess Risks and Mitigations</h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Review potential risks and recommended mitigation strategies for your use case.
                    </p>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                      <div className="flex items-center gap-2 text-yellow-800 font-medium mb-2">
                        <AlertTriangle className="w-5 h-5" />
                        Example Risk Assessment
                      </div>
                      <p className="text-yellow-800">
                        Data privacy concerns in multi-language support
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Mitigation: Implement end-to-end encryption and regional data storage
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Additional sections can be added here */}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-600">
                <li>API Documentation</li>
                <li>Example Projects</li>
                <li>Community Forums</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li>FAQ</li>
                <li>Contact Us</li>
                <li>Status Page</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DocPage;