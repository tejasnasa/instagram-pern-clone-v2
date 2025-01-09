import React, { useState, useRef, useEffect } from "react";
import { CiBookmark } from "react-icons/ci";
import { GoMoon } from "react-icons/go";
import { RiSettings5Fill } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link } from "react-router-dom";

interface DropdownProps {
  handleLogout: () => void;
  handleTheme: () => void;
}

const UpsideDropdown: React.FC<DropdownProps> = ({
  handleLogout,
  handleTheme,
}) => {
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
    <div
      className="relative inline-block bg-white dark:bg-black text-black dark:text-white"
      ref={dropdownRef}
    >
      <button
        onClick={toggleDropdown}
        className="flex items-center m-3 text-md font-medium transition ease-in-out hover:bg-[#1A1A1A] rounded-lg w-[90%]"
      >
        <RxHamburgerMenu size={25} className="m-2 mr-4" />
        More
      </button>

      {isOpen && (
        <div className="absolute left-4 bottom-full mb-2 shadow-md w-[280px] bg-inherit z-10 dark:bg-[#262626] rounded-2xl py-1">
          <div className="flex flex-col text-sm">
            <Link
              to={"/settings"}
              className="flex items-center p-2 text-md font-medium transition ease-in-out hover:bg-[#1A1A1A]"
            >
              <RiSettings5Fill size={23} className="m-2 mr-4" />
              Settings
            </Link>
            <button
              className="flex items-center p-2 text-md font-medium transition ease-in-out hover:bg-[#1A1A1A]"
              onClick={handleTheme}
            >
              <GoMoon size={23} className="m-2 mr-4" />
              Switch appearance
            </button>
            <Link to={"/activity"} className="flex items-center p-2 text-md font-medium transition ease-in-out hover:bg-[#1A1A1A]">
              <CiBookmark size={23} className="m-2 mr-4" />
              Saved
            </Link>
            <hr className="my-1 border-t-[1px] dark:border-gray-600" />
            <button
              className="flex items-center p-3 pl-5 text-md font-medium transition ease-in-out hover:bg-[#1A1A1A]"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpsideDropdown;
