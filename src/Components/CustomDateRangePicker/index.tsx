import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
interface CustomDateRangePickerProps {
  label?: string;
  startDate: Date | null;
  endDate: Date | null;
  onChange: (dates: [Date | null, Date | null]) => void;
}

const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({ label, startDate, endDate, onChange }) => {
    return (
    <div className="form-item">
      {label && <label className="block text-sm mb-2">{label}</label>}
      <DatePicker 
        wrapperClassName="w-full"
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"        
        className="form-control w-full p-2 border-2 border-background bg-transparent rounded-xl focus:outline-none focus:border-primary text-text-darkest dark:text-text-lightest transition-colors duration-300"
      />
    </div>
  );
};

export default CustomDateRangePicker;
