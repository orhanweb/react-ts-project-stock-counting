import React from "react";
import Select from "react-select";
import CustomLabel from "../Labels/CustomLabel";
import { AutoSelectProps } from "./index.d";

const AutoSelect: React.FC<AutoSelectProps> = (props) => {
  const { label, ...selectProps } = props;

  return (
    <div>
      {label && <CustomLabel title={label} className="block mb-2" />}
      <Select
        maxMenuHeight={200}
        menuPosition="fixed"
        className="my-react-select-container"
        classNamePrefix="my-react-select"
        {...selectProps}
      />
    </div>
  );
};

export default AutoSelect;
