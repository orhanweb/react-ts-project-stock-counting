// src/Components/SortDialog/index.tsx
import { useState } from "react";
import { SortConfig, SortDirection } from "../../../../Hooks/useSort";
import { FaCircleArrowDown, FaCircleArrowUp } from "react-icons/fa6";
import Dialog from "../../../CustomDialog";
import { TableColumn } from "../../../GenericTable/index.d";

interface SortDialogProps<T> {
  sortableColumns: TableColumn<T>[];
  isSortDialogOpen: boolean;
  sortConfig: SortConfig<T>;
  setIsSortDialogOpen: (isOpen: boolean) => void;
  requestSort: (sortBy: keyof T, direction?: SortDirection) => void;
}

const SortDialog = <T extends {}>({
  sortableColumns,
  isSortDialogOpen,
  sortConfig,
  setIsSortDialogOpen,
  requestSort,
}: SortDialogProps<T>) => {
  const [tempSortConfig, setTempSortConfig] = useState<SortConfig<T> | null>(
    null
  );

  const handleSortSelection = (columnKey: keyof T) => {
    setTempSortConfig((prevConfig) => {
      if (sortConfig?.sortBy === columnKey && !prevConfig) {
        return {
          sortBy: columnKey,
          direction:
            sortConfig.direction === SortDirection.ASCENDING
              ? SortDirection.DESCENDING
              : SortDirection.ASCENDING,
        };
      } else {
        return prevConfig && prevConfig.sortBy === columnKey
          ? {
              sortBy: columnKey,
              direction:
                prevConfig.direction === SortDirection.ASCENDING
                  ? SortDirection.DESCENDING
                  : SortDirection.ASCENDING,
            }
          : { sortBy: columnKey, direction: SortDirection.ASCENDING };
      }
    });
  };

  const getButtonStyle = (columnKey: keyof T) => {
    const activeConfig = tempSortConfig || sortConfig;
    const isActive = activeConfig && activeConfig.sortBy === columnKey;
    return isActive ? "border-primary text-primary" : "border-background";
  };

  const getSortIcon = (columnKey: keyof T) => {
    const activeConfig = tempSortConfig || sortConfig;
    if (activeConfig && activeConfig.sortBy === columnKey) {
      return activeConfig.direction === SortDirection.ASCENDING ? (
        <FaCircleArrowDown />
      ) : (
        <FaCircleArrowUp />
      );
    }
    return null;
  };

  const getColumnHeaderByKey = (key: keyof T) => {
    const column = sortableColumns.find((c) => c.key === key);
    return column ? column.header : "";
  };

  const getSortingStatusText = () => {
    if (!sortConfig && !tempSortConfig) return null;

    return tempSortConfig
      ? tempSortConfig.sortBy === sortConfig?.sortBy
        ? tempSortConfig.direction !== sortConfig?.direction
          ? "Sıralanan sütun aynı, sadece yönü değişecektir."
          : "Sıralama değişmeyecektir."
        : `Sıralama, ${getColumnHeaderByKey(
            tempSortConfig.sortBy
          )} sütununa göre yapılacaktır.`
      : `Şuanda sıralama ${getColumnHeaderByKey(
          sortConfig.sortBy
        )} sütununa göre yapılmaktadır.`;
  };

  const handleConfirmSort = () => {
    if (tempSortConfig) {
      requestSort(tempSortConfig.sortBy, tempSortConfig.direction);
    }
    setIsSortDialogOpen(false);
  };

  return (
    <Dialog
      title="Sırala"
      confirmButtonLabel="Sırala"
      isOpen={isSortDialogOpen}
      onClose={() => {
        setTempSortConfig(null);
        setIsSortDialogOpen(false);
      }}
      onConfirm={handleConfirmSort}
    >
      <div>
        <div className="text-sm font-light mb-2">
          Sıralamak istediğiniz sütunu seçin.
        </div>
        <div className="flex flex-col gap-2">
          {sortableColumns.map((column, index) => (
            <button
              type="button"
              key={index}
              onClick={() => handleSortSelection(column.key)}
              className={`px-4 py-3 text-left w-full text-sm font-medium border ${getButtonStyle(
                column.key
              )} border-background rounded-lg`}
            >
              <div className="flex justify-between items-center">
                {column.header}
                {getSortIcon(column.key)}
              </div>
            </button>
          ))}
        </div>
        {getSortingStatusText() && (
          <div className="text-sm font-light mt-2">
            {getSortingStatusText()}
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default SortDialog;
