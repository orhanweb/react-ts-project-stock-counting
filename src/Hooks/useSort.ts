import { useState, useMemo } from 'react';

// Sıralama yönlerini tanımlayan enum
export enum SortDirection {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
}

// SortConfig için güncellenmiş interface
export interface SortConfig<T> {
  sortBy: keyof T; // Hangi özelliğe göre sıralanacağı
  direction: SortDirection; // Sıralama yönü
}

// Generic useSort hook'u
const useSort = <T extends {}>(items: T[], initialSortConfig: SortConfig<T>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(initialSortConfig);

  // Sıralama isteği fonksiyonu
  const requestSort = (sortBy: keyof T) => {
    let direction = SortDirection.ASCENDING;
    if (
      sortConfig &&
      sortConfig.sortBy === sortBy &&
      sortConfig.direction === SortDirection.ASCENDING
    ) {
      direction = SortDirection.DESCENDING;
    }
    setSortConfig({ sortBy, direction });
  };

  // Sıralama işlemi
  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.sortBy] < b[sortConfig.sortBy]) {
          return sortConfig.direction === SortDirection.ASCENDING ? -1 : 1;
        }
        if (a[sortConfig.sortBy] > b[sortConfig.sortBy]) {
          return sortConfig.direction === SortDirection.ASCENDING ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  return { sortedItems, sortConfig, requestSort };
};

export default useSort;
