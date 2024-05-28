import { useEffect, useState } from "react";
import { TableColumn } from "../../../GenericTable/index.d";
import CustomTextInput from "../../../CustomTextInput";
import Dialog from "../../../CustomDialog";
import { renderContent } from "../../../../Utils/renderContent";

interface FilterDialogProps<T> {
  isFilterDialogOpen: boolean;
  setIsFilterDialogOpen: (isOpen: boolean) => void;
  columns: TableColumn<T>[];
  data: T[];
  onFilter: (filteredData: T[]) => void;
}

const FilterDialog = <T extends {}>({
  isFilterDialogOpen,
  setIsFilterDialogOpen,
  columns,
  data,
  onFilter,
}: FilterDialogProps<T>) => {
  const [searchTerms, setSearchTerms] = useState<Record<keyof T, string>>(
    {} as Record<keyof T, string>
  );

  useEffect(() => {
    applyFilters();
  }, [data]);

  const applyFilters = () => {
    const filteredData = data.filter((item) => {
      return Object.keys(searchTerms).every((key) => {
        const searchTerm = searchTerms[key as keyof T]?.toLowerCase();
        const column = columns.find((col) => col.key === key);
        let itemValue = "";

        if (column?.render) {
          const renderedContent = column.render(item);
          if (typeof renderedContent === "string") {
            itemValue = renderedContent.toLowerCase();
          } else {
            return true;
          }
        } else {
          const renderedContent = renderContent(item[key as keyof T]);
          if (typeof renderedContent === "string") {
            itemValue = renderedContent.toLowerCase();
          }
        }

        return itemValue.includes(searchTerm);
      });
    });

    onFilter(filteredData);
    setIsFilterDialogOpen(false);
  };

  const handleSearchChange = (key: keyof T, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchTerms({} as Record<keyof T, string>);
  };

  return (
    <Dialog
      title="Filtrele"
      confirmButtonLabel="Uygula"
      isOpen={isFilterDialogOpen}
      onClose={() => {
        applyFilters();
        setIsFilterDialogOpen(false);
      }}
      onConfirm={applyFilters}
      onCancel={clearFilters}
      showCancelButton
      isDeactivateCloseAfterCancel
      cancelButtonLabel="Temizle"
    >
      <div className="flex flex-col gap-4">
        {columns.map((column, index) => (
          <CustomTextInput
            key={index}
            id={`filter-${index}`}
            label={column.header}
            placeholder="Ara..."
            value={searchTerms[column.key as keyof T] || ""}
            onChange={(e) => handleSearchChange(column.key, e.target.value)}
          />
        ))}
      </div>
    </Dialog>
  );
};

export default FilterDialog;
