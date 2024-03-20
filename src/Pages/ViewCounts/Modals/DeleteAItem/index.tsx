import React from "react";
import Dialog from "../../../../Components/CustomDialog";
import "react-datepicker/dist/react-datepicker.css";
import { CountList } from "../../../../Redux/Models/apiTypes";
import { useLockCountMutation } from "../../../../Redux/Services/countFormAPI";
import { useNotifications } from "../../../../Hooks/useNotifications";
import { NotificationType } from "../../../../Components/Notification/index.d";
import Loader from "../../../../Components/Loader";
import { DialogType } from "../../../../Components/CustomDialog/index.d";

interface DeleteAItemProps {
  isOpen: boolean;
  onClose: () => void;
  item?: CountList;
}

const DeleteAItem: React.FC<DeleteAItemProps> = ({ isOpen, onClose, item }) => {
  //Queries
  const [deleteItem, { isLoading }] = useLockCountMutation();
  //Notifications
  const { addNotification } = useNotifications();

  // --- FUNCTION: Submit
  const handleConfirm = async () => {
    // item check
    if (!item) {
      addNotification(
        "Bir sorun oluştu, tekrar deneyin.",
        NotificationType.Error
      );
      return;
    }

    try {
      await deleteItem({
        countId: item.sayim_id,
      }).unwrap();
      addNotification("Sayım silindi.", NotificationType.Success);
    } catch (error) {
      // Error managament
      const err = error as { data?: { message?: string }; status?: number };
      addNotification(
        `Silme işleminde bir hata oluştu: ${err.data?.message} ${err.status}`,
        NotificationType.Error
      );
    }
  };

  return (
    <>
      <Loader isLoading={isLoading} messages={["Sayım Siliniyor"]} />
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        title="Sayımı Sil"
        onConfirm={handleConfirm}
        confirmButtonLabel="Sil"
        showCancelButton
        dialogType={DialogType.Danger}
      >
        {/* Date Pickers */}
        <div id="delete-a-item">
          Bu sayımı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
        </div>
      </Dialog>
    </>
  );
};

export default DeleteAItem;
