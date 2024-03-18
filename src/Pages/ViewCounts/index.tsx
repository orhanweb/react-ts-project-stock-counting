// src/Pages/ViewCounts.tsx
import React, { useEffect, useState } from "react";
import { CountList } from "../../Redux/Models/apiTypes";
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

// Dialog durumlarını kontrol etmek için bir nesne
const initialDialogState = {
  isDateUpdaterOpen: false,
  isDeleteConfirmationOpen: false,
  // İleride ekleyebileceğiniz diğer dialoglar için daha fazla alan eklenebilir
};

const ViewCounts: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1160);
  const [loadingStates, setLoadingStates] = useState<{
    isLoading: boolean;
    messages: string[];
  }>({ isLoading: false, messages: [] });
  const [dialogState, setDialogState] = useState(initialDialogState);
  const [selectedItemForDialogs, setSelectedItemForDialogs] = useState<
    CountList | undefined
  >();

  // --- SERVICES
  const {
    data: counts,
    isLoading: isGetCountsLoading,
    error: countListError,
  } = useGetCountListQuery();
  const [startCount, { isLoading: isStartCountLoading }] =
    useStartCountMutation();
  const [endCount, { isLoading: isEndCountLoading }] = useEndCountMutation();

  //--- MANAGING RESPONSIVE
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 1160);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // --- MANAGINC ERRORS
  useEffect(() => {
    if (countListError)
      addNotification(
        `Sayım listesi yüklenirken bir hata oluştu: ${countListError}`,
        NotificationType.Error
      );
  }, [countListError]);

  // --- MANAGING LOADERS
  useEffect(() => {
    const messages: string[] = [];
    if (isGetCountsLoading) messages.push("Sayım listesi yükleniyor...");
    if (isStartCountLoading) messages.push("Sayım başlatılıyor...");
    if (isEndCountLoading) messages.push("Sayım bitiriliyor...");
    // Show messages at the same time, whichever loading states are active
    setLoadingStates({
      isLoading: isGetCountsLoading || isStartCountLoading || isEndCountLoading,
      messages,
    });
  }, [isGetCountsLoading, isStartCountLoading, isEndCountLoading]);

  // --- DIALOG FUNCTIONS
  const openDateUpdater = (item: CountList) => {
    setSelectedItemForDialogs(item);
    setDialogState({ ...dialogState, isDateUpdaterOpen: true });
  };
  const openDeleteConfirmation = (item: CountList) => {
    setSelectedItemForDialogs(item);
    setDialogState({ ...initialDialogState, isDeleteConfirmationOpen: true });
  };
  const closeAllDialogs = () => {
    setSelectedItemForDialogs(undefined);
    setDialogState(initialDialogState);
  };

  // Kullanıcıyı sayım sayfasına yönlendirdiğinde eğer sayımın süresi dolmuş veya kapalı ise kullanıcıyı not found sayfasına yönlendir   navigate('/not-found', { state: { message: 'Sayım kapalı.' } })
  const createDropdownOptions = (item: CountList) => [
    ...(item.durum === "1"
      ? [
          {
            Icon: TbExternalLink,
            label: "Sayıma Git",
            onClick: () => navigate(`/count/${item.sayim_id}/addProduct`),
          },
        ]
      : []),
    ...(item.durum === "0"
      ? [
          {
            Icon: FaPlay,
            label: "Sayımı Başlat",
            onClick: () =>
              startCount({ countId: item.sayim_id })
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
              endCount({ countId: item.sayim_id })
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
    {
      Icon: MdDelete,
      label: "Sil",
      onClick: () => openDeleteConfirmation(item),
      dangerEffect: true,
    },
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
          data={counts || []}
          isLoading={isGetCountsLoading}
          columns={viewCountsColumns}
          titleKey="sayim_adi"
          cardDropdownOptions={createDropdownOptions}
        />
      ) : (
        <GenericTable
          initialSortBy="bitis"
          data={counts || []}
          isLoading={isGetCountsLoading}
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

const viewCountsColumns: TableColumn<CountList>[] = [
  { header: "Sayım Adı", key: "sayim_adi", sortable: true },
  {
    header: "Başlangıç Tarihi",
    key: "baslangic",
    sortable: true,
    render: (item) => <strong>{formatDateV2(item.baslangic)}</strong>,
  },
  {
    header: "Bitiş Tarihi",
    key: "bitis",
    sortable: true,
    render: (item) => <strong>{formatDateV2(item.bitis)}</strong>,
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
          return <strong>Sayım Başlamadı</strong>;
        case "1":
          return <strong>Sayım Devam Ediyor</strong>;
        case "2":
          return <strong>Sayım Bitti</strong>;
        default:
          return <strong>Bilgi yok</strong>;
      }
    },
  },
];
