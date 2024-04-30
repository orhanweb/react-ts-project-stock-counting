import React from "react";
import Select, { Props as SelectProps } from "react-select";
import CustomLabel from "../Labels/CustomLabel";

interface AutoSelectProps extends SelectProps {
  label?: string;
}

const AutoSelect: React.FC<AutoSelectProps> = (props) => {
  const { label, ...selectProps } = props;

  return (
    <div>
      <CustomLabel title={label} className="block mb-2" />
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
