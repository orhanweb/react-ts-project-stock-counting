// src/Pages/ViewCounted.tsx
import React, { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useDeleteCountedProductMutation,
  useGetCountDetailsQuery,
  useGetViewCountedQuery,
  useLazyGetProductsForExcelQuery,
} from "../../../Redux/Services/countFormAPI";
import { useNotifications } from "../../../Hooks/useNotifications";
import { NotificationType } from "../../../Components/Notification/index.d";
import Loader from "../../../Components/Loader";
import { TableColumn } from "../../../Components/GenericTable/index.d";
import { ViewCountedProducts } from "../../../Redux/Models/apiTypes";
import { formatDateV2, formatDateV3 } from "../../../Utils/formatDateFuncs";
import GenericCardList from "../../../Components/GenericCardList";
import GenericTable from "../../../Components/GenericTable";
import { useGetWorkersQuery } from "../../../Redux/Services/userAPI";
import { MdDelete } from "react-icons/md";
import { exportToExcel } from "../../../Utils/excelExport";
import { useLoadingManager } from "../../../Hooks/useLoadingManager";
import { useErrorManager } from "../../../Hooks/useErrorManager";
import { useStateManager } from "../../../Hooks/useStateManager";
import { DropdownOption } from "../../../Components/DropdownMenu/index.d";
import CountDetailsCard from "./CountDetailsCard";

interface ViewCountedState {
  isMobileView: boolean;
  isCardOpen: boolean;
}
const initialState: ViewCountedState = {
  isMobileView: window.innerWidth < 1160,
  isCardOpen: false,
};

