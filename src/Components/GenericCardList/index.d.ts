import { TableColumn } from "../GenericTable";

// src/Components/GenericCardListProps/index.d.ts
export interface GenericCardListProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  titleKey: keyof T;
  initialSortBy?: { key: keyof T; direction: SortDirection };
  actions?: () => ActionButtonProps[];
  cardDropdownOptions?: (item: T) => DropdownOption[];
  isLoading?: boolean;
}
