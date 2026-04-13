'use client';

import React, { useState, useEffect } from 'react';
import MenuCategory from './MenuCategory';

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
          <MenuCategory key={category.category_id} category={category} />
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
