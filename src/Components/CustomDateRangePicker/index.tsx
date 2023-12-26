import React from 'react';
import DatePicker from 'react-datepicker';
import { MdCancel } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";

interface CustomDateRangePickerProps {
  label?: string;
  startDate: Date | null;
  endDate: Date | null;
  onChange: (dates: [Date | null, Date | null]) => void;
  isError?: boolean;
}

const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({ label, startDate, endDate, onChange, isError=false }) => {
  const showResetIcon = startDate !== null || endDate !== null;
  
  return (
    <div className="form-item">
      {label && <label className="block text-sm mb-2">{label}</label>}
      <div className="relative">
        <DatePicker 
          wrapperClassName="w-full"
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={onChange}
          placeholderText='gg/aa/yyyy - gg/aa/yyyy'
          dateFormat="dd/MM/yyyy"        
          className={`${isError ? 'border-error' : ''} form-control w-full p-2 border-2 border-background bg-transparent rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-text-darkest dark:text-text-lightest transition-colors duration-300`}
        />
        {showResetIcon && (
          <MdCancel size={20} onClick={()=>onChange([null, null])} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" />
        )}
      </div>

    </div>
  );
};

export default CustomDateRangePicker;
