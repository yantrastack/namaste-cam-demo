"use client";

import { useState } from "react";
import { MenuProductList } from "./MenuProductList";
import type { MenuDocument } from "./types";

// Sample menu data for testing
const testMenuData: MenuDocument = {
  restaurant: {
    name: "Test Restaurant",
    tagline: "Testing stock editing functionality",
  },
  menu: [
    {
      category: "Test Category",
      category_id: "test_cat",
      items: [
        {
          id: "TEST_001",
          name: "Test Item 1",
          description: "First test item for stock editing",
          type: "veg",
          image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
          variants: [{ size: "Regular", price_gbp: 5.49, currency: "GBP" }],
          base_price_gbp: 5.49,
          available: true,
          available_qty: 30,
        },
        {
          id: "TEST_002", 
          name: "Test Item 2",
          description: "Second test item for stock editing",
          type: "non-veg",
          image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
          variants: [{ size: "Regular", price_gbp: 3.49, currency: "GBP" }],
          base_price_gbp: 3.49,
          available: true,
          available_qty: 15,
        },
      ],
    },
  ],
};

export function StockEditTest() {
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({});
  const [stockQuantities, setStockQuantities] = useState<Record<string, number>>({});

  const handleCartChange = (quantities: Record<string, number>) => {
    console.log("Cart quantities changed:", quantities);
    setCartQuantities(quantities);
  };

  const handleStockUpdate = (itemId: string, newStock: number) => {
    console.log("Stock updated:", itemId, "->", newStock);
    setStockQuantities(prev => ({
      ...prev,
      [itemId]: newStock,
    }));
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Stock Edit Behavior Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cart Mode */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Cart Mode (Default)</h2>
            <p className="text-sm text-gray-600 mb-4">
              Edit button updates cart quantities. Stock remains unchanged.
            </p>
            <MenuProductList
              data={testMenuData}
              onCartChange={handleCartChange}
              showCartControls={true}
            />
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <strong>Cart Quantities:</strong> {JSON.stringify(cartQuantities)}
            </div>
          </div>

          {/* Stock Edit Mode */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Stock Edit Mode</h2>
            <p className="text-sm text-gray-600 mb-4">
              Edit button (amber background) updates stock quantities only.
            </p>
            <MenuProductList
              data={testMenuData}
              enableStockEdit={true}
              onStockUpdate={handleStockUpdate}
              showCartControls={false}
            />
            <div className="mt-4 p-3 bg-amber-50 rounded">
              <strong>Stock Quantities:</strong> {JSON.stringify(stockQuantities)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
