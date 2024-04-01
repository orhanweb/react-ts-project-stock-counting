import React, { useState, FormEvent, useEffect } from "react";
import AutoComplete from "../../../Components/AutoComplete";
import {
  useGetCorridorsQuery,
  useGetStructureQuery,
  useGetSectionAndLevelQuery,
} from "../../../Redux/Services/countLocationAPI";
import {
  Corridor,
  Product,
  SectionAndLevel,
} from "../../../Redux/Models/apiTypes";
import { AutoCompleteProps } from "../../../Components/AutoComplete/index.d";
import AutoCompleteV2 from "../../../Components/AutoCompleteV2";
import {
  useGetProductNamesQuery,
  useGetBarcodesQuery,
} from "../../../Redux/Services/productsInfosAPI";
import { MdSwapHoriz } from "react-icons/md";
import { FaQrcode } from "react-icons/fa6";
import BarcodeScanner from "../../../Components/BarcodeScanner";
import { useQueryWrapper } from "../../../Hooks/useQueryWrapper";
import { useNotifications } from "../../../Hooks/useNotifications";
import { NotificationType } from "../../../Components/Notification/index.d";
import AsyncIconButton from "../../../Components/Buttons/AsyncIconButton";
import { IoIosAddCircle } from "react-icons/io";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Function that parses product unit types
const getUnitTypes = (product: Product) => {
  let units: string[] = [];
  if (product.unit && !units.includes(product.unit)) units.push(product.unit);
  if (product.unit2 && !units.includes(product.unit2))
    units.push(product.unit2);
  if (product.unit3 && !units.includes(product.unit3))
    units.push(product.unit3);
  return units;
};

