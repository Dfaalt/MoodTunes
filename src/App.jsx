import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MoodDetector from "./components/MoodDetector";
import MusicPlayer from "./components/MusicPlayer";

const App = () => {
  const [currentMood, setCurrentMood] = useState("");
  const [isSearch, setIsSearch] = useState(false); // untuk lacak asal mood

  const handleMoodChange = (mood) => {
    setCurrentMood(mood);
    setIsSearch(false); // Mood berasal dari deteksi wajah
  };

  const handleSearch = (mood) => {
    setCurrentMood(mood);
    setIsSearch(true); // Mood berasal dari fitur search
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-light">
      <Header onSearch={handleSearch} />
      <main className="container flex-grow-1 text-center">
        <MoodDetector onMoodChange={handleMoodChange} />
        <hr className="my-4 border-light" />
        <MusicPlayer mood={currentMood} isSearch={isSearch} />
      </main>
      <Footer />
    </div>
  );
};

export default App;
