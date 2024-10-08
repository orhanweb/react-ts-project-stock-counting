import React, { FormEvent, useCallback, useEffect, useMemo } from "react";

import AsyncIconButton from "../../../Components/Buttons/AsyncIconButton";
import { IoIosAddCircle } from "react-icons/io";
import { Navigate, useParams } from "react-router-dom";

import Loader from "../../../Components/Loader";
import Subtitle from "../../../Components/Labels/Subtitle";
import { useTranslation } from "react-i18next";
import { useNotifications } from "../../../Hooks/useNotifications";
import { useGetCountDetailsQuery } from "../../../Redux/Services/countFormAPI";
import { useAddProductToCountMutation } from "../../../Redux/Services/countFormAPI";
import { NotificationType } from "../../../Components/Notification/index.d";
import AutoSelect from "../../../Components/AutoSelect";
import { AddProductToCount, Product } from "../../../Redux/Models/apiTypes";
import {
  useGetProductsByBarcodeQuery,
  useGetProductsByCodeQuery,
} from "../../../Redux/Services/productAPI";
import { MdSwapHoriz } from "react-icons/md";
import { debounce } from "lodash";
import { useGetSessionQuery } from "../../../Redux/Services/sessionAPI";
import { useStateManager } from "../../../Hooks/useStateManager";
import { useErrorManager } from "../../../Hooks/useErrorManager";
import { useLoadingManager } from "../../../Hooks/useLoadingManager";
import AutoBarcodeSelect from "../../../Components/AutoBarcodeSelect";
import AccordionCard from "../../../Components/AccordionCard";
import AddedProductList, { AddedProduct } from "./AddedProductList";

interface AddProductState {
  redirectToNotFound: {
    active: boolean;
    message: string;
  };
  selectedProduct: Product | null;
  barcodeInput: string;
  codeInput: string;
  stockQuantities: Record<string, string>;
  isShowBarcodeInput: boolean;
  isAccordionOpen: boolean;
  addedProducts: AddedProduct[];
}

const initialState: AddProductState = {
  redirectToNotFound: { active: false, message: "" },
  selectedProduct: null,
  barcodeInput: "",
  codeInput: "",
  stockQuantities: {},
  isShowBarcodeInput: true,
  isAccordionOpen: false,
  addedProducts: [],
};

