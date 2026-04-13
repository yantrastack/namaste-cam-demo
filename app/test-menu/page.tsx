'use client';

import React, { useState, useEffect } from 'react';

const TestMenu: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testFetch = async () => {
      try {
        console.log('Testing JSON fetch...');
        const response = await fetch('/sandbox/menu-demo/menu-data.json');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const jsonData = await response.json();
        console.log('JSON data loaded:', jsonData);
        setData(jsonData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    testFetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Menu Demo Test</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {data ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Data Loaded Successfully!</h2>
          <p>Restaurant: {data.restaurant?.name}</p>
          <p>Categories: {data.menu?.length}</p>
          <p>Total Items: {data.meta?.total_items}</p>
          
          <div className="mt-4">
            <a href="/sandbox/menu-demo" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Go to Full Menu Demo
            </a>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading test data...</p>
        </div>
      )}
    </div>
  );
};

export default TestMenu;
