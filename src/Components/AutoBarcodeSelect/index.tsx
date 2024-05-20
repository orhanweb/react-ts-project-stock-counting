import React, { useRef, useState } from "react";
import Select, { Props as SelectProps } from "react-select";
import { IoQrCode } from "react-icons/io5";
import AsyncIconButton from "../Buttons/AsyncIconButton";
import BarcodeQRScanner from "../BarcodeQRScanner";
import CustomLabel from "../Labels/CustomLabel";

// AutoBarcodeSelectProps: Defines the component's props
interface AutoBarcodeSelectProps
  extends Omit<SelectProps<any>, "inputValue" | "onInputChange"> {
  externalInputValue?: string;
  onExternalInputChange?: (value: string) => void;
  label?: string;
}

const AutoBarcodeSelect: React.FC<AutoBarcodeSelectProps> = ({
  externalInputValue,
  onExternalInputChange,
  label,
  ...props
}) => {
  // State and Refs
  const [isBarcodeScannerVisible, setBarcodeScannerVisible] = useState(false);
  const [internalInputValue, setInternalInputValue] = useState("");
  const selectRef = useRef<any>(null);

  // handleInputChange: Updates the input value and calls the external function
  const handleInputChange = (value: string) => {
    setInternalInputValue(value);
    onExternalInputChange?.(value);
  };

  // handleBarcodeScanned: Updates the input value when the barcode is scanned
  const handleBarcodeScanned = (scannedBarcode: string) => {
    handleInputChange(scannedBarcode);
    selectRef.current?.focus();
    selectRef.current?.onMenuOpen();
  };

  return (
    <div>
      {label && <CustomLabel title={label} className="block mb-2" />}
      <div className="flex items-center gap-2 w-full">
        <div className="flex-grow">
          <Select
            ref={selectRef}
            inputValue={externalInputValue ?? internalInputValue}
            onInputChange={handleInputChange}
            maxMenuHeight={200}
            menuPosition="fixed"
            className="my-react-select-container"
            classNamePrefix="my-react-select"
            {...props}
          />
        </div>
        <AsyncIconButton
          Icon={IoQrCode}
          type="button"
          onClick={() => setBarcodeScannerVisible(true)}
          className="min-w-fit"
        />
      </div>
      {isBarcodeScannerVisible && (
        <BarcodeQRScanner
          onClose={() => setBarcodeScannerVisible(false)}
          onDetected={handleBarcodeScanned}
        />
      )}
    </div>
  );
};

export default AutoBarcodeSelect;
