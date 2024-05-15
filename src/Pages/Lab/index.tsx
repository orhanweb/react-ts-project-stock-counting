import React, { useMemo } from "react";
import AsyncIconButton from "../../Components/Buttons/AsyncIconButton";
import Select from "react-select";
import { Product } from "../../Redux/Models/apiTypes";
import { useGetProductsByBarcodeQuery } from "../../Redux/Services/productAPI";
import { debounce } from "lodash";
import { useStateManager } from "../../Hooks/useStateManager";
import { useErrorManager } from "../../Hooks/useErrorManager";
import { IoQrCode } from "react-icons/io5";
import BarcodeScanner from "../../Components/BarcodeScanner";

interface AddProductState {
  selectedProduct: Product | null;
  barcodeInput: string;
  isShowBarcodeScanner: boolean;
}

const initialState: AddProductState = {
  selectedProduct: null,
  barcodeInput: "",
  isShowBarcodeScanner: false,
};

const LabPage: React.FC = () => {
  const { state, updateState } = useStateManager<AddProductState>(initialState);
  const {
    data: productsData,
    isFetching: isLProducts,
    error: eProducts,
  } = useGetProductsByBarcodeQuery(
    { barcode: state.barcodeInput },
    { skip: state.barcodeInput.length < 3 }
  );

  // --- MANAGING ERRORS
  useErrorManager([
    { error: eProducts, message: "Ürünler Yüklenirken Bir Hata Oluştu" },
  ]);

  // --- FUNCTIONS
  const productOptions = useMemo(() => {
    return (
      productsData?.map((product) => ({
        value: product.id,
        label: `${product.name} Barkod: ${product.barcode1}`,
      })) || []
    );
  }, [productsData]);

  const debouncedUpdateBarcode = debounce((value) => {
    updateState("barcodeInput", value);
  }, 500);

  // Function running if barcode is scanned
  const handleBarcodeScanned = (scannedBarcode: string) => {
    console.log(scannedBarcode);
  };

  return (
    <div id="add-product-page" className="w-full lg:w-3/4 mx-auto">
      <div className="flex items-center gap-2 w-full">
        <div className="flex-grow">
          <Select
            isClearable
            value={
              state.selectedProduct
                ? productOptions.find(
                    (option) => option.value === state.selectedProduct?.id
                  )
                : null
            }
            onInputChange={(inputValue) => debouncedUpdateBarcode(inputValue)}
            options={productOptions}
            isLoading={isLProducts}
            onChange={(option: any) =>
              updateState(
                "selectedProduct",
                productsData?.find((product) => product.id === option?.value) ||
                  null
              )
            }
          />
        </div>
        <AsyncIconButton
          Icon={IoQrCode}
          type="button"
          onClick={() => updateState("isShowBarcodeScanner", true)}
          className="min-w-fit"
        />
      </div>
      {/* Barkod Scanner Component*/}
      {state.isShowBarcodeScanner && (
        <BarcodeScanner
          onClose={() => updateState("isShowBarcodeScanner", false)}
          onBarcodeScanned={handleBarcodeScanned}
        />
      )}
    </div>
  );
};

export default LabPage;
