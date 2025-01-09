import axios from "axios";
import { useEffect, useState } from "react";
import { BiMoviePlay } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FiPlusSquare } from "react-icons/fi";
import { MdHomeFilled, MdOutlineExplore } from "react-icons/md";
import { RiMessengerLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import UpsideDropdown from "./DropDown";
import Search from "./Search";

interface NavbarProps {
  handleLogout: () => void;
  handleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleLogout, handleTheme }) => {
  const [loggedInUser, setLoggedInUser] = useState<{
    id: string;
    avatar: string;
  } | null>(null);

  useEffect(() => {
    const fetchLoggedInUserDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/v1/self/details`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setLoggedInUser({
          id: response.data.responseObject.id,
          avatar: response.data.responseObject.avatar,
        });
      } catch (err) {
        console.error("Error fetching logged-in user details:", err);
      }
    };

    if (!loggedInUser) {
      fetchLoggedInUserDetails();
    }
  }, [loggedInUser]);

  return (
    <div className="pt-6 w-[240px] dark:bg-black bg-white dark:text-white text-black flex flex-col justify-between h-lvh fixed border-r-[1px] border-gray-300 dark:border-gray-800 border-solid">
      <div>
        <img
          src="/images/login2-light.png"
          alt="instagram"
          className="h-14 block dark:hidden"
        />
        <img
          src="/images/login2.png"
          alt="instagram"
          className="h-14 hidden dark:block"
        />
        <ul className="">
          <li className="">
            <Link
              to={"/"}
              className="flex items-center m-3 text-md font-medium transition ease-in-out hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] rounded-lg"
            >
              <MdHomeFilled size={30} className="m-2 mr-4" />
              Home
            </Link>
          </li>
          <li>
            <Search />
          </li>
          <li>
            <Link
              to="/explore"
              className="flex items-center m-3 text-md font-medium transition ease-in-out hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] rounded-lg"
            >
              <MdOutlineExplore size={30} className="m-2 mr-4" />
              Explore
            </Link>
          </li>
          <li>
            <a href="#" className="flex items-center m-3 text-md font-medium transition ease-in-out hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] rounded-lg">
              <BiMoviePlay size={30} className="m-2 mr-4" />
              Reels
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center m-3 text-md font-medium transition ease-in-out hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] rounded-lg">
              <RiMessengerLine size={30} className="m-2 mr-4" />
              Messages
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center m-3 text-md font-medium transition ease-in-out hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] rounded-lg">
              <FaRegHeart size={25} className="m-2 mr-4" />
              Notifications
            </a>
          </li>
          <li>
            <Link
              to={"/create"}
              className="flex items-center m-3 text-md font-medium transition ease-in-out hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] rounded-lg"
            >
              <FiPlusSquare size={30} className="m-2 mr-4" />
              Create
            </Link>
          </li>
          <li>
            {loggedInUser?.avatar && (
              <Link
                to={`profile/${loggedInUser.id}`}
                className="flex items-center m-3 text-md font-medium transition ease-in-out hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] rounded-lg"
              >
                <img
                  src={loggedInUser.avatar}
                  alt="Profile"
                  className="h-8 w-8 rounded-full m-2 mr-4"
                />
                Profile
              </Link>
            )}
          </li>
        </ul>
      </div>

        <UpsideDropdown handleLogout={handleLogout} handleTheme={handleTheme} />
    </div>
  );
};

export default Navbar;
