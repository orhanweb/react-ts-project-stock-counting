// Selector.tsx
import React from "react";
import { SelectorProps } from "./index.d";
import CustomLabel from "../Labels/CustomLabel";

const Selector: React.FC<SelectorProps> = ({
  label = "Selector",
  options,
  selectedOption,
  onSelect,
}) => {
  return (
    <div>
      <CustomLabel title={label} />
      <div
        className="flex gap-4 py-2 overflow-x-auto whitespace-nowrap"
        style={{ scrollbarWidth: "thin" }}
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`w-fit justify-center text-sm items-center cursor-pointer px-4 py-3 rounded-lg ${
              selectedOption === option
                ? "bg-primary-light dark:bg-primary-darkest"
                : "bg-background-lighter dark:bg-background-darkest hover:bg-primary dark:hover:bg-primary"
            } text-text-darkest dark:text-text-lightest transition-colors duration-300`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Selector;
