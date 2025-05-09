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

  // Determine if the icon is an emoji or a URL/path
  // Checks for most common emoji characters.
  const isEmojiIcon = /\p{Emoji}/u.test(item.icon);
  // Determine the primary visual: item.image if available, otherwise item.icon (if not an emoji meant as fallback)
  const primaryImageSrc = item.image || (isEmojiIcon ? null : item.icon);

  // Conditional styling for selected items
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
        {primaryImageSrc ? ( // If there's a primaryImageSrc and it's not an emoji (item.icon might be emoji if item.image is null)
          <img
            src={primaryImageSrc}
            alt={item["icon-name"] || item.name} // Use item.name as fallback alt text for the main image
            className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
            onError={(e) => {
              (
                e.target as HTMLImageElement
              ).src = `https://placehold.co/32x32/fbbf24/FFFFFF?text=${item.name.substring(
                0,
                2
              )}`;
              (
                e.target as HTMLImageElement
              ).alt = `Placeholder for ${item.name}`;
            }}
          />
        ) : isEmojiIcon ? (
          // If it's an emoji, render it as a larger text character
          <span
            className="text-xl sm:text-3xl mb-2"
            role="img"
            aria-label={item["icon-name"] || item.name}
          >
            {item.icon}
          </span>
        ) : (
          // Otherwise, assume it's an image URL
          <img
            src={item.icon}
            alt={item["icon-name"] || `Icon for ${item.name}`}
            className="w-8 h-8 mb-2 object-contain text-yellow-600"
            onError={(e) => {
              // Fallback for broken image links
              (e.target as HTMLImageElement).src =
                "https://placehold.co/32x32/FBBF24/FFFFFF?text=?";
              (
                e.target as HTMLImageElement
              ).alt = `Placeholder icon for ${item.name}`;
            }}
          />
        )}
      </div>
      <span className="text-xs font-medium ml-3 sm:ml-0 sm:my-2">
        {item.name}
      </span>
    </div>
  );
};

export default ItemCard;
