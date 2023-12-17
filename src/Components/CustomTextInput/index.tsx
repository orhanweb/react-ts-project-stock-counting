// CountNameInput.tsx
import React from 'react';

interface CustomTextInputProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  maxChars: number;
}

const CustomTextInput: React.FC<CustomTextInputProps>=({id,label,value,onChange,maxChars,placeholder}) => {
  return (
    <div className='custom-text-input'>
        <label htmlFor={id} className="block text-sm mb-2">{label}</label>
        <input
            min={1}
            max={3}
            maxLength={maxChars}
            id={id}
            placeholder={placeholder}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border-2 bg-transparent border-background p-2 rounded-lg w-full focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-text-darkest dark:text-text-lightest transition-colors duration-300"
        />
        <div className="text-right text-xs font-mono mt-1 mr-2 cursor-default">
            {value.length}/{maxChars}
        </div>
    </div>
  );
};

export default CustomTextInput;
