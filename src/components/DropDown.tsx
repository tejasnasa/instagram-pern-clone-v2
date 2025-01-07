import React, { useState, useRef, useEffect } from "react";

const UpsideDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

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
    <div className="relative inline-block bg-white dark:bg-black text-black dark:text-white" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className=" px-4 py-2 rounded"
      >
        Open Menu
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2  shadow-md rounded w-48 bg-inherit z-10 border-[1px] border-gray-700">
          <ul className="flex flex-col text-sm">
            <li>
              <button className="w-full px-4 py-2 hover:bg-gray-100 hover:dark:bg-gray-800">
                Button 1
              </button>
            </li>
            <li>
              <button className="w-full px-4 py-2 hover:bg-gray-100 hover:dark:bg-gray-800">
                Button 2
              </button>
            </li>
            <li>
              <button className="w-full px-4 py-2 hover:bg-gray-100 hover:dark:bg-gray-800">
                Button 3
              </button>
            </li>
            <hr className="border-t my-1" />
            <li>
              <button className="w-full px-4 py-2 hover:bg-gray-100 hover:dark:bg-gray-800">
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
