// src/Components/Dropdown/index.d.ts
export interface DropdownOption {
    label: string;
    onClick: () => void;
    dangerEffect?: boolean;
}
  
export interface DropdownMenuProps {
    id: string | number; 
    options: DropdownOption[];
    closeDropdown: () => void;
}
  