import axios from "axios";
import React, { useState, useEffect } from "react";

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
        setResults(fetchedResults);
        setNoResults(fetchedResults === null);
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
    <main className="dark:bg-black bg-white dark:text-white text-black">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="ml-48 h-10 w-48 rounded bg-white"
      />
      {loading && <p className="ml-48 text-white">Loading...</p>}
      {!loading && noResults && query && (
        <p className="ml-48 dark:text-white text-black">No users found.</p>
      )}
      <div className="ml-48 text-white">
        {results.map((result) => (
          <div key={result.id} className="flex items-center p-2">
            <img
              src={result.avatar}
              alt={result.username}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span>{result.username}</span>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Search;
