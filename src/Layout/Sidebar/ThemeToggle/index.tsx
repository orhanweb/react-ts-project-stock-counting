import React, { useState } from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import ResponsiveIconButton from '../../../Components/Buttons/ResponsiveIconButton';

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
    <ResponsiveIconButton
      onClick={toggleTheme}
      Icon={isDark ? MdLightMode : MdDarkMode} 
      title={isDark ? 'Açık Tema' : 'Koyu Tema'} 
    />
  );
};

export default ThemeToggle;
