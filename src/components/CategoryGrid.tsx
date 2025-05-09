import React from "react";
import UIItemCard from "./ItemCard";
import type { MenuItem as MenuItemTypeGrid } from "../types";

interface CategoryGridProps {
  title: string;
  items: MenuItemTypeGrid[];
  onItemSelected?: (itemId: number) => void;
  selectedItemIds: number[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  title,
  items,
  onItemSelected,
  selectedItemIds,
}) => {
  if (!items || items.length === 0) {
    return (
      <div className="py-6">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
          <p className="text-gray-600">
            No items available in this category yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-yellow-800 my-4 pl-2">
          {title}
        </h2>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {items.map((item) => (
            <UIItemCard
              key={item.id}
              item={item}
              onSelect={onItemSelected}
              isSelected={selectedItemIds.includes(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
