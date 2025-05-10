import React, { useState, useEffect as useEffectModal } from "react";
import type { MenuItem as MenuItemTypeModal } from "../types";
import { XMarkIcon as ModalXMarkIcon } from "@heroicons/react/24/solid";

// Simple regex to check if a string is a single emoji.
// This is a basic check and might not cover all edge cases of complex emojis.
const EMOJI_REGEX = /^\p{Extended_Pictographic}$/u;

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
  // State for tracking if fields have been touched (to show errors only after interaction)
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});

  const handleBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  // Validation logic
  const nameError =
    name.trim() === ""
      ? "Name is required."
      : name.trim().length > 50
      ? "Name cannot exceed 50 characters."
      : "";
  const priceError =
    price.trim() === ""
      ? "Price is required."
      : isNaN(parseFloat(price)) || parseFloat(price) <= 0
      ? "Price must be a positive number."
      : "";
  const isIconValidEmoji = icon.trim() === "" || EMOJI_REGEX.test(icon.trim());
  const iconError =
    !isIconValidEmoji && icon.trim() !== ""
      ? "Please enter a single valid emoji."
      : "";

  const isFormValid = !nameError && !priceError && !iconError;

  useEffectModal(() => {
    if (isOpen) {
      setName("");
      setPrice("");
      setIcon("");
      setIconName("");
      setTouchedFields({});
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
    // Mark all fields as touched to show errors if submit is attempted with invalid fields
    setTouchedFields({ name: true, price: true, icon: true });

    if (!isFormValid) {
      // No alert needed, inline errors will show. Button is disabled anyway.
      console.log("Form is invalid. Errors should be displayed.");
      return;
    }
    const newItem: Omit<MenuItemTypeModal, "id"> = {
      name: name.trim(),
      price: parseFloat(price),
      category: category || "Uncategorized",
      icon: icon.trim() || "❓",
      "icon-name": iconName.trim() || name.trim(),
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
                {/* <option value="NEW_CATEGORY">-- Add New Category --</option> */}
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
                onBlur={() => handleBlur("name")} // Track when field is touched
                placeholder="Write Here..."
                maxLength={40}
                className={`w-full p-3 border rounded-lg focus:ring-2 outline-none text-gray-700 placeholder-gray-400 bg-white ${
                  touchedFields.name && nameError
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
                }`}
              />
              {touchedFields.name && nameError && (
                <p className="text-xs text-red-500 mt-1">{nameError}</p>
              )}
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
                onBlur={() => handleBlur("price")} // Track when field is touched
                placeholder="Write Here..."
                min="0.01"
                step="0.01"
                className={`w-full p-3 border rounded-lg focus:ring-2 outline-none text-gray-700 placeholder-gray-400 bg-white ${
                  touchedFields.price && priceError
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
                }`}
              />
              {touchedFields.price && priceError && (
                <p className="text-xs text-red-500 mt-1">{priceError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="item-icon"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Icon (Single Emoji)
              </label>
              <input
                type="text"
                id="item-icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                onBlur={() => handleBlur("icon")} // Track when field is touched
                placeholder="e.g., 🍕 (enter one emoji)"
                maxLength={2}
                className={`w-full p-3 border rounded-lg focus:ring-2 outline-none text-gray-700 placeholder-gray-400 bg-white ${
                  touchedFields.icon && iconError
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
                }`}
              />
              {touchedFields.icon && iconError && (
                <p className="text-xs text-red-500 mt-1">{iconError}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Find emojis at:{" "}
                <a
                  href="https://emojicopy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-600 hover:text-yellow-700 underline"
                >
                  emojicopy.com
                </a>
              </p>
            </div>
            <div>
              <label
                htmlFor="item-icon-name"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Icon Alt Text (Optional)
              </label>
              <input
                type="text"
                id="item-icon-name"
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                placeholder="e.g., Delicious Pizza Slice"
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
