// Custom Text Input
import React, { ChangeEvent } from "react";
import { MdCancel } from "react-icons/md";
import CustomLabel from "../Labels/CustomLabel";
import { twMerge } from "tailwind-merge";

interface CustomTextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isError?: boolean;
  wrapperClassName?: string;
  isOpenClearTextButton?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  isError = false,
  className,
  wrapperClassName,
  isOpenClearTextButton = true,
  ...props
}) => {
  const clearInput = () => {
    if (props.onChange) {
      // Trigger the onChange function by creating a dummy event
      const event = {
        target: { value: "" },
        currentTarget: { value: "" },
      } as unknown as ChangeEvent<HTMLInputElement>;
      props.onChange(event);
    }
  };

  return (
    <div id="custom-text-input" className={wrapperClassName}>
      {label && (
        <div className="flex flex-row justify-between mb-2">
          <CustomLabel title={label} htmlFor={props.id} />
          {props.maxLength && (
            <div className="text-right text-xs font-mono mt-1 mr-2 cursor-default">
              {props.value ? (props.value as string).length : 0}/
              {props.maxLength}{" "}
            </div>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="text"
          className={twMerge(
            `${
              isError ? "border-error" : ""
            } border-2 bg-transparent border-background/50 p-2 ${
              props.value && isOpenClearTextButton ? "pr-10 " : ""
            } rounded-lg w-full focus:border-primary focus:ring-0 text-text-darkest dark:text-text-lightest transition-colors duration-300`,
            className
          )}
          {...props}
        />
        {props.value && isOpenClearTextButton && (
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
