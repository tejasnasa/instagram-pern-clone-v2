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
        console.log(response);
        setResults(response.data.responseObject);
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
    <div className="ml-96">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="ml-48 h-10 w-48 rounded bg-white"
      />
      {loading && <p>Loading...</p>}
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
    </div>
  );
};

export default Search;
