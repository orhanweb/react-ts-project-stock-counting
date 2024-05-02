// src/Pages/ViewCounted.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useDeleteCountedProductMutation,
  useGetViewCountedQuery,
} from "../../../Redux/Services/countFormAPI";
import { useNotifications } from "../../../Hooks/useNotifications";
import { NotificationType } from "../../../Components/Notification/index.d";
import Loader from "../../../Components/Loader";
import { TableColumn } from "../../../Components/GenericTable/index.d";
import { ViewCountedProducts } from "../../../Redux/Models/apiTypes";
import { formatDateV2 } from "../../../Utils/formatDateFuncs";
import GenericCardList from "../../../Components/GenericCardList";
import GenericTable from "../../../Components/GenericTable";
import { useGetWorkersQuery } from "../../../Redux/Services/userAPI";
import { MdDelete } from "react-icons/md";
import AccordionCard from "../../../Components/AccordionCard";

interface ViewCountedState {
  loadingStates: {
    isLoading: boolean;
    messages: string[];
  };
  isMobileView: boolean;
  isCardOpen: boolean;
}
const initialState: ViewCountedState = {
  loadingStates: { isLoading: false, messages: [] },
  isMobileView: window.innerWidth < 1160,
  isCardOpen: false,
};

const ViewCounted: React.FC = () => {
  const { countID } = useParams<{ countID?: string }>();
  const { addNotification } = useNotifications();
  const [state, setState] = useState<ViewCountedState>(initialState);
  const updateState = <K extends keyof ViewCountedState>(
    key: K,
    value: ViewCountedState[K]
  ) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  // --- SERVICES
  const [
    deleteProduct,
    { isLoading: isLoadingDeleteAItem, isError: errorDeleteAItem },
  ] = useDeleteCountedProductMutation();

  const {
    data: countedProducts,
    isLoading: isLoadingCountedProducts,
    error: errorCountedProducts,
  } = useGetViewCountedQuery({ countID }, { skip: !countID });

  const {
    data: workersData,
    isLoading: workersLoading,
    error: workersError,
  } = useGetWorkersQuery();

  //--- MANAGING RESPONSIVE
  useEffect(() => {
    const handleResize = () =>
      updateState("isMobileView", window.innerWidth < 1160);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth]);

  // --- MANAGINC ERRORS
  useEffect(() => {
    if (errorCountedProducts)
      addNotification(
        `Sayılan ürünler yüklenirken hata oluştu: ${errorCountedProducts}`,
        NotificationType.Error
      );
    if (workersError)
      addNotification(
        `Bir hata oluştu: ${workersError}`,
        NotificationType.Error
      );
    if (errorDeleteAItem)
      addNotification(
        `Ürün silinirken bir hata oluştu: ${errorDeleteAItem}`,
        NotificationType.Error
      );
  }, [errorCountedProducts, workersError, errorDeleteAItem]);
  // --- MANAGING LOADERS
  useEffect(() => {
    const messages: string[] = [];
    if (isLoadingCountedProducts)
      messages.push("Sayılan ürünler yükleniyor...");
    if (workersLoading) messages.push("Kullanıcılar belirleniyor...");
    if (isLoadingDeleteAItem) messages.push("Ürün siliniyor...");
    // Show messages at the same time, whichever loading states are active
    updateState("loadingStates", {
      isLoading:
        isLoadingCountedProducts || workersLoading || isLoadingDeleteAItem,
      messages,
    });
  }, [isLoadingCountedProducts, workersLoading, isLoadingDeleteAItem]);
  // --- FUNCTIONS
  const getUserFullName = (userId: string) => {
    if (workersLoading) return "Yükleniyor...";
    if (!workersData) return userId;
    const userEntry = Object.values(workersData).find(
      (entry) => entry.person.id === userId
    );
    return userEntry ? userEntry.person.name : userId;
  };

  const columns: TableColumn<ViewCountedProducts>[] = [
    { header: "Ürün Kodu", key: "urun_code", sortable: true },
    { header: "Ürün Adı", key: "urun_adi", sortable: true },
    { header: "Birim", key: "unit", sortable: true },
    { header: "Unit Mult", key: "unit_mult", sortable: true },
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
      header: "Tarih",
      key: "date",
      sortable: true,
      render: (item) => formatDateV2(item.date),
    },
  ];

  const createDropdownOptions = (item: ViewCountedProducts) => [
    {
      Icon: MdDelete,
      label: "Sil",
      onClick: () =>
        deleteProduct({ trans_id: item.trans_id, user_id: item.user_id }),
      dangerEffect: true,
    },
  ];

  return (
    <div className="view-count-page w-full mx-auto">
      <Loader
        isLoading={state.loadingStates.isLoading}
        messages={state.loadingStates.messages}
      />
      <h1 className="text-xl font-bold md:text-2xl lg:text-3xl mt-10 mb-4">
        Sayılan Ürünler
      </h1>

      <div className="mb-4 ">
        <AccordionCard
          title={`Sayım Detayları ${!countedProducts ? "- Yükleniyor.." : ""}`}
          isOpen={state.isCardOpen}
          onClick={() => updateState("isCardOpen", !state.isCardOpen)}
        >
          <span className="block">
            Sayımın adı: <strong>{countedProducts?.sayim_adi}</strong>
          </span>
          <span className="block">
            Sayılan Yapı: <strong>{countedProducts?.depos_adi}</strong>
          </span>
          <span className="block">
            Ürün Çeşidi: <strong>{countedProducts?.urun_cesidi}</strong>
          </span>
          <span className="block">
            Personel Sayısı: <strong>{countedProducts?.personel_sayisi}</strong>
          </span>
          <span className="block">
            İlk ürün saati:{" "}
            <strong>
              {formatDateV2(countedProducts?.ilk_sayim_saati ?? "")}
            </strong>
          </span>
          <span className="block">
            Son ürün saati:{" "}
            <strong>
              {formatDateV2(countedProducts?.son_sayim_saati ?? "")}
            </strong>
          </span>
        </AccordionCard>
      </div>

      {state.isMobileView ? (
        <GenericCardList
          data={countedProducts?.sayilan_urunler || []}
          isLoading={isLoadingCountedProducts}
          columns={columns}
          titleKey={"urun_adi"}
          cardDropdownOptions={createDropdownOptions}
        />
      ) : (
        <GenericTable
          data={countedProducts?.sayilan_urunler || []}
          isLoading={isLoadingCountedProducts}
          columns={columns}
          dropdownOptions={createDropdownOptions}
        />
      )}
    </div>
  );
};

export default ViewCounted;
