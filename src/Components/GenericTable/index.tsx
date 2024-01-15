// src/Components/GenericTable/index.tsx
import React, {useMemo, useState } from 'react';
import { IoIosMore, } from "react-icons/io";
import { IoClose } from 'react-icons/io5';
import DropdownMenu from '../DropdownMenu';
import { FaCircleArrowDown,FaCircleArrowUp } from "react-icons/fa6";
import useSort, { SortConfig, SortDirection } from '../../Hooks/useSort';
import {TableProps} from  './index.d'


const TableHeaderCell: React.FC<{ children: React.ReactNode, onClick?: () => void, isSorted?: boolean, isAscending?: boolean }> = ({ children, onClick, isSorted = false, isAscending = false }) => (
  <th onClick={onClick} className={` ${onClick ? 'cursor-pointer' : 'cursor-default'} relative px-5 py-3 text-xs text-center font-semibold uppercase tracking-wider border-r last:border-r-0 border-text-lighter dark:border-text-dark `}>
      {children}
      {isSorted && (
        <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
          {isAscending ? <FaCircleArrowDown /> : <FaCircleArrowUp />}
        </span>
      )}
  </th>
);

const TableCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td className="px-5 py-3 text-sm text-center cursor-default border-r last:border-r-0 border-text-lighter dark:border-text-dark">
    {children}
  </td>
);

const GenericTable = <T extends {}>(props: TableProps<T>) => {
  const { data, columns, initialSortBy, dropdownOptions } = props;
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  // Başlangıç sıralama yapılandırmasını hesaplayan helper fonksiyonu
  const getInitialSortConfig = (): SortConfig<T> => {
    const isInitialSortBySortable = columns.some(column => column.key === initialSortBy && column.sortable);
    if (initialSortBy && !isInitialSortBySortable) {
      console.warn(`The column specified in 'initialSortBy' ('${String(initialSortBy)}') is not set to be sortable. Sorting will be applied based on the first sortable column found.`);
    }
    const initialSortKey = isInitialSortBySortable ? initialSortBy : columns.find(column => column.sortable)?.key;
    return { sortBy: initialSortKey as keyof T, direction: SortDirection.ASCENDING };
  };

  // useSort hook'unu başlangıç sıralama yapılandırması
  const initialSortConfig = useMemo(() => getInitialSortConfig(), [initialSortBy, columns]);
  const { sortedItems, sortConfig, requestSort } = useSort<T>(data, initialSortConfig);

  const renderCellContent = (content: any) => 
    content === null || content === undefined ? null :
    React.isValidElement(content) ? content : 
    String(content);
  
  return (
    <table className="w-full border border-text-lighter dark:border-text-dark leading-normal transition-colors duration-300 ease-in-out">
      <thead>
        <tr className="bg-primary-lighter dark:bg-primary-darkest text-text-darkest dark:text-text-lightest transition-colors duration-300 ease-in-out ">
          {columns.map((column, columnIndex) => (
            <TableHeaderCell
              key={columnIndex}
              onClick={column.sortable ? () => requestSort(column.key) : undefined}
              isSorted={sortConfig?.sortBy === column.key}
              isAscending={sortConfig?.direction === 'ascending'}
            >
              {column.header}
            </TableHeaderCell>
          ))}
          {dropdownOptions &&  <TableHeaderCell>İşlemler</TableHeaderCell>}
        </tr>
      </thead>
      <tbody>
        {sortedItems.map((item, rowIndex) => (
          <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? "bg-transparent" : "bg-text-lighter bg-opacity-30"} text-text-darkest dark:text-text-lightest transition-colors duration-300 ease-in-out`}>
            {columns.map((column, colIndex) => (
              <TableCell key={`${rowIndex}-${colIndex}`}>
                {column.render ? column.render(item) : renderCellContent(item[column.key as keyof T])}
              </TableCell>
            ))}
            {dropdownOptions && dropdownOptions.length > 0 && (
              <TableCell>
                <div className="relative">
                  <button 
                    className="hover:text-primary"
                    onClick={() => setActiveDropdown(activeDropdown === rowIndex ? null : rowIndex)}>
                    {activeDropdown === rowIndex ? <IoClose size={20} className="text-error"/> : <IoIosMore size={20}/>}
                  </button>
                  {activeDropdown === rowIndex && 
                    <DropdownMenu 
                      options={dropdownOptions(item)} 
                      closeDropdown={()=> setActiveDropdown(null)} 
                      id={rowIndex} 
                    />}                      
                </div>
              </TableCell>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GenericTable;