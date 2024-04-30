import React from "react";
import { twMerge } from "tailwind-merge";

interface CustomLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  title?: string;
}

const CustomLabel: React.FC<CustomLabelProps> = ({
  title,
  className,
  ...props
}) => {
  return (
    <label
      className={twMerge(
        `text-gray-700 dark:text-gray-100 text-sm font-semibold`,
        className
      )}
      {...props}
    >
      {title}
    </label>
  );
};

export default CustomLabel;
