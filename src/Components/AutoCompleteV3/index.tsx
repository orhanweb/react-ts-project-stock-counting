import React from "react";
import Select, { Props as SelectProps } from "react-select";
import CustomLabel from "../CustomLabel";

// AutoCompleteV3 için props interface'i, Select'in tüm propslarını extend ediyor
interface AutoCompleteV3Props extends SelectProps {
  // AutoCompleteV3 için özel prop'lar buraya eklenebilir
  label?: string;
}

const AutoCompleteV3: React.FC<AutoCompleteV3Props> = (props) => {
  // props içinden customProp'u ayıklıyoruz ve geri kalan tüm props'ları Select'e geçiriyoruz
  const { label, ...selectProps } = props;

  // Özel prop'ları kullanarak burada bir işlem yapılabilir
  // Örneğin, customProp'a göre bazı hesaplamalar veya koşullu davranışlar ekleyebilirsiniz

  return (
    <div>
      <CustomLabel title={label} />
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

export default AutoCompleteV3;
