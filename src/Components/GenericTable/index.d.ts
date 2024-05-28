import { SortDirection } from "../../Hooks/useSort";
export interface TableColumn<T> {
  key: keyof T;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  initialSortBy?: { key: keyof T; direction: SortDirection };
  dropdownOptions?: (item: T) => DropdownOption[];
  isLoading?: boolean;
  getTableActions?: () => DropdownOption[];
}
