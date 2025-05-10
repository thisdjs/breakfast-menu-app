import React, { useRef, useState, useEffect, useCallback } from "react";
import ItemCard from "./ItemCard";
import type { MenuItem } from "../types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface CarouselProps {
  title: string;
  items: MenuItem[];
  selectedItemIds: number[];
  onItemSelected?: (itemId: number) => void;
}

const Carousel: React.FC<CarouselProps> = ({
  title,
  items,
  selectedItemIds,
  onItemSelected,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkForScrollability = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const currentScrollLeft = Math.ceil(container.scrollLeft);
      const currentScrollWidth = container.scrollWidth;
      const currentClientWidth = container.clientWidth;

      setCanScrollLeft(currentScrollLeft > 0);
      setCanScrollRight(
        currentScrollLeft < currentScrollWidth - currentClientWidth - 1
      );
    } else {
      setCanScrollLeft(false);
      setCanScrollRight(false);
    }
  }, []);

  // Effect to check scrollability on mount, resize, and when items change.
  useEffect(() => {
    const container = scrollContainerRef.current;
    // If no container or no items, reset scrollability and exit
    if (!container || items.length === 0) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    checkForScrollability();

    window.addEventListener("resize", checkForScrollability);
    container.addEventListener("scroll", checkForScrollability, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", checkForScrollability);
      // Check if container still exists during cleanup
      if (container) {
        container.removeEventListener("scroll", checkForScrollability);
      }
    };
  }, [items, checkForScrollability]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.75;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="py-2">
        <div className="container mx-auto ">
          <h2 className="text-2xl font-bold text-yellow-800 my-4">{title}</h2>
          <p className="text-gray-500">
            No items available in this category yet.
          </p>
        </div>
      </div>
    );
  }

  const showArrows =
    canScrollLeft ||
    canScrollRight ||
    (scrollContainerRef.current &&
      scrollContainerRef.current.scrollWidth >
        scrollContainerRef.current.clientWidth);

  return (
    <div className="py-2">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mt-4 pl-2">
          <h2 className="text-center md:text-left text-2xl font-bold text-yellow-800">
            {title}
          </h2>
          {showArrows && (
            <div className="flex space-x-2 mr-4">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="p-2 rounded-full bg-gray-200 text-yellow-900 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed focus:outline-none "
                aria-label={`Scroll ${title} left`}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="p-2 rounded-full bg-gray-200 text-yellow-900 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed focus:outline-none "
                aria-label={`Scroll ${title} right`}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto py-4 scrollbar-hide pl-2"
          >
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                isSelected={selectedItemIds.includes(item.id)}
                onSelect={onItemSelected}
              />
            ))}
            <div className="flex-shrink-0 w-px"></div> {/* Spacer */}
          </div>
          {canScrollLeft && (
            <div className="absolute inset-y-0 left-0 w-24 sm:w-32 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          )}
          {canScrollRight && (
            <div className="absolute inset-y-0 right-0 w-24 sm:w-32 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
