import React from "react";
import type { MenuItem } from "../types";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface ItemCardProps {
  item: MenuItem;
  isSelected: boolean;
  onSelect?: (itemId: number) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, isSelected, onSelect }) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(item.id);
    }
  };

  const borderStyle = isSelected ? "border-yellow-700" : "border-yellow-300";
  const textStyle = isSelected ? "text-yellow-800" : "text-yellow-600";

  return (
    <div
      className={`relative flex-shrink-0
      bg-white ${borderStyle} border
      rounded-3xl sm:rounded-lg
      flex flex-row items-center py-2 px-6 sm:p-4
      sm:flex-col sm:justify-center
      text-center shadow-md
      hover:shadow-lg transition-all duration-200 ease-in-out
      cursor-pointer transform hover:scale-105
      ${isSelected ? "hover:bg-yellow-100" : "hover:bg-yellow-100"}
      select-none
      ${textStyle} hover:text-yellow-800`}
      onClick={handleClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Select ${item.name}`}
    >
      {isSelected && (
        <div className="absolute sm:top-1 right-1">
          <CheckCircleIcon className="h-5 w-5 text-green-500 bg-white rounded-full" />
        </div>
      )}

      <div className="flex-shrink-0 sm:mb-1">
        <span
          className="text-xl sm:text-3xl mb-2"
          role="img"
          aria-label={item["icon-name"] || item.name}
        >
          {item.icon}
        </span>
      </div>

      <span className="text-sm md:text-md font-medium ml-3 sm:ml-0 sm:my-2">
        {item.name}
      </span>
    </div>
  );
};

export default ItemCard;
