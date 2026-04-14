"use client";

import { useState, useCallback } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { cn } from "@/lib/cn";

export interface MenuCategory {
  id: string;
  name: string;
}

export interface MenuHeaderProps {
  categories: MenuCategory[];
  onSearchChange?: (query: string) => void;
  onCategorySelect?: (categoryId: string) => void;
  searchPlaceholder?: string;
  className?: string;
}

export function MenuHeader({
  categories,
  onSearchChange,
  onCategorySelect,
  searchPlaceholder = "Search dishes, descriptions, or IDs...",
  className,
}: MenuHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? "");

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange?.(query);
  }, [onSearchChange]);

  const handleCategoryClick = useCallback((categoryId: string) => {
    setActiveCategoryId(categoryId);
    onCategorySelect?.(categoryId);
  }, [onCategorySelect]);

  return (
    <div className={cn("relative bg-gray-50", className)}>
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-4">
          <div className="relative">
            <MaterialIcon 
              name="search" 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" 
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              aria-label="Search menu items"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {/* Category Chips */}
      <div className="px-4 py-4 bg-white">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = category.id === activeCategoryId;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
                  isActive
                    ? "bg-red-500 text-white border-red-500 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm"
                )}
                role="tab"
                aria-selected={isActive}
                aria-label={`Category: ${category.name}`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
