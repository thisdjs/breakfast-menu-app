import React from "react";
import UIItemCard from "./ItemCard";
import type { MenuItem } from "../types";
import { useOrder } from "../contexts/OrderContext";

interface CategoryGridProps {
  title: string;
  items: MenuItem[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ title, items }) => {
  const { selectedItemIds, handleSelectItem } = useOrder();

  if (!items || items.length === 0) {
    return (
      <div className="py-6">
        <div className="container mx-auto px-4">
          <h2 className="text-center md:text-left text-2xl font-bold text-gray-800 mb-4">
            {title}
          </h2>
          <p className="text-gray-600">
            No items available in this category yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="container mx-auto">
        <h2 className="text-center md:text-left text-2xl font-bold text-yellow-800 my-4">
          {title}
        </h2>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {items.map((item) => (
            <UIItemCard
              key={item.id}
              item={item}
              onSelect={handleSelectItem}
              isSelected={selectedItemIds.includes(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