const AddProduct: React.FC = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotifications();

  const { countID } = useParams<{ countID: string | undefined }>();
  const { state, updateState } = useStateManager<AddProductState>(initialState);

  // If countID is not defined, redirect to NotFoundPage
  if (!countID) {
    updateState("redirectToNotFound", {
      active: true,
      message: "İstenen sayfa bulunamadı",
    });
    return;
  }
  const [addProduct, { isLoading: formIsLoading }] =
    useAddProductToCountMutation();

  const {
    data: countDetails,
    isLoading: isLCountDetails,
    error: eCountDetails,
  } = useGetCountDetailsQuery({ countID });

  const {
    data: sessionData,
    isLoading: isLSession,
    error: eSession,
  } = useGetSessionQuery();

  const {
    data: productsData,
    isFetching: isLProducts,
    error: eProducts,
  } = useGetProductsByBarcodeQuery(
    { barcode: state.barcodeInput },
    { skip: state.barcodeInput.length < 3 }
  );

  const {
    data: productsDataForCode,
    isFetching: isLProductsForCode,
    error: eProductsForCode,
  } = useGetProductsByCodeQuery(
    { code: state.codeInput },
    { skip: state.codeInput.length < 3 }
  );

  // --- MANAGING ERRORS
  useErrorManager([
    { error: eCountDetails, message: "Bir hata oluştu" },
    { error: eSession, message: "Kullanıcı çekilemedi" },
    { error: eProducts, message: "Ürünler Yüklenirken Bir Hata Oluştu" },
    { error: eProductsForCode, message: "Ürünler Yüklenirken Bir Hata Oluştu" },
    {
      error: eCountDetails,
      message: "Sayım verileri yüklenirken bir hata oluştu",
    },
  ]);

  useEffect(() => {
    // If countDetails is undefined, redirect the user to a 404 page
    if (!isLCountDetails && !countDetails) {
      updateState("redirectToNotFound", {
        active: true,
        message: "İlgili sayım bulunamadı veya getirilemedi.",
      });
      return;
    }

    // Inform and guide the user if the count is completed
    if (countDetails && countDetails.durum === "2") {
      addNotification("Bu sayım tamamlanmış", NotificationType.Info);
      updateState("redirectToNotFound", {
        active: true,
        message: "Sayım tamamlanmış ve bu sayfa artık geçerli değil.",
      });
    }
  }, [countDetails, isLCountDetails]);

  // --- MANAGING LOADERS
  const loadingStates = useLoadingManager([
    { isLoading: isLCountDetails, message: "Sayım bilgileri güncelleniyor..." },
    { isLoading: isLSession, message: "Session bilgileri sorgulanıyor..." },
  ]);

  // --- USEEFFECT for update stock quantities
  useEffect(() => {
    const newStockQuantities: Record<string, string> = {};
    if (state.selectedProduct) {
      // Reset stock quantities when product changes
      if (state.selectedProduct.unit)
        newStockQuantities[state.selectedProduct.unit] = "";
      if (state.selectedProduct.unit2)
        newStockQuantities[state.selectedProduct.unit2] = "";
      if (state.selectedProduct.unit3)
        newStockQuantities[state.selectedProduct.unit3] = "";
    }
    updateState("stockQuantities", newStockQuantities);
  }, [state.selectedProduct]);

  // --- FUNCTIONS
  const productOptions = useMemo(() => {
    return (
      productsData?.map((product) => ({
        value: product.id,
        label: `${product.name} Barkod: ${product.barcode1}`,
      })) || []
    );
  }, [productsData]);

  const productOptionsForCode = useMemo(() => {
    return (
      productsDataForCode?.map((product) => ({
        value: product.id,
        label: `${product.name} [Kod: ${product.code}]`,
      })) || []
    );
  }, [productsDataForCode]);

  const toggleInputType = () => {
    updateState("selectedProduct", null);
    updateState("barcodeInput", "");
    updateState("codeInput", "");

    updateState("isShowBarcodeInput", !state.isShowBarcodeInput);
  };

  const debouncedUpdateBarcode = useCallback(
    debounce((value) => {
      updateState("barcodeInput", value);
    }, 500),
    []
  );

  const debouncedUpdateCode = useCallback(
    debounce((value) => {
      updateState("codeInput", value);
    }, 500),
    []
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // selectedWorker ve selectedProduct kontrolü
    if (!countDetails || !sessionData?.id || !state.selectedProduct) {
      addNotification(t("common.form-is-empty"), NotificationType.Error);
      return;
    }

    const filteredStockData = Object.entries(state.stockQuantities).reduce<
      Record<string, string>
    >((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {});

    // Create form value
    const formData: AddProductToCount = {
      sayim_id: countDetails.sayim_id,
      depos_id: countDetails.depo_id,
      code: state.selectedProduct.code, // product code
      inv_id: state.selectedProduct.id, // product id
      user_id: parseInt(sessionData.id.toString()),
      stockData: filteredStockData,
    };

    const newProduct: AddedProduct = {
      barcode: state.selectedProduct.barcode1,
      name: state.selectedProduct.name,
      stockData: filteredStockData,
    };

    try {
      await addProduct(formData).unwrap();
      addNotification(t("add-product.added-product"), NotificationType.Success);
      // Add the newly added product to the list
      updateState("addedProducts", [newProduct, ...state.addedProducts]);
      // Reset product for next adding
      updateState("selectedProduct", null);
    } catch (error) {
      const err = error as { data?: { message?: string }; status?: number };
      const errorMessage = err.data?.message || "Bilinmeyen Hata";
      addNotification(`Hata oluştu ${errorMessage}`, NotificationType.Error);
    }
  };

  const renderProductDetails = (product: Product) => {
    const productDetails = [
      { label: "Kod", value: product.code },
      { label: "Barkod 1", value: product.barcode1 },
      { label: "Barkod 2", value: product.barcode2 },
      { label: "Barkod 3", value: product.barcode3 },
      { label: "Birim", value: product.unit },
      { label: "Birim Mult", value: product.unitmult },
      { label: "Birim 2", value: product.unit2 },
      { label: "Birim 2 Mult", value: product.unit2mult },
      { label: "Birim 3", value: product.unit3 },
      { label: "Birim 3 Mult", value: product.unit3mult },
    ];

    return (
      <ul className="list-disc list-inside space-y-2">
        {productDetails
          .filter((detail) => detail.value) // Filter empty values
          .map((detail, index) => (
            <li key={index}>
              <span className="opacity-75">{detail.label}: </span>
              {detail.value}
            </li>
          ))}
      </ul>
    );
  };

  return (
    <div id="add-product-page" className="w-full lg:w-3/4 mx-auto">
      {state.redirectToNotFound.active && (
        <Navigate
          to="/not-found"
          replace
          state={{ message: state.redirectToNotFound.message }}
        />
      )}
      <Loader
        isLoading={loadingStates.isLoading}
        messages={loadingStates.messages}
      />
      <h1 className="text-xl font-bold md:text-2xl lg:text-3xl mt-10 mb-4">
        {t("add-product.page-title")}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Subtitle text="Sayım Detayları" />
        <div id="count-details" className="space-y-2">
          <ul className="list-disc list-inside space-y-2">
            <li>
              Sayım adı:{" "}
              {countDetails ? countDetails.sayim_adi : "Yükleniyor..."}
            </li>
            <li>
              Saydığınız Yapı:{" "}
              {countDetails ? countDetails.depo_name : "Yükleniyor..."}
            </li>
            <li>
              Sayan Kişi:{" "}
              {sessionData?.name ? sessionData.name : "Yükleniyor..."}
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-baseline justify-between mb-2">
            <Subtitle text="Ürün Seç" />
            <AsyncIconButton
              Icon={MdSwapHoriz}
              type="button"
              onClick={toggleInputType}
              className="min-w-fit"
            />
          </div>

          {state.isShowBarcodeInput ? (
            <AutoBarcodeSelect
              id="product-barcode-selector"
              placeholder="Ürün barkodu..."
              isClearable
              required
              noOptionsMessage={(obj) =>
                obj.inputValue.length < 3
                  ? "Minimum 3 karakter"
                  : "Aradığınız ürün bulunamadı"
              }
              value={
                state.selectedProduct
                  ? productOptions.find(
                      (option) => option.value === state.selectedProduct?.id
                    )
                  : null
              }
              onExternalInputChange={(inputValue) =>
                debouncedUpdateBarcode(inputValue)
              }
              options={productOptions}
              isLoading={isLProducts}
              onChange={(option: any) =>
                updateState(
                  "selectedProduct",
                  productsData?.find(
                    (product) => product.id === option?.value
                  ) || null
                )
              }
            />
          ) : (
            <AutoSelect
              id="product-code-selector"
              placeholder="Ürün kodu veya adı..."
              isClearable
              required
              noOptionsMessage={(obj) =>
                obj.inputValue.length < 3
                  ? "Minimum 3 karakter"
                  : "Aradığınız ürün bulunamadı"
              }
              value={
                state.selectedProduct
                  ? productOptionsForCode.find(
                      (option) => option.value === state.selectedProduct?.id
                    )
                  : null
              } // Show selected product
              onInputChange={(inputValue) => debouncedUpdateCode(inputValue)}
              options={productOptionsForCode}
              isLoading={isLProductsForCode}
              onChange={(option: any) =>
                updateState(
                  "selectedProduct",
                  productsDataForCode?.find(
                    (product) => product.id === option?.value
                  ) || null
                )
              }
            />
          )}
        </div>
        {state.selectedProduct && (
          <AccordionCard
            title={state.selectedProduct.name}
            isOpen={state.isAccordionOpen}
            onClick={() =>
              updateState("isAccordionOpen", !state.isAccordionOpen)
            }
          >
            {renderProductDetails(state.selectedProduct)}
          </AccordionCard>
        )}

        <Subtitle text={t("add-product.sub-title-3")} />
        <div id="entering-stock" className="w-full">
          {state.selectedProduct ? (
            <div className="flex flex-col lg:flex-row w-full items-center justify-center gap-4">
              {Object.keys(state.stockQuantities).map((unitType) => (
                <input
                  key={unitType}
                  id={unitType}
                  min={0}
                  type="number"
                  step="0.0001"
                  placeholder={t("add-product.dynamic-unit", { unitType })}
                  className="w-full border rounded-lg p-2 border-background bg-transparent text-text-darkest dark:text-text-lightest focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-300 ease-in-out"
                  value={state.stockQuantities[unitType]}
                  onChange={(e) =>
                    updateState("stockQuantities", {
                      ...state.stockQuantities,
                      [unitType]: e.target.value,
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <p className="text-text-light">{t("add-product.warning-unit")}</p>
          )}
        </div>
        <AsyncIconButton
          type="submit"
          isLoading={formIsLoading}
          title={t("add-product.add-count")}
          Icon={IoIosAddCircle}
        />
      </form>
      {state.addedProducts.length > 0 && (
        <AddedProductList addedProducts={state.addedProducts} />
      )}
    </div>
  );
};

export default AddProduct;
