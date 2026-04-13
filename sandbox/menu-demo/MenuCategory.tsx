import React from 'react';
import MenuItem from './MenuItem';

interface MenuCategoryProps {
  category: {
    category: string;
    category_id: string;
    items: any[];
  };
}

const MenuCategory: React.FC<MenuCategoryProps> = ({ category }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-orange-500">
        {category.category}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {category.items.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default MenuCategory;
