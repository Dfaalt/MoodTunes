// src/components/Header.jsx
import React from "react";
import SearchBar from "./SearchBar";

const Header = ({ onSearch }) => {
  return (
    <header className="bg-black py-3 mb-4 shadow-sm">
      <div className="container text-center">
        <h2 className="text-success mb-1">MoodTunes</h2>
        <p className="text-light mb-3">
          Aktifkan kamera & ekspresikan wajahmu untuk mendapatkan playlist
          Spotify sesuai mood!
        </p>

        {/* Tambahkan SearchBar di bagian bawah header */}
        <SearchBar onSearch={onSearch} />
      </div>
    </header>
  );
};

export default Header;
