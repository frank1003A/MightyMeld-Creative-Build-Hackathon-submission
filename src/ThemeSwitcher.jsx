import { useState, useEffect } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";

const ThemeSwitcher = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <DarkModeSwitch
      className="mt-10 flex items-center text-white fill-white"
      moonColor="white"
      checked={darkMode}
      onChange={toggleDarkMode}
      size={40}
    />
  );
};

export default ThemeSwitcher;
