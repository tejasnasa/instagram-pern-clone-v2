import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import Loader from "./Loader";

interface SearchResult {
  id: string;
  username: string;
  fullname: string;
  avatar: string;
  _count: {
    followers: number;
  };
}

const Search: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navbarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post(
          `${
            import.meta.env.VITE_BASE_URL
          }/v1/users/search?user=${encodeURIComponent(query)}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const fetchedResults = response.data.responseObject;
        setResults(fetchedResults || []);

      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center m-3 text-md font-medium w-[90%] transition ease-in-out hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] rounded-lg"
      > 
        <CiSearch size={30} className="m-2 mr-4" />
        Search
      </button>

      <div
        ref={navbarRef}
        className={`fixed top-0 left-0 w-[400px] dark:bg-black bg-white dark:text-white text-black p-4 shadow-lg transition-all duration-300 z-[1000] h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h1 className="text-2xl font-semibold m-2">Search</h1>
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-10 p-2 mt-8 mb-6 rounded dark:bg-[#363636] bg-[#EFEFEF] focus:outline-none dark:text-white text-black"
        />

        {loading && (
          <p>
            <Loader />
          </p>
        )}

        <div>
          {results.length !== 0 && query !== ""  ? (
            results.map((result) => (
              <Link
                key={result.id}
                to={`profile/${result.id}`}
                className="flex items-center text-md font-medium"
              >
                <img
                  src={result.avatar}
                  alt="Profile"
                  className="h-[42px] w-[42px] rounded-full m-2 mr-4"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">
                    {result.username}
                  </span>
                  <span className="text-sm dark:text-gray-400 text-gray-500">
                    {result.fullname} • {result._count.followers} followers
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex justify-center items-center h-96">
              <p className="text-sm text-gray-400">No results found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
