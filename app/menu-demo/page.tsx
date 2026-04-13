'use client';

import React from 'react';

const MenuDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Menu Demo</h1>
          <p className="text-gray-600 mb-4">
            This is a redirect to the isolated menu demo module.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">
              <strong>Location:</strong> /sandbox/menu-demo/page.tsx
            </p>
            <p className="text-blue-600 text-sm mt-2">
              The actual menu demo is located in the sandbox folder to keep it completely isolated.
            </p>
          </div>
          <a
            href="/sandbox/menu-demo"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Go to Menu Demo
          </a>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">About This Demo</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">â</span>
              Completely isolated module in /sandbox/menu-demo
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">â</span>
              Uses local JSON data (no backend connections)
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">â</span>
              Dynamic rendering of all menu categories and items
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">â</span>
              Clean card layout with images, prices, and descriptions
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">â</span>
              Vegetarian/Non-vegetarian indicators
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">â</span>
              Allergen information and special notes
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MenuDemoPage;
