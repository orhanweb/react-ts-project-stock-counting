import React, { useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import ResponsiveIconButton from "../../../Components/Buttons/ResponsiveIconButton";

const ThemeToggle: React.FC<{ toggleSidebar: (isOpen: boolean) => void }> = ({
  toggleSidebar,
}) => {
  // useEffect is used to get the correct theme on the first render.
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Update isDark state and localStorage as you change theme
  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark); // Update isDark state
    localStorage.setItem("theme", newTheme); // Save new theme to localStorage
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    toggleSidebar(false);
  };

  return (
    <ResponsiveIconButton
      onClick={toggleTheme}
      Icon={isDark ? MdLightMode : MdDarkMode}
      title={isDark ? "Açık Tema" : "Koyu Tema"}
    />
  );
};

export default ThemeToggle;
