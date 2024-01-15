// src/Components/GenericTable/index.d.ts
export interface TableColumn<T> {
    key: keyof T;
    header: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
}

export interface TableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    initialSortBy?: keyof T;
    dropdownOptions?: (item: T) => DropdownOption[];
}
  