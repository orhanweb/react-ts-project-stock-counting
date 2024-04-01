import { useState, useMemo } from "react";

// Enum defining sorting aspects
export enum SortDirection {
  ASCENDING = "ascending",
  DESCENDING = "descending",
}

// Updated interface for SortConfig
export interface SortConfig<T> {
  sortBy: keyof T; // According to which feature will it be sorted?
  direction: SortDirection; // Sort direction
}

// Generic useSort hook
const useSort = <T extends {}>(
  items: T[],
  initialSortConfig: SortConfig<T>
) => {
  const [sortConfig, setSortConfig] =
    useState<SortConfig<T>>(initialSortConfig);

  // Sorting request function
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

  // Sorting process
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
