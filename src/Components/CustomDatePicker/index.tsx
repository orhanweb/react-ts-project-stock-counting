import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker'; // Locale kaydetmek için gerekli
import { MdCancel } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";
import './index.css';
import tr from 'date-fns/locale/tr'; // Türkçe dil desteği için gerekli modül

registerLocale('tr', tr); // Türkçe'yi kaydet


interface CustomDatePickerProps {
  label?: string;
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  isError?: boolean;
  placeholderText?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ label, selectedDate, onChange, isError=false, placeholderText=''}) => {
  const [minTime, setMinTime] = useState<Date>(new Date());

  useEffect(() => {
    setMinTime(getMinTime(selectedDate));
  }, [selectedDate]);

  const getMinTime = (date: Date | null): Date => {
    const now = new Date();
    return date && date.toDateString() === now.toDateString() ? now : new Date(now.setHours(0, 0, 0, 0));
  };

  return (
    <div className="form-item">
      {label && <label className="block text-sm mb-2">{label}</label>}
      <div className="relative">
        <DatePicker 
          wrapperClassName="w-full"
          selected={selectedDate}
          onChange={onChange}
          minDate={new Date()}
          showTimeSelect
          timeFormat="HH:mm"
          placeholderText={placeholderText}
          dateFormat="dd/MM/yyyy HH:mm"
          calendarClassName="fit-content"
          timeCaption='Saat'
          className={`${isError ? 'border-error' : ''} form-control w-full p-2 border-2 border-opacity-30 dark:border-opacity-80 border-background bg-transparent rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-text-darkest dark:text-text-lightest transition-colors duration-300`}
          minTime={minTime}
          maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
          locale="tr"
        />
        {selectedDate && (
          <MdCancel size={20} onClick={() => onChange(null)} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" />
        )}
      </div>
    </div>
  );
};

export default CustomDatePicker;
