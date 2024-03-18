import React, { useState } from "react";
import Dialog from "../../../../Components/CustomDialog";
import CustomDatePicker from "../../../../Components/CustomDatePicker";
import "react-datepicker/dist/react-datepicker.css";
import { CountList } from "../../../../Redux/Models/apiTypes";
import { formatDateV1, formatDateV2 } from "../../../../Utils/formatDateFuncs";
import { useUpdateCountDatesMutation } from "../../../../Redux/Services/countFormAPI";
import { useNotifications } from "../../../../Hooks/useNotifications";
import { NotificationType } from "../../../../Components/Notification/index.d";
import Loader from "../../../../Components/Loader";

interface DateUpdaterProps {
  isOpen: boolean;
  onClose: () => void;
  item?: CountList;
}

const DateUpdater: React.FC<DateUpdaterProps> = ({ isOpen, onClose, item }) => {
  // States
  const [dates, setDates] = useState<{ startDate?: Date; endDate?: Date }>({});
  //Queries
  const [updateCountDates, { isLoading }] = useUpdateCountDatesMutation();
  //Notifications
  const { addNotification } = useNotifications(); // Bildirim ekleme fonksiyonu

  // --- FUNCTION: Submit
  const handleConfirm = async () => {
    // item kontrolü
    if (!item) {
      addNotification(
        "Bir sorun oluştu, tekrar deneyin.",
        NotificationType.Error
      );
      return;
    }

    // Check if startDate and endDate are both empty
    if (!dates.startDate && !dates.endDate) {
      addNotification(
        "Tarihlerde bir değişiklik yapılmadı.",
        NotificationType.Info
      );
      handleClose();
      return;
    }

    // Başlangıç ve Bitiş tarihleri kontrolü
    if (dates.startDate && dates.endDate && dates.startDate > dates.endDate) {
      addNotification(
        "Başlangıç tarihi, bitiş tarihinden sonra olamaz.",
        NotificationType.Error
      );
      return;
    }

    // Mevcut zaman kontrolü
    const currentDate = new Date();
    if (
      (dates.startDate && dates.startDate < currentDate) ||
      (dates.endDate && dates.endDate < currentDate)
    ) {
      addNotification("Tarihler şuandan eski olamaz.", NotificationType.Error);
      return;
    }

    try {
      // Convert startDate and endDate to desired format (if available)
      const formattedStartDate = dates.startDate
        ? formatDateV1(dates.startDate)
        : undefined;
      const formattedEndDate = dates.endDate
        ? formatDateV1(dates.endDate)
        : undefined;

      await updateCountDates({
        countId: item.sayim_id,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      }).unwrap();

      addNotification(
        "Tarihler başarıyla güncellendi.",
        NotificationType.Success
      );
      handleClose();
    } catch (error) {
      // Hata yönetimi
      const err = error as { data?: { message?: string }; status?: number };
      addNotification(
        `Tarih güncelleme işleminde hata oluştu: ${err.data?.message} ${err.status}`,
        NotificationType.Error
      );
    }
  };

  // The close function that resets the date state and calls the external onClose function
  const handleClose = () => {
    setDates({});
    onClose();
  };

  return (
    <>
      <Loader isLoading={isLoading} messages={["Tarihler Güncelleniyor"]} />
      <Dialog
        isSmallDialog
        isOpen={isOpen}
        onClose={handleClose}
        title="Tarih Güncelle"
        onConfirm={handleConfirm}
        confirmButtonLabel="Güncelle"
        showCancelButton
        isDeactivateCloseAfterConfirm
      >
        <div className="mb-4 space-y-2">
          {item && (
            <p>{`${
              item.sayim_adi
            } adlı sayımın şuanki tarih aralığı: ${formatDateV2(
              item.baslangic
            )} - ${formatDateV2(item.bitis)}`}</p>
          )}
          {item && item.durum === "1" && (
            <p className="text-error">
              Bu sayım başladığı için başlangıç tarihini güncelleyemezsiniz,
              lütfen sadece yeni bitiş tarihini girin.
            </p>
          )}
        </div>
        {/* Date Pickers */}
        <div
          id="sayim-tarih-güncelleme"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {item && item.durum === "0" && (
            <CustomDatePicker
              label="Başlangıç Tarihi:"
              selectedDate={dates.startDate}
              onChange={(date) =>
                setDates((prevDates) => ({
                  ...prevDates,
                  startDate: date ?? undefined,
                }))
              }
              placeholderText="Başlangıç tarihi ve saati seçin"
            />
          )}
          <CustomDatePicker
            label="Bitiş Tarihi:"
            selectedDate={dates.endDate}
            onChange={(date) =>
              setDates((prevDates) => ({
                ...prevDates,
                endDate: date ?? undefined,
              }))
            }
            placeholderText="Bitiş tarihi ve saati seçin"
          />
        </div>
      </Dialog>
    </>
  );
};

export default DateUpdater;
