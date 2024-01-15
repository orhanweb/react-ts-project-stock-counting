// CountNameInput.tsx
import React from 'react';
import { MdCancel } from "react-icons/md";

interface CustomTextInputProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  maxChars: number;
  isError?: boolean
}

const CustomTextInput: React.FC<CustomTextInputProps>=({id,label,value,onChange,maxChars,placeholder,isError=false}) => {
  return (
    <div className='custom-text-input'>
        <label htmlFor={id} className="block text-sm mb-2">{label}</label>
        <div className="relative">
            <input
                maxLength={maxChars}
                id={id}
                placeholder={placeholder}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`${isError ? 'border-error' : ''} border-2 bg-transparent border-background border-opacity-30 dark:border-opacity-80 p-2 rounded-lg w-full focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-text-darkest dark:text-text-lightest transition-colors duration-300`}
            />
            {value && (
                <MdCancel size={20} onClick={()=>onChange('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" />
            )}
        </div>
        <div className="text-right text-xs font-mono mt-1 mr-2 cursor-default">
            {value.length}/{maxChars}
        </div>
    </div>
  );
};

export default CustomTextInput;
