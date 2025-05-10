import { useState, useEffect } from "react";
import menuJsonData from "./data/menu.json";
import type { MenuItem } from "./types";
import Carousel from "./components/Carousel";
import { PlusIcon } from "@heroicons/react/24/outline";
import CreateItemModal from "./components/CreateItemModal";
import AppCategoryGrid from "./components/CategoryGrid";
import useLocalStorageState from "./hooks/useLocalStorageState";

const USER_CREATED_ITEMS_STORAGE_KEY = "breakfastAppUserCreatedItems";
const ORDER_ITEMS_STORAGE_KEY = "breakfastAppOrderItems";
const TOTAL_PRICE_STORAGE_KEY = "breakfastAppTotalPrice";

const baseMenuItems: MenuItem[] = menuJsonData as MenuItem[];

function App() {
  const [userCreatedItems, setUserCreatedItems] = useLocalStorageState<
    MenuItem[]
  >(USER_CREATED_ITEMS_STORAGE_KEY, []);

  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [orderItems, setOrderItems] = useLocalStorageState<MenuItem[]>(
    ORDER_ITEMS_STORAGE_KEY,
    []
  );
  const [totalPrice, setTotalPrice] = useLocalStorageState<number>(
    TOTAL_PRICE_STORAGE_KEY,
    0
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Effect to disable body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset"; // Or 'auto' or ''
    }
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  useEffect(() => {
    setAllItems([...baseMenuItems, ...userCreatedItems]);
  }, [userCreatedItems]);

  // Effect to derive categories and manage loading state
  useEffect(() => {
    setIsLoading(true);
    if (allItems.length > 0) {
      const uniqueCategories = [
        ...new Set(allItems.map((item) => item.category)),
      ].sort();
      setCategories(uniqueCategories);
    } else if (baseMenuItems.length > 0 && userCreatedItems.length === 0) {
      // Handle case where only base items exist initially
      const uniqueCategories = [
        ...new Set(baseMenuItems.map((item) => item.category)),
      ].sort();
      setCategories(uniqueCategories);
    }
    // Simulate fetch delay
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [allItems]); // Re-run when allItems (combined list) changes

  const handleSelectItem = (itemId: number) => {
    const selectedItem = allItems.find((item) => item.id === itemId);
    if (selectedItem) {
      const itemIndexInOrder = orderItems.findIndex(
        (item) => item.id === selectedItem.id
      );
      if (itemIndexInOrder > -1) {
        setOrderItems((prevItems) => {
          const newOrderItems = prevItems.filter(
            (_, index) => index !== itemIndexInOrder
          );
          return newOrderItems;
        });
        // Ensure total price doesn't go below zero or show -0.00
        setTotalPrice((prevTotal) => {
          const newTotal = prevTotal - selectedItem.price;
          return newTotal < 0.005 ? 0 : newTotal; // If very close to 0 or negative, set to 0
        });
      } else {
        setOrderItems((prevItems) => [...prevItems, selectedItem]);
        setTotalPrice((prevTotal) => prevTotal + selectedItem.price);
      }
    }
  };

  const handleCreateNewItem = (newItemData: Omit<MenuItem, "id">) => {
    let finalCategory = newItemData.category;
    if (newItemData.category === "NEW_CATEGORY") {
      const newCategoryName = prompt("Enter the name for the new category:");
      if (newCategoryName && newCategoryName.trim() !== "") {
        finalCategory = newCategoryName.trim();
        // Categories state will be updated by the useEffect watching allItems
      } else {
        alert("New category name cannot be empty. Item not added.");
        return;
      }
    }

    // Determine the next ID by looking at all items (base + user-created)
    const maxId = allItems.reduce((max, item) => Math.max(max, item.id), 0);
    const newMenuItem: MenuItem = {
      ...newItemData,
      category: finalCategory,
      id: maxId + 1, // Ensure unique ID across all items
    };

    // 1. Update userCreatedItems state.
    // 2. Trigger the useEffect that saves userCreatedItems to localStorage (via the custom hook).
    // 3. Trigger the useEffect that updates the combined `allItems` state.
    // 4. Trigger the useEffect that updates `categories`.
    setUserCreatedItems((prevUserItems) => [...prevUserItems, newMenuItem]);
    setIsModalOpen(false);
  };

  const selectedItemIds = orderItems.map((item) => item.id);

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      <header className="bg-yellow-900 shadow-lg sticky top-0 z-30">
        <div className="container mx-auto px-4 md:px-0 flex justify-between items-center py-4">
          <h1 className="text-3xl font-bold text-white tracking-tight pl-2">
            Breakfast Menu
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-full text-white border border-white"
            aria-label="Add new item"
          >
            <PlusIcon className="h-6 w-6" />
          </button>
        </div>
      </header>

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 md:px-0">
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-xl text-brand-text-secondary">
                Loading delicious breakfast options...
              </p>
            </div>
          ) : (
            categories.map((category) => {
              const itemsForCategory = allItems.filter(
                (item) => item.category === category
              );
              if (itemsForCategory.length > 0) {
                return (
                  <div key={category} className="bg-white overflow-hidden">
                    <div className="hidden md:block">
                      <Carousel
                        title={category}
                        items={itemsForCategory}
                        selectedItemIds={selectedItemIds}
                        onItemSelected={handleSelectItem}
                      />
                    </div>
                    <div className="block md:hidden">
                      <AppCategoryGrid
                        title={category}
                        items={itemsForCategory}
                        selectedItemIds={selectedItemIds}
                        onItemSelected={handleSelectItem}
                      />
                    </div>
                  </div>
                );
              }
              return null;
            })
          )}
        </div>
      </main>

      <footer className="bg-yellow-100 border-t border-yellow-900 mt-auto sticky bottom-0 z-30 shadow-upward">
        <div className="container mx-auto px-4 md:px-0 flex justify-between items-center py-4 gap-4">
          <div className="flex-1 min-w-0 pl-2">
            <h3 className="text-lg font-semibold text-yellow-800">
              Your Order ({orderItems.length} items)
            </h3>
            <p className="text-sm text-yellow-700 truncate max-w-full">
              {orderItems.map((item) => item.name).join(", ") ||
                "Select items to add them to your order"}
            </p>
          </div>
          <div className="text-2xl font-bold text-yellow-900 flex-shrink-0">
            ${totalPrice.toFixed(2)}
          </div>
        </div>
      </footer>

      <CreateItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateNewItem}
        categories={categories}
      />
    </div>
  );
}

export default App;
