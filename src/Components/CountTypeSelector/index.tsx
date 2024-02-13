// CountTypeSelector.tsx
import React from 'react';
import { CountType, CountTypeSelectorProps } from './index.d';
import { BsShop } from "react-icons/bs";
import { LuWarehouse } from "react-icons/lu";
import { LuTruck } from "react-icons/lu";

const countTypes = [
  { value: CountType.Depo, label: 'Depo', icon: <LuWarehouse/>},
  { value: CountType.Market, label: 'Market', icon: <BsShop/> },
  { value: CountType.Vehicle, label: 'Araç', icon: <LuTruck/> },
];

const CountTypeSelector: React.FC<CountTypeSelectorProps> = ({ countType, setCountType }) => {
  return (
    <div className="count-type-selector">
      <label className="block text-sm mb-2">Sayım Tipi:</label>
      <div className="flex gap-4">
        {countTypes.map(({ value, label, icon }) => (
          <button
            type='button'
            key={value} 
            className={`w-fit justify-center text-sm items-center cursor-pointer px-4 py-2 rounded-lg ${countType === value ? 'bg-primary-light dark:bg-primary-darkest' : 'bg-background-lighter dark:bg-background-darkest hover:bg-primary dark:hover:bg-primary'} text-text-darkest dark:text-text-lightest transition-colors duration-300`}
            onClick={() => setCountType(value)}
          >
          <div className='flex gap-2 items-center justify-center'>
            {icon}
            {label}
          </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CountTypeSelector;
