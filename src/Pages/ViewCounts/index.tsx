// src/Pages/ViewCounts.tsx
import React, { useEffect, useState } from "react";
import { CountInterface } from "../../Redux/Models/apiTypes";
import { useNotifications } from "../../Hooks/useNotifications";
import { NotificationType } from "../../Components/Notification/index.d";
import GenericTable from "../../Components/GenericTable";
import { TableColumn } from "../../Components/GenericTable/index.d";
import GenericCardList from "../../Components/GenericCardList";
import Loader from "../../Components/Loader";
import { useNavigate } from "react-router-dom";
import {
  useGetCountListQuery,
  useStartCountMutation,
  useEndCountMutation,
} from "../../Redux/Services/countFormAPI";
import DateUpdater from "./Modals/DateUpdater";
import { formatDateV2 } from "../../Utils/formatDateFuncs";
import DeleteAItem from "./Modals/DeleteAItem";
import { TbExternalLink, TbPlayerStopFilled } from "react-icons/tb";
import { IoCalendar } from "react-icons/io5";
import { FaPlay } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { useLoadingManager } from "../../Hooks/useLoadingManager";
import { useErrorManager } from "../../Hooks/useErrorManager";

// An object to control dialog states
const initialDialogState = {
  isDateUpdaterOpen: false,
  isDeleteConfirmationOpen: false,
};

const ViewCounts: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1160);
  const [dialogState, setDialogState] = useState(initialDialogState);
  const [selectedItemForDialogs, setSelectedItemForDialogs] = useState<
    CountInterface | undefined
  >();

  // --- SERVICES
  const {
    data: countList,
    isLoading: isLCountList,
    error: eCountList,
  } = useGetCountListQuery();
  const [startCount, { isLoading: isLStartCount }] = useStartCountMutation();
  const [endCount, { isLoading: isLEndCount }] = useEndCountMutation();

  //--- MANAGING RESPONSIVE
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 1200);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // --- MANAGINC ERRORS
  useErrorManager([
    {
      error: eCountList,
      message: "Sayım listesi yüklenirken bir hata oluştu",
    },
  ]);

  // --- MANAGING LOADERS
  const loadingStates = useLoadingManager([
    { isLoading: isLCountList, message: "Sayım listesi yükleniyor..." },
    { isLoading: isLStartCount, message: "Sayım başlatılıyor..." },
    { isLoading: isLEndCount, message: "Sayım bitiriliyor..." },
  ]);

  // --- DIALOG FUNCTIONS
  const openDateUpdater = (item: CountInterface) => {
    setSelectedItemForDialogs(item);
    setDialogState({ ...dialogState, isDateUpdaterOpen: true });
  };
  const openDeleteConfirmation = (item: CountInterface) => {
    setSelectedItemForDialogs(item);
    setDialogState({ ...initialDialogState, isDeleteConfirmationOpen: true });
  };
  const closeAllDialogs = () => {
    setSelectedItemForDialogs(undefined);
    setDialogState(initialDialogState);
  };

  const createDropdownOptions = (item: CountInterface) => [
    ...(item.durum === "1"
      ? [
          {
            Icon: TbExternalLink,
            label: "Sayıma Git",
            onClick: () => navigate(`/count/${item.sayim_id}/addProduct`),
          },
        ]
      : []),
    ...(item.durum === "1" || item.durum === "2"
      ? [
          {
            Icon: TbExternalLink,
            label: "Sayılanları Göster",
            onClick: () => navigate(`/count/${item.sayim_id}/view-counted`),
          },
        ]
      : []),
    ...(item.durum === "0"
      ? [
          {
            Icon: FaPlay,
            label: "Sayımı Başlat",
            onClick: () =>
              startCount({ countId: item.sayim_id, status: "1" })
                .unwrap()
                .then(() =>
                  addNotification(
                    `Sayım başlatıldı: ${item.sayim_adi}`,
                    NotificationType.Success
                  )
                )
                .catch((error) => {
                  const err = error as {
                    data?: { message?: string };
                    status?: number;
                  };
                  addNotification(
                    `Sayım başlatılırken bir hata oluştu: ${err.data?.message} ${err.status}`,
                    NotificationType.Error
                  );
                }),
          },
        ]
      : []),

    ...(item.durum === "1"
      ? [
          {
            Icon: TbPlayerStopFilled,
            label: "Sayımı Bitir",
            onClick: () =>
              endCount({ countId: item.sayim_id, status: "2" })
                .unwrap()
                .then(() =>
                  addNotification(
                    `Sayım bitirildi: ${item.sayim_adi}`,
                    NotificationType.Success
                  )
                )
                .catch((error) => {
                  const err = error as {
                    data?: { message?: string };
                    status?: number;
                  };
                  addNotification(
                    `Sayım bitirilirken bir hata oluştu: ${err.data?.message} ${err.status}`,
                    NotificationType.Error
                  );
                }),
          },
        ]
      : []),
    ...(item.durum === "0" || item.durum === "1"
      ? [
          {
            Icon: IoCalendar,
            label: "Tarihi Güncelle",
            onClick: () => openDateUpdater(item),
          },
        ]
      : []),
    ...(item.durum === "0" || item.durum === "2"
      ? [
          {
            Icon: MdDelete,
            label: "Sil",
            onClick: () => openDeleteConfirmation(item),
            dangerEffect: true,
          },
        ]
      : []),
  ];

  return (
    <div className="view-count-page w-full mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4 md:text-3xl lg:text-4xl mt-8 cursor-default">
        Sayım Listesi
      </h1>
      <Loader
        isLoading={loadingStates.isLoading}
        messages={loadingStates.messages}
      />
      {isMobileView ? (
        <GenericCardList
          initialSortBy="bitis"
          data={countList || []}
          isLoading={isLCountList}
          columns={viewCountsColumns}
          titleKey="sayim_adi"
          cardDropdownOptions={createDropdownOptions}
        />
      ) : (
        <GenericTable
          initialSortBy="bitis"
          data={countList || []}
          isLoading={isLCountList}
          columns={viewCountsColumns}
          dropdownOptions={createDropdownOptions}
        />
      )}
      <DateUpdater
        isOpen={dialogState.isDateUpdaterOpen}
        onClose={closeAllDialogs}
        item={selectedItemForDialogs}
      />
      <DeleteAItem
        isOpen={dialogState.isDeleteConfirmationOpen}
        onClose={closeAllDialogs}
        item={selectedItemForDialogs}
      />
    </div>
  );
};

export default ViewCounts;

const viewCountsColumns: TableColumn<CountInterface>[] = [
  { header: "Sayım Adı", key: "sayim_adi", sortable: true },
  {
    header: "Başlangıç Tarihi",
    key: "baslangic",
    sortable: true,
    render: (item) => formatDateV2(item.baslangic),
  },
  {
    header: "Bitiş Tarihi",
    key: "bitis",
    sortable: true,
    render: (item) => formatDateV2(item.bitis),
  },
  { header: "Sayım Türü", key: "tur", sortable: true },
  { header: "Sayım Tipi", key: "tip", sortable: true },
  { header: "Sayım Alanı", key: "alan", sortable: true },
  { header: "Yapı Adı", key: "depo_name", sortable: true },
  {
    header: "Sayım Durumu",
    key: "durum",
    sortable: true,
    render: (item) => {
      switch (item.durum) {
        case "0":
          return "Sayım Başlamadı";
        case "1":
          return "Sayım Devam Ediyor";
        case "2":
          return "Sayım Bitti";
        default:
          return "Bilgi yok";
      }
    },
  },
];
