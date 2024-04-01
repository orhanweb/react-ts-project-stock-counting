import React, { useState, useEffect } from "react";
import DatePicker, {
  ReactDatePickerProps,
  registerLocale,
} from "react-datepicker"; // Required to save locale
import "react-datepicker/dist/react-datepicker.css";
import "./index.css";
import tr from "date-fns/locale/tr"; // Required module for Turkish language support
import CustomLabel from "../CustomLabel";

registerLocale("tr", tr); // Save Turkish

interface CustomDatePickerProps extends ReactDatePickerProps {
  label?: string;
  selectedDate?: Date | null;
  onChange: (date?: Date | null) => void;
  isError?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  selectedDate,
  onChange,
  isError = false,
  ...props
}) => {
  const [minTime, setMinTime] = useState<Date>(new Date());

  useEffect(() => {
    setMinTime(getMinTime(selectedDate));
  }, [selectedDate]);

  const getMinTime = (date?: Date | null): Date => {
    const now = new Date();
    return date && date.toDateString() === now.toDateString()
      ? now
      : new Date(now.setHours(0, 0, 0, 0));
  };

  return (
    <div className="form-item">
      <CustomLabel title={label} className="block mb-2" />
      <DatePicker
        {...props}
        wrapperClassName="w-full"
        selected={selectedDate}
        onChange={onChange}
        minDate={new Date()}
        showTimeSelect
        timeFormat="HH:mm"
        dateFormat="dd/MM/yyyy HH:mm"
        calendarClassName="fit-content"
        timeCaption="Saat"
        isClearable
        clearButtonClassName="right-3 p-0"
        clearButtonTitle="Delete"
        className={`${
          isError ? "border-error" : ""
        } form-control w-full p-2 border-2 border-background/50 bg-transparent rounded-lg focus:border-primary focus:ring-0 focus:ring-primary text-text-darkest dark:text-text-lightest transition-colors duration-300`}
        minTime={minTime}
        maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
        locale="tr"
      />
    </div>
  );
};

export default CustomDatePicker;
