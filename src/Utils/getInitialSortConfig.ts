// src/Utils/getInitialSortConfig.ts
import { TableColumn } from '../Components/GenericTable/index.d';
import { SortConfig, SortDirection } from '../Hooks/useSort';

export const getInitialSortConfig = <T extends {}>(columns: TableColumn<T>[], initialSortBy?: keyof T): SortConfig<T> => {
  const isInitialSortBySortable = initialSortBy && columns.some(column => column.key === initialSortBy && column.sortable);
  const initialSortKey = isInitialSortBySortable ? initialSortBy : columns.find(column => column.sortable)?.key;
  return { sortBy: initialSortKey as keyof T, direction: SortDirection.ASCENDING };
};
