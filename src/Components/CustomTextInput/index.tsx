// Custom Text Input
import React, { ChangeEvent } from "react";
import { MdCancel } from "react-icons/md";
import CustomLabel from "../Labels/CustomLabel";
import { twMerge } from "tailwind-merge";

interface CustomTextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  value: string;
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isError?: boolean;
  wrapperClassName?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  isError = false,
  className,
  wrapperClassName,
  ...props
}) => {
  const clearInput = () => {
    // Trigger the onChange function by creating a dummy event
    const event = {
      target: { value: "" },
      currentTarget: { value: "" },
    } as unknown as ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <div id="custom-text-input" className={wrapperClassName}>
      <div className="flex flex-row justify-between mb-2">
        <CustomLabel title={label} htmlFor={id} />
        {props.maxLength && (
          <div className="text-right text-xs font-mono mt-1 mr-2 cursor-default">
            {value.length}/{props.maxLength}
          </div>
        )}
      </div>
      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          type="text"
          value={value}
          onChange={onChange}
          className={twMerge(
            `${
              isError ? "border-error" : ""
            } border-2 bg-transparent border-background/50 p-2 rounded-lg w-full focus:border-primary focus:ring-0 text-text-darkest dark:text-text-lightest transition-colors duration-300`,
            className
          )}
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