const ViewCounted: React.FC = () => {
  const { countID } = useParams<{ countID?: string }>();
  const { addNotification } = useNotifications();
  const { state, updateState } =
    useStateManager<ViewCountedState>(initialState);

  // --- SERVICES
  const {
    data: countDetails,
    isLoading: isLCountDetail,
    error: eCountDetails,
  } = useGetCountDetailsQuery({ countID });

  const [deleteProduct, { isLoading: isLDeleteAItem, isError: eDeleteAItem }] =
    useDeleteCountedProductMutation();

  const {
    data: countedProducts,
    isLoading: isLCountedProducts,
    error: eCountedProducts,
  } = useGetViewCountedQuery({ countID }, { skip: !countID });

  const [getProductsForExcel, { isLoading: isLForExcel, error: eForExcel }] =
    useLazyGetProductsForExcelQuery();

  const {
    data: workersData,
    isLoading: isLWorkers,
    error: eWorkers,
  } = useGetWorkersQuery();

  //--- MANAGING RESPONSIVE
  useEffect(() => {
    const handleResize = () =>
      updateState("isMobileView", window.innerWidth < 1160);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updateState]);

  // --- MANAGINC ERRORS
  useErrorManager([
    {
      error: eCountedProducts,
      message: "Sayılan ürünler yüklenirken hata oluştu",
    },
    {
      error: eWorkers,
      message: "Kullanıcılar belirlenirken bir hata oluştu",
    },
    { error: eDeleteAItem, message: "Ürün silinirken bir hata oluştu" },
    {
      error: eForExcel,
      message: "Excel verileri yüklenirken bir hata oluştu",
    },
    {
      error: eCountDetails,
      message: "Sayım verileri yüklenirken bir hata oluştu",
    },
  ]);
  // --- MANAGING LOADERS
  const loadingStates = useLoadingManager([
    {
      isLoading: isLCountedProducts,
      message: "Sayılan ürünler yükleniyor...",
    },
    { isLoading: isLWorkers, message: "Kullanıcılar belirleniyor..." },
    { isLoading: isLDeleteAItem, message: "Ürün siliniyor..." },
    { isLoading: isLForExcel, message: "Excel dosyası hazırlanıyor..." },
    {
      isLoading: isLCountDetail,
      message: "Sayım bilgileri güncelleniyor...",
    },
  ]);

  // --- FUNCTIONS
  // Function to match the userID value from the countedProducts list with the user name
  const getUserFullName = (userId: string) => {
    if (isLWorkers) return "Yükleniyor...";
    if (!workersData) return userId;
    const userEntry = Object.values(workersData).find(
      (entry) => entry.person.id === userId
    );
    return userEntry ? userEntry.person.name : userId;
  };
  //Function that converts the list to excel format
  const handleDownloadExcel = () => {
    getProductsForExcel({ countID }).then((result) => {
      if (result.data) {
        exportToExcel({
          data: result.data,
          fileName: countedProducts?.sayim_adi || "Sayim_Raporu",
          headers: [
            { header: "Ürün Adı", key: "urun" },
            { header: "Farklı Sayım Noktası", key: "farkli_sayim_noktasi" },
            { header: "Toplam Miktar", key: "toplam_miktar" },
            { header: "Ana Birim", key: "ana_birim" },
            { header: "Birim Fiyat", key: "birim_fiyat" },
            { header: "Toplam Tutar", key: "tutar" },
            { header: "Kayıt Tarihi", key: "date", formatter: formatDateV2 },
          ],
        });
      } else {
        addNotification("Excel verileri yüklenemedi!", NotificationType.Error);
      }
    });
  };
  const columns: TableColumn<ViewCountedProducts>[] = [
    { header: "Ürün Kodu", key: "urun_code", sortable: true },
    { header: "Ürün Adı", key: "urun_adi", sortable: true },
    { header: "Birim", key: "unit", sortable: true },
    {
      header: "Miktar",
      key: "quantity",
      sortable: true,
      render: (item) => item.quantity.toString(),
    },
    {
      header: "Kullanıcı",
      key: "user_id",
      sortable: true,
      render: (item) => getUserFullName(item.user_id.toString()),
    },
    {
      header: "Saat",
      key: "time",
      sortable: true,
      render: (item) => item.time,
    },
    {
      header: "Tarih",
      key: "date",
      sortable: true,
      render: (item) => formatDateV3(item.date),
    },
  ];

  const dropdownOptions = useCallback(
    (item: ViewCountedProducts): DropdownOption[] => {
      // countDetails.durum değerini doğrudan string olarak "1" ile karşılaştır
      if (countDetails && countDetails.durum === "1") {
        return [
          {
            Icon: MdDelete,
            label: "Sil",
            onClick: () =>
              deleteProduct({ trans_id: item.trans_id, user_id: item.user_id }),
            dangerEffect: true,
          },
        ];
      }
      return []; // Sayım durumu "1" değilse boş dizi döndür
    },
    [countDetails]
  );

  return (
    <div className="view-count-page w-full mx-auto">
      <Loader
        isLoading={loadingStates.isLoading}
        messages={loadingStates.messages}
      />
      <h1 className="text-xl font-bold md:text-2xl lg:text-3xl mt-10 mb-4">
        Sayılan Ürünler
      </h1>
      <div className="mb-4">
        <CountDetailsCard
          isCardOpen={state.isCardOpen}
          toggleCardOpen={() => updateState("isCardOpen", !state.isCardOpen)}
          countDetails={countDetails}
          countedProducts={countedProducts}
        />
      </div>
      {state.isMobileView ? (
        <GenericCardList
          data={countedProducts?.sayilan_urunler || []}
          isLoading={isLCountedProducts}
          columns={columns}
          titleKey={"urun_adi"}
          cardDropdownOptions={dropdownOptions}
          actions={() => [
            {
              text: "Excel Çıktı",
              onClick: handleDownloadExcel,
            },
          ]}
        />
      ) : (
        <GenericTable
          data={countedProducts?.sayilan_urunler || []}
          isLoading={isLCountedProducts}
          columns={columns}
          dropdownOptions={dropdownOptions}
          getTableActions={() => [
            {
              label: "Excel Çıktı",
              onClick: handleDownloadExcel,
            },
          ]}
        />
      )}
    </div>
  );
};

export default ViewCounted;
