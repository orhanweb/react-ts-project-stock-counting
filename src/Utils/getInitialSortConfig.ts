// src/Utils/getInitialSortConfig.ts
import { TableColumn } from "../Components/GenericTable/index.d";
import { SortConfig, SortDirection } from "../Hooks/useSort";

export const getInitialSortConfig = <T extends {}>(
  columns: TableColumn<T>[],
  initialSortByKey?: keyof T,
  initialSortDirection: SortDirection = SortDirection.ASCENDING
): SortConfig<T> => {
  const isInitialSortBySortable =
    initialSortByKey &&
    columns.some(
      (column) => column.key === initialSortByKey && column.sortable
    );
  const initialSortKey = isInitialSortBySortable
    ? initialSortByKey
    : columns.find((column) => column.sortable)?.key;
  return { sortBy: initialSortKey as keyof T, direction: initialSortDirection };
};
