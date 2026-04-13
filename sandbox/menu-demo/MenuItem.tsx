import React from 'react';

interface MenuItemProps {
  item: {
    id: string;
    name: string;
    description: string;
    type: string;
    image_url: string;
    variants: Array<{
      size: string;
      price_gbp: number;
      currency: string;
    }>;
    base_price_gbp: number;
    available: boolean;
    stock_note?: string;
    allergens?: string[];
    collection_only?: boolean;
    customisation?: string[];
  };
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const formatPrice = (price: number) => {
    return `£${price.toFixed(2)}`;
  };

  const getVegIcon = () => {
    if (item.type === 'veg') {
      return 'green';
    } else if (item.type === 'non-veg') {
      return 'red';
    }
    return 'gray';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
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
              getVegIcon() === 'green'
                ? 'bg-green-500 border-green-600'
                : getVegIcon() === 'red'
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
            {item.variants.map((variant, index) => (
              <span key={index} className="text-lg font-bold text-gray-900">
                {formatPrice(variant.price_gbp)}
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
  );
};

export default MenuItem;
