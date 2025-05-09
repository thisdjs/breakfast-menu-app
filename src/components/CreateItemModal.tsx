import React, { useState, useEffect as useEffectModal } from "react";
import type { MenuItem as MenuItemTypeModal } from "../types";
import { XMarkIcon as ModalXMarkIcon } from "@heroicons/react/24/solid";

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<MenuItemTypeModal, "id">) => void;
  categories: string[];
}

const CreateItemModal: React.FC<CreateItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [icon, setIcon] = useState("");
  const [iconName, setIconName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const isFormValid =
    name.trim() !== "" &&
    price.trim() !== "" &&
    !isNaN(parseFloat(price)) &&
    parseFloat(price) > 0;

  useEffectModal(() => {
    if (isOpen) {
      setName("");
      setPrice("");
      setIcon("");
      setIconName("");
      setImageUrl("");
      if (categories.length > 0) {
        if (!category || !categories.includes(category)) {
          setCategory(categories[0]);
        }
      } else {
        setCategory("");
      }
    }
  }, [isOpen, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      alert("Please ensure Name and a valid Price are entered.");
      return;
    }
    const newItem: Omit<MenuItemTypeModal, "id"> = {
      name: name.trim(),
      price: parseFloat(price),
      category: category || "Uncategorized",
      icon: icon.trim() || "❓",
      "icon-name": iconName.trim() || name.trim(),
      image: imageUrl.trim() || undefined,
    };
    onSubmit(newItem);
    onClose();
  };

  useEffectModal(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Div */}
      <div
        className="fixed inset-0 bg-neutral-800 opacity-75 z-40 transition-opacity duration-300 ease-in-out"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
        <div className="bg-white w-full h-full sm:h-auto sm:max-w-md rounded-none sm:rounded-xl shadow-2xl transform transition-all duration-300 ease-in-out flex flex-col">
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Create a new Item
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <ModalXMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form
            id="create-item-form"
            onSubmit={handleSubmit}
            className="space-y-5 p-4 sm:p-6 overflow-y-auto flex-grow"
          >
            <div>
              <label
                htmlFor="item-type"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Type
              </label>
              <select
                id="item-type"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-700 bg-white cursor-pointer"
              >
                {categories.length === 0 && (
                  <option value="" disabled>
                    No categories available
                  </option>
                )}
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="NEW_CATEGORY">-- Add New Category --</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="item-name"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="item-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Write Here..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-700 placeholder-gray-400 bg-white"
              />
            </div>
            <div>
              <label
                htmlFor="item-price"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="item-price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Write Here..."
                min="0.01"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-700 placeholder-gray-400 bg-white"
              />
            </div>
            <div>
              <label
                htmlFor="item-image-url"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Image URL
              </label>
              <input
                type="url"
                id="item-image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-700 placeholder-gray-400 bg-white"
              />
            </div>
            <div>
              <label
                htmlFor="item-icon"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Icon
              </label>
              <input
                type="text"
                id="item-icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="e.g., 🍕"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-700 placeholder-gray-400 bg-white"
              />
            </div>
            <div>
              <label
                htmlFor="item-icon-name"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Icon Name (for accessibility)
              </label>
              <input
                type="text"
                id="item-icon-name"
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                placeholder="e.g., Pizza Slice"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-700 placeholder-gray-400 bg-white"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full bg-yellow-500 text-white font-semibold p-3 rounded-lg hover:bg-yellow-600 transition-opacity focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateItemModal;
