import React, { FormEvent, useEffect, useMemo } from "react";

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
}

const initialState: AddProductState = {
  redirectToNotFound: { active: false, message: "" },
  selectedProduct: null,
  barcodeInput: "",
  codeInput: "",
  stockQuantities: {},
  isShowBarcodeInput: true,
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
      // Ürün değiştiğinde stok miktarlarını sıfırla
      if (state.selectedProduct.unit)
        newStockQuantities[state.selectedProduct.unit] = "";
      if (state.selectedProduct.unit2)
        newStockQuantities[state.selectedProduct.unit2] = "";
      if (state.selectedProduct.unit3)
        newStockQuantities[state.selectedProduct.unit3] = "";
    }
    updateState("stockQuantities", newStockQuantities); // Eğer seçili ürün yoksa listeyi direkt boşaltır.
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

  const debouncedUpdateBarcode = debounce((value) => {
    updateState("barcodeInput", value);
  }, 500);

  const debouncedUpdateCode = debounce((value) => {
    updateState("codeInput", value);
  }, 500);

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

    // Form verisini oluştur
    const formData: AddProductToCount = {
      sayim_id: countDetails.sayim_id,
      depos_id: countDetails.depo_id,
      code: state.selectedProduct.code, // product code
      inv_id: state.selectedProduct.id, // product value
      user_id: parseInt(sessionData.id.toString()),
      stockData: filteredStockData,
    };

    try {
      await addProduct(formData).unwrap();
      addNotification(t("add-product.added-product"), NotificationType.Success);
      // Reset product for next adding
      updateState("selectedProduct", null);
    } catch (error) {
      const err = error as { data?: { message?: string }; status?: number };
      const errorMessage = err.data?.message || "Bilinmeyen Hata";
      addNotification(`Hata oluştu ${errorMessage}`, NotificationType.Error);
    }
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
              noOptionsMessage={() => "Minimum 3 karakter"}
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
              noOptionsMessage={() => "Minimum 3 karakter"}
              value={
                state.selectedProduct
                  ? productOptionsForCode.find(
                      (option) => option.value === state.selectedProduct?.id
                    )
                  : null
              } // Seçilen ürünü göster
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
    </div>
  );
};

export default AddProduct;
