import React, { useState, useRef, useEffect } from "react";

const UpsideDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={toggleDropdown}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Open Menu
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full mb-2 bg-white shadow-md rounded w-48 text-black z-10">
          <ul className="flex flex-col text-sm">
            {/* Buttons */}
            <li>
              <button className="w-full px-4 py-2 hover:bg-gray-100">
                Button 1
              </button>
            </li>
            <li>
              <button className="w-full px-4 py-2 hover:bg-gray-100">
                Button 2
              </button>
            </li>
            <li>
              <button className="w-full px-4 py-2 hover:bg-gray-100">
                Button 3
              </button>
            </li>
            {/* Divider */}
            <hr className="border-t my-1" />
            <li>
              <button className="w-full px-4 py-2 hover:bg-gray-100">
                Button 4
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UpsideDropdown;
