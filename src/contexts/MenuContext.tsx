import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import type { MenuItem } from "../types";
import menuJsonData from "../data/menu.json";
import useLocalStorageState from "../hooks/useLocalStorageState";

const USER_CREATED_ITEMS_STORAGE_KEY = "breakfastAppUserCreatedItems";
const baseMenuItems: MenuItem[] = (menuJsonData as any[]).map((item) => ({
  id: item.id,
  name: item.name,
  price: item.price,
  category: item.category,
  icon: item.icon,
  "icon-name": item["icon-name"],
}));

interface MenuContextType {
  allItems: MenuItem[];
  categories: string[];
  isLoading: boolean;
  handleCreateNewItem: (newItemData: Omit<MenuItem, "id">) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userCreatedItems, setUserCreatedItems] = useLocalStorageState<
    MenuItem[]
  >(USER_CREATED_ITEMS_STORAGE_KEY, []);
  const [allItems, setAllItems] = useState<MenuItem[]>([
    ...baseMenuItems,
    ...userCreatedItems,
  ]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setAllItems([...baseMenuItems, ...userCreatedItems]);
  }, [userCreatedItems]);

  useEffect(() => {
    setIsLoading(true);
    if (allItems.length > 0) {
      const uniqueCategories = [
        ...new Set(allItems.map((item) => item.category)),
      ].sort();
      setCategories(uniqueCategories);
    } else {
      setCategories([]);
    }
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [allItems]);

  const handleCreateNewItem = useCallback(
    (newItemData: Omit<MenuItem, "id">) => {
      let finalCategory = newItemData.category;
      if (newItemData.category === "NEW_CATEGORY") {
        const newCategoryName = prompt("Enter the name for the new category:");
        if (newCategoryName && newCategoryName.trim() !== "") {
          finalCategory = newCategoryName.trim();
        } else {
          alert("New category name cannot be empty. Item not added.");
          return;
        }
      }

      // Recalculate maxId based on the current combined allItems to ensure uniqueness
      const currentAllItems = [...baseMenuItems, ...userCreatedItems];
      const maxId = currentAllItems.reduce(
        (max, item) => Math.max(max, item.id),
        0
      );

      const newMenuItem: MenuItem = {
        ...newItemData,
        category: finalCategory,
        id: maxId + 1,
      };
      setUserCreatedItems((prevUserItems) => [...prevUserItems, newMenuItem]);
    },
    [userCreatedItems, setUserCreatedItems]
  );

  return (
    <MenuContext.Provider
      value={{ allItems, categories, isLoading, handleCreateNewItem }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
