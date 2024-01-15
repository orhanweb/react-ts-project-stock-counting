// src/Components/Dropdown/index.tsx
import React, { useEffect, useRef} from 'react';
import {DropdownMenuProps} from './index.d'

// Modüler Dropdown
const DropdownMenu: React.FC<DropdownMenuProps> = ({id, options, closeDropdown }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div id={`dropdown-menu-${id}`} ref={dropdownRef} className="absolute flex flex-col items-center min-w-max z-50 bg-background-lightest dark:bg-background-darkest shadow-2xl rounded-lg p-2 space-y-2 left-1/2 transform -translate-x-1/2 top-full">
      {options.map((option, index) => (
        <button
          key={index}
          className={`w-full text-sm px-4 py-2 rounded-lg ${option.dangerEffect ? 'bg-error bg-opacity-90 hover:bg-error text-text-lightest' : 'hover:bg-primary-lightest dark:hover:bg-primary-darker'}`}
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
