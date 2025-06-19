// src/components/SearchBar.jsx
import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-1 text-center">
      <input
        type="text"
        className="form-control w-50 d-inline-block"
        placeholder="Cari Playlist Spotify..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="btn btn-success ms-2 mb-1">
        Cari
      </button>
    </form>
  );
};

export default SearchBar;
