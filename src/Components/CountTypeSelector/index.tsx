// CountTypeSelector.tsx
import React from 'react';
import { CountType, CountTypeSelectorProps } from './index.d';

const countTypes = [
  { value: CountType.Depo, label: 'Depo' },
  { value: CountType.Market, label: 'Market' },
  { value: CountType.Vehicle, label: 'Araç' },
];

const CountTypeSelector: React.FC<CountTypeSelectorProps> = ({ countType, setCountType }) => {
  return (
    <div className="count-type-selector">
      <label className="block text-sm mb-2">Sayım Tipi:</label>
      <div className="flex flex-wrap gap-4">
        {countTypes.map(({ value, label }) => (
          <button
            type='button'
            key={value} 
            className={`w-20 justify-center items-center cursor-pointer px-4 py-2 rounded-lg ${countType === value ? 'bg-primary-light dark:bg-primary-darkest' : 'bg-background-lighter dark:bg-background-darkest hover:bg-primary-lighter dark:hover:bg-primary-darker'} text-text-darkest dark:text-text-lightest transition-colors duration-300`}
            onClick={() => setCountType(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CountTypeSelector;