const AddProduct: React.FC = () => {
  // Get the :countID value when the page is first opened
  // Make a request, redirect the user to 404 or keep them on the page depending on the result.
  // The selected structure type will come from the api, deselect the structure selection here
  const { countID } = useParams<{ countID: string }>();
  const { data: selectedStructure } = useGetStructureQuery({
    countID: countID ?? "2",
  });
  const { t } = useTranslation();
  const { addNotification } = useNotifications();

  // States to be sent to the database
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | null>(
    null
  );
  const [selectedSectionLevel, setSelectedSectionLevel] =
    useState<SectionAndLevel | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [unitValues, setUnitValues] = useState<Record<string, string>>({});

  // States used in page control
  const [showScanner, setShowScanner] = useState<boolean>(false); // State for barcode reader visibility
  const [barcodeValue, setBarcodeValue] = useState<string>("");
  const [showBarcodeInput, setShowBarcodeInput] = useState<boolean>(true);
  const [isFormInvalid, setIsFormInvalid] = useState<boolean>(false);
  const [ignoreReset, setIgnoreReset] = useState(false);

  // Update unitValues state when the selected product changes
  useEffect(() => {
    const initialUnitValues: Record<string, string> = {};
    if (selectedProduct) {
      getUnitTypes(selectedProduct).forEach((unitType) => {
        initialUnitValues[unitType] = "";
      });
    }
    setUnitValues(initialUnitValues);
  }, [selectedProduct]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // If any of the required states is empty, stop the process
    if (
      !selectedStructure ||
      !selectedCorridor ||
      !selectedSectionLevel ||
      !selectedProduct
    ) {
      setIsFormInvalid(true); // Form is invalid, update error state
      addNotification(t("common.form-is-empty"), NotificationType.Error);
      return;
    }
    setIsFormInvalid(false);
    // Process form data if all required fields are filled
    const formData = {
      structureID: selectedStructure.id,
      corridorId: selectedCorridor.id,
      sectionLevelId: selectedSectionLevel.id,
      productId: selectedProduct.id,
      stockData: unitValues,
    };

    console.log("Form Data:", formData);
    addNotification(t("add-product.added-product"), NotificationType.Success);
    // Here I will send formData to the API.
    setSelectedProduct(null);
  };

  // Function to choose between entering Product Name or Barcode
  const toggleInputType = () => {
    setSelectedProduct(null);
    setShowBarcodeInput(!showBarcodeInput);
  };

  // Function that updates input fields
  const handleUnitChange = (unitType: string, value: string) => {
    setUnitValues({ ...unitValues, [unitType]: value });
  };

  // Function running if barcode is scanned
  const handleBarcodeScanned = (scannedBarcode: string) => {
    setIgnoreReset(true);
    setSelectedProduct(null);
    setBarcodeValue(scannedBarcode);

    // ignoreReset becomes false on the next render cycle
    setTimeout(() => {
      setBarcodeValue("");
      setIgnoreReset(false);
    }, 600);
  };

  // LOCATION AUTO COMPLETE COMPONENTS VARIABLES
  const autoCompleteFields: AutoCompleteProps[] = [
    {
      queryHook: (arg: any, skip: boolean) =>
        useQueryWrapper(useGetCorridorsQuery, { structureID: arg }, skip),
      formatLabel: (item: Corridor) => item.name,
      placeholder: t("add-product.search-area"),
      selectedSuggestion: selectedCorridor,
      onSelect: setSelectedCorridor,
      queryArg: 2, // I gave the current static value, update it later selectedStructure?.id,
      isError: isFormInvalid && !selectedCorridor,
    },
    {
      queryHook: (arg: any, skip: boolean) =>
        useQueryWrapper(
          useGetSectionAndLevelQuery,
          { zoneId: arg },
          skip || !selectedCorridor
        ),
      formatLabel: (item: SectionAndLevel) =>
        t("add-product.dynamic-region-and-floor-autocomplate", {
          region: item.name,
          floor: item.floor,
        }),
      placeholder: t("add-product.search-region-and-floor"),
      selectedSuggestion: selectedSectionLevel,
      onSelect: setSelectedSectionLevel,
      queryArg: selectedCorridor?.id,
      disabled: !selectedCorridor,
      isError: isFormInvalid && !selectedSectionLevel,
    },
  ];

  return (
    <div id="add-product-page" className="w-full lg:w-3/4 mx-auto">
      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl mt-8 mb-4">
        {t("add-product.page-title")}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-center text-xl md:text-2xl lg:text-3xl">
          {t("add-product.sub-title-1")}
        </h2>
        <p>{selectedStructure?.depo}</p>{" "}
        {/*Update this part, the build type should also be printed*/}
        <div
          id="picking-location"
          className=" flex flex-col lg:flex-row w-full items-center justify-center gap-4"
        >
          {autoCompleteFields.map((field, index) => (
            <AutoComplete
              key={index}
              queryHook={field.queryHook}
              formatLabel={field.formatLabel}
              placeholder={field.placeholder}
              selectedSuggestion={field.selectedSuggestion}
              onSelect={field.onSelect}
              queryArg={field.queryArg}
              disabled={field.disabled}
              isError={field.isError}
            />
          ))}
        </div>
        <h2 className="text-center text-xl md:text-2xl lg:text-3xl">
          {t("add-product.sub-title-2")}
        </h2>
        <div
          id="picking-product"
          className="flex flex-row items-center justify-center gap-2 w-full"
        >
          <AsyncIconButton
            Icon={MdSwapHoriz}
            type="button"
            onClick={toggleInputType}
            className="min-w-fit px-2 py-2"
          />
          {showBarcodeInput ? (
            <div className="flex items-center w-full gap-2">
              <AutoCompleteV2
                key={"barcode"}
                queryHook={(arg: any, skip: boolean) =>
                  useQueryWrapper(
                    useGetBarcodesQuery,
                    { barcode: arg },
                    skip || !arg
                  )
                }
                formatLabel={(item: Product) =>
                  t("add-product.dynamic-barcode-autocomplate", {
                    product: item.name,
                    barcode: item.barcode1,
                  })
                }
                formatInputValue={(item: Product) => item.barcode1}
                onSelect={setSelectedProduct}
                selectedSuggestion={selectedProduct}
                placeholder={t("add-product.search-barcode")}
                isError={isFormInvalid && !selectedProduct}
                externalInputValue={barcodeValue}
                ignoreResetOnSelectedSuggestionNull={ignoreReset}
              />
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="p-2 text-xl bg-background-light text-text-darkest dark:bg-background-darkest dark:text-text-lightest rounded-lg hover:text-primary hover:dark:text-primary transition-colors duration-300 ease-in-out"
              >
                <FaQrcode />
              </button>
            </div>
          ) : (
            <AutoCompleteV2
              key={"productNameOrCode"}
              queryHook={(arg: any, skip: boolean) =>
                useQueryWrapper(
                  useGetProductNamesQuery,
                  { productName: arg },
                  skip || !arg
                )
              }
              formatLabel={(item: Product) =>
                t("add-product.dynamic-product-autocomplate", {
                  product: item.name,
                  code: item.code,
                })
              }
              formatInputValue={(item: Product) => item.name}
              onSelect={setSelectedProduct}
              selectedSuggestion={selectedProduct}
              placeholder={t("add-product.search-product")}
              isError={isFormInvalid && !selectedProduct}
            />
          )}
        </div>
        <h2 className="text-center text-xl md:text-2xl lg:text-3xl">
          {t("add-product.sub-title-3")}
        </h2>
        <div id="entering-stock" className="w-full">
          {selectedProduct ? (
            <div className="flex flex-col lg:flex-row w-full items-center justify-center gap-4">
              {Object.keys(unitValues).map((unitType) => (
                <input
                  key={unitType}
                  type="number"
                  placeholder={t("add-product.dynamic-unit", { unitType })}
                  className="w-full border rounded-lg p-2 border-background bg-transparent text-text-darkest dark:text-text-lightest focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-300 ease-in-out"
                  id={unitType}
                  value={unitValues[unitType]}
                  onChange={(e) => handleUnitChange(unitType, e.target.value)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-text-light">
              {t("add-product.warning-unit")}
            </p>
          )}
        </div>
        {/* Barkod Scanner Component*/}
        {showScanner && (
          <BarcodeScanner
            onClose={() => setShowScanner(false)}
            onBarcodeScanned={handleBarcodeScanned}
          />
        )}
        <AsyncIconButton
          type="submit"
          title={t("add-product.add-count")}
          Icon={IoIosAddCircle}
        />
      </form>
    </div>
  );
};

export default AddProduct;
