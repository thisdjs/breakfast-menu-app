import { useState, useEffect } from "react";
import Carousel from "./components/Carousel";
import { PlusIcon } from "@heroicons/react/24/outline";
import CreateItemModal from "./components/CreateItemModal";
import AppCategoryGrid from "./components/CategoryGrid";
import { MenuProvider, useMenu } from "./contexts/MenuContext";
import { OrderProvider, useOrder } from "./contexts/OrderContext";

const AppContent: React.FC = () => {
  const { allItems, categories, isLoading } = useMenu();
  const { orderItems, totalPrice } = useOrder();
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
                      <Carousel title={category} items={itemsForCategory} />
                    </div>
                    <div className="block md:hidden">
                      <AppCategoryGrid
                        title={category}
                        items={itemsForCategory}
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
      />
    </div>
  );
};

function App() {
  return (
    <MenuProvider>
      <OrderProvider>
        <AppContent />
      </OrderProvider>
    </MenuProvider>
  );
}

export default App;
