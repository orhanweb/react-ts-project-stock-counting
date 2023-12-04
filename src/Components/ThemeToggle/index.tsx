import React, { useState } from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

const ThemeToggle: React.FC<{ toggleSidebar: (isOpen:boolean) => void}> = ({toggleSidebar}) => {
  // İlk render'da doğru temayı almak için useEffect kullanılır.
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Temayı değiştirdikçe isDark state'ini ve localStorage'ı güncelle
  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark); // isDark state'ini güncelle
    localStorage.setItem('theme', newTheme); // Yeni temayı localStorage'a kaydet
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    toggleSidebar(false);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center whitespace-nowrap w-full p-2 text-sm text-text-darkest dark:text-text-lightest transition-colors duration-300 bg-primary-lightest dark:bg-background-darkest border-2 border-transparent rounded-lg hover:border-background-darker dark:hover:border-primary-lighter focus:outline-none"
    >
      {isDark ? (
        <MdLightMode size="20px" />
      ) : (
        <MdDarkMode size="20px" />
      )}
      <span className="sm:hidden lg:inline ml-2">{isDark ? 'Açık Tema' : 'Koyu Tema'}</span>
    </button>
  );
};

export default ThemeToggle;
