'use client';

import React, { useState, useEffect } from 'react';

interface MenuData {
  restaurant: {
    name: string;
    tagline: string;
    address: string;
    phone: string;
    mobile: string[];
    email: string;
    website: string;
    cuisine: string;
  };
  menu: Array<{
    category: string;
    category_id: string;
    items: any[];
  }>;
  meta: {
    currency: string;
    currency_symbol: string;
    total_categories: number;
    total_items: number;
  };
}

const MenuDemo: React.FC = () => {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        const response = await fetch('/sandbox/menu-demo/menu-data.json');
        if (!response.ok) {
          throw new Error('Failed to load menu data');
        }
        const data = await response.json();
        setMenuData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!menuData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {menuData.restaurant.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{menuData.restaurant.tagline}</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span> Cuisine: {menuData.restaurant.cuisine}</span>
              <span> Categories: {menuData.meta.total_categories}</span>
              <span> Items: {menuData.meta.total_items}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {menuData.menu.map((category) => (
          <div key={category.category_id} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-orange-500">
              {category.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                  <div className="relative">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <div
                        className={`w-6 h-6 rounded-full border-2 ${
                          item.type === 'veg'
                            ? 'bg-green-500 border-green-600'
                            : item.type === 'non-veg'
                            ? 'bg-red-500 border-red-600'
                            : 'bg-gray-500 border-gray-600'
                        }`}
                        title={item.type === 'veg' ? 'Vegetarian' : item.type === 'non-veg' ? 'Non-Vegetarian' : 'Unknown'}
                      >
                        <span className="flex items-center justify-center h-full text-white text-xs font-bold">
                          {item.type === 'veg' ? 'V' : item.type === 'non-veg' ? 'N' : ''}
                        </span>
                      </div>
                    </div>
                    {!item.available && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">Not Available</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-wrap gap-2">
                        {item.variants.map((variant: any, index: number) => (
                          <span key={index} className="text-lg font-bold text-gray-900">
                            £{variant.price_gbp.toFixed(2)}
                            {variant.size !== 'Regular' && (
                              <span className="text-xs text-gray-500 ml-1">({variant.size})</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    {item.stock_note && (
                      <p className="text-xs text-orange-600 mb-2">{item.stock_note}</p>
                    )}

                    {item.collection_only && (
                      <p className="text-xs text-blue-600 mb-2">Collection only</p>
                    )}

                    {item.allergens && item.allergens.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Contains: </span>
                        <span className="text-xs text-red-600">{item.allergens.join(', ')}</span>
                      </div>
                    )}

                    {item.customisation && item.customisation.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Options: </span>
                        <span className="text-xs text-gray-700">{item.customisation.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Menu Demo - Isolated Module</p>
            <p className="mt-1">Data loaded from local JSON file</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MenuDemo;
