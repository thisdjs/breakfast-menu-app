import React, {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
  useMemo,
  useCallback,
} from "react";
import type { MenuItem } from "../types";
import useLocalStorageState from "../hooks/useLocalStorageState";
import { useMenu } from "./MenuContext";

const ORDER_ITEMS_STORAGE_KEY = "breakfastAppOrderItems";
const TOTAL_PRICE_STORAGE_KEY = "breakfastAppTotalPrice";

interface OrderContextType {
  orderItems: MenuItem[];
  totalPrice: number;
  selectedItemIds: number[];
  handleSelectItem: (itemId: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { allItems } = useMenu(); // Get allItems from MenuContext to validate selected items
  const [orderItems, setOrderItems] = useLocalStorageState<MenuItem[]>(
    ORDER_ITEMS_STORAGE_KEY,
    []
  );
  const [totalPrice, setTotalPrice] = useLocalStorageState<number>(
    TOTAL_PRICE_STORAGE_KEY,
    0
  );

  // Validate orderItems against current allItems on load or when allItems changes
  useEffect(() => {
    if (allItems.length > 0 && orderItems.length > 0) {
      const validOrderItems = orderItems.filter((orderItem) =>
        allItems.some((menuItem) => menuItem.id === orderItem.id)
      );
      if (validOrderItems.length !== orderItems.length) {
        setOrderItems(validOrderItems);
        // Recalculate total price based on valid items
        const newTotalPrice = validOrderItems.reduce(
          (sum, item) => sum + item.price,
          0
        );
        setTotalPrice(newTotalPrice < 0.005 ? 0 : newTotalPrice);
      }
    } else if (allItems.length === 0 && orderItems.length > 0) {
      // If allItems is empty (e.g. initial load error for menu), clear order
      setOrderItems([]);
      setTotalPrice(0);
    }
  }, [allItems, orderItems, setOrderItems, setTotalPrice]);

  const handleSelectItem = useCallback(
    (itemId: number) => {
      // Ensure selectedItem is from the current allItems list
      const selectedItem = allItems.find((item) => item.id === itemId);
      if (selectedItem) {
        const itemIndexInOrder = orderItems.findIndex(
          (item) => item.id === selectedItem.id
        );
        if (itemIndexInOrder > -1) {
          setOrderItems((prevItems) =>
            prevItems.filter((_, index) => index !== itemIndexInOrder)
          );
          setTotalPrice((prevTotal) => {
            const newTotal = prevTotal - selectedItem.price;
            return newTotal < 0.005 ? 0 : newTotal;
          });
        } else {
          setOrderItems((prevItems) => [...prevItems, selectedItem]);
          setTotalPrice((prevTotal) => prevTotal + selectedItem.price);
        }
      }
    },
    [allItems, orderItems, setOrderItems, setTotalPrice]
  );

  const selectedItemIds = useMemo(
    () => orderItems.map((item) => item.id),
    [orderItems]
  );

  return (
    <OrderContext.Provider
      value={{ orderItems, totalPrice, selectedItemIds, handleSelectItem }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
