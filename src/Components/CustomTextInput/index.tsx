// Custom Text Input
import React, { ChangeEvent } from "react";
import { MdCancel } from "react-icons/md";
import CustomLabel from "../CustomLabel";

interface CustomTextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  maxChars: number;
  isError?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  id,
  label,
  value,
  onChange,
  maxChars,
  placeholder,
  isError = false,
  ...props
}) => {
  const clearInput = () => {
    // Yapay bir event oluşturarak onChange fonksiyonunu tetikle
    const event = {
      target: { value: "" },
      currentTarget: { value: "" },
    } as unknown as ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <div className="custom-text-input">
      <div className="flex flex-row justify-between mb-2">
        <CustomLabel title={label} htmlFor={id} />
        <div className="text-right text-xs font-mono mt-1 mr-2 cursor-default">
          {value.length}/{maxChars}
        </div>
      </div>
      <div className="relative">
        <input
          maxLength={maxChars}
          id={id}
          placeholder={placeholder}
          type="text"
          value={value}
          onChange={onChange}
          className={`${
            isError ? "border-error" : ""
          } border-2 bg-transparent border-background/50 p-2 rounded-lg w-full focus:border-primary focus:ring-0 text-text-darkest dark:text-text-lightest transition-colors duration-300`}
          {...props}
        />
        {value && (
          <MdCancel
            size={22}
            onClick={clearInput}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default CustomTextInput;
