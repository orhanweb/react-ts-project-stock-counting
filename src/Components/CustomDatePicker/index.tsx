import React from 'react';
import DatePicker from 'react-datepicker';
import { MdCancel } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";
import './index.css';

interface CustomDatePickerProps {
  label?: string;
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  isError?: boolean;
  placeholderText?: string; // Placeholder metni
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ label, selectedDate, onChange, isError=false, placeholderText=''}) => {
  const showResetIcon = selectedDate !== null ;
  
  return (
    <div className="form-item">
      {label && <label className="block text-sm mb-2">{label}</label>}
      <div className="relative">
        <DatePicker 
          wrapperClassName="w-full"
          selected={selectedDate}
          showTimeSelect
          onChange={onChange}
          placeholderText= {placeholderText}
          dateFormat="dd/MM/yyyy HH:mm"
          calendarClassName='fit-content'
          className={`${isError ? 'border-error' : ''} form-control w-full p-2 border-2 border-opacity-30 dark:border-opacity-80 border-background bg-transparent rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-text-darkest dark:text-text-lightest transition-colors duration-300`}
        />
        {showResetIcon && (
          <MdCancel size={20} onClick={()=>onChange(null)} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" />
        )}
      </div>

    </div>
  );
};

export default CustomDatePicker;
