// src/Components/ActionBar/index.tsx
import React from "react";
import { ActionBarProps } from "./index.d";
import { twMerge } from "tailwind-merge";

const ActionBar: React.FC<ActionBarProps> = ({ buttons, clasName }) => {
  return (
    <div
      id="actionbar"
      className={twMerge(
        `flex flex-row gap-2 overflow-x-auto w-full`,
        clasName
      )}
    >
      {buttons &&
        buttons.map((button, index) => (
          <button
            key={`actionBarButton-${index} `}
            onClick={button.onClick}
            className={`px-4 py-2 rounded-lg cursor-default text-sm whitespace-nowrap transition ease-in-out duration-300 ${
              button.className ||
              "bg-primary hover:bg-primary-lighter dark:hover:bg-primary-darker text-text-darkest dark:text-text-lightest"
            }`}
          >
            {button.text}
          </button>
        ))}
    </div>
  );
};

export default ActionBar;
