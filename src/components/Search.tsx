import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

interface SearchResult {
  id: string;
  username: string;
  fullname: string;
  avatar: string;
}

const Search: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navbarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
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
        setNoResults(false);
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
        setNoResults(!fetchedResults || fetchedResults.length === 0);
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
      {/* Button to Toggle Navbar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-blue-600 text-white rounded-md mb-2"
      >
        {isOpen ? "Close Search" : "Open Search"}
      </button>

      {/* Fixed Navbar */}
      <div
        ref={navbarRef}
        className={`fixed top-0 left-0 w-[240px] bg-gray-800 text-white p-4 shadow-lg transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          zIndex: 100,
          height: "100vh", // Ensure it spans the full height
        }}
      >
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-10 p-2 mb-4 rounded bg-gray-700 text-white"
        />

        {/* Loading State */}
        {loading && <p>Loading...</p>}

        {/* No Results */}
        {!loading && noResults && query && <p>No users found.</p>}

        {/* Search Results */}
        <div>
          {results.map((result) => (
            <div
              key={result.id}
              className="flex items-center p-2 border-b border-gray-600"
            >
              <img
                src={result.avatar}
                alt={result.username}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span>{result.username}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
