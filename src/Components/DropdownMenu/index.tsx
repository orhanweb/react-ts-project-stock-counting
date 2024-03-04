// src/Components/Dropdown/index.tsx
import React, { useEffect, useRef, useState} from 'react';
import {DropdownMenuProps} from './index.d'

// Modüler Dropdown
const DropdownMenu: React.FC<DropdownMenuProps> = ({id, options, closeDropdown }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  let newPositionStyle = 'left-0 top-full'; // Varsayılan pozisyon
  const [positionStyle, setPositionStyle] = useState<string>(`opacity-0 ${newPositionStyle}`);

  useEffect(() => {
    if (dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
  
      // Varsayılan konum kontrolü ve alternatifler...
      if (dropdownRect.right + 20 > windowWidth && dropdownRect.bottom <= windowHeight) { 
        newPositionStyle = 'right-0 top-full';
      } else if (dropdownRect.bottom > windowHeight && dropdownRect.right + 20 <= windowWidth) {
        newPositionStyle = 'left-0 bottom-full';
      } else if (dropdownRect.right + 20 > windowWidth && dropdownRect.bottom > windowHeight) {
        newPositionStyle = 'right-0 bottom-full';
      }
      setPositionStyle(newPositionStyle);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown(); // Dropdown'ı kapat
      }
    };

    document.addEventListener('mousedown', handleClickOutside as any);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside as any);
    };
  }, [closeDropdown]);

  return (
    <div id={`dropdown-menu-${id}`} ref={dropdownRef} className={`absolute flex flex-col items-center min-w-[150px] max-w-[400px] max-h-[50vh] overflow-auto z-50 bg-background-lightest dark:bg-background-darkest shadow-2xl rounded-lg p-2 space-y-2 ${positionStyle}`}>
      {options.map((option, index) => (
        <button
          key={index}
          className={`w-full text-sm px-4 py-2 text-start rounded-lg ${option.dangerEffect ? 'bg-error bg-opacity-90 hover:bg-error text-text-lightest' : 'hover:bg-primary-lightest dark:hover:bg-primary-darker'}`}
          onClick={() => {
            option.onClick();
            closeDropdown();
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
  
};

export default DropdownMenu;
