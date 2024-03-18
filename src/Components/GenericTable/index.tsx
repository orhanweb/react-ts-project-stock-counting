// src/Components/GenericTable/index.tsx
import React, {useMemo, useState } from 'react';
import { IoIosMore, } from "react-icons/io";
import { IoClose } from 'react-icons/io5';
import DropdownMenu from '../DropdownMenu';
import { FaCircleArrowDown,FaCircleArrowUp } from "react-icons/fa6";
import useSort from '../../Hooks/useSort';
import {TableProps} from  './index.d'
import { renderContent } from '../../Utils/renderContent';
import { getInitialSortConfig } from '../../Utils/getInitialSortConfig';
import Skeleton from 'react-loading-skeleton';


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
  const { data, columns, initialSortBy, dropdownOptions, isLoading= false } = props;
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  // useSort hook'unu başlangıç sıralama yapılandırması
  const initialSortConfig = useMemo(() => getInitialSortConfig(columns,initialSortBy), [initialSortBy, columns]);
  const { sortedItems, sortConfig, requestSort } = useSort<T>(data, initialSortConfig);
  
  return (
    <div>
      {isLoading?  (
        <>
          <Skeleton height={20} width={300} borderRadius={5}  className='p-0 mt-2' baseColor={`var(--skeleton-base-color)`}  highlightColor={`var(--skeleton-highlight-color)`} duration={1.2}/> 
          <Skeleton height={40} count={5} className='p-0 mt-2' borderRadius={10} baseColor={`var(--skeleton-base-color)`}  highlightColor={`var(--skeleton-highlight-color)`} duration={1.4}/>
        </>
      ) :  (
        data.length > 0 ? (
          <div>
            <div className='font-light mb-2'>{data.length} veri listeleniyor</div>
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
                        {column.render ? column.render(item) : renderContent(item[column.key as keyof T])}
                      </TableCell>
                    ))}
                    {dropdownOptions && dropdownOptions.length > 0 && (
                      <TableCell>
                        <div className="relative inline-block">
                          <button 
                            className="hover:text-primary"
                            onClick={(event) => {
                              event.stopPropagation()
                              setActiveDropdown(activeDropdown === rowIndex ? null : rowIndex)
                            }}>
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
          </div>
        ) : (
            <div className="text-center py-5 flex flex-col gap-4">
              <span className='text-3xl opacity-20 cursor-default'>Gösterilecek veri yok</span>
              <span onClick={() => window.location.reload()} className='text-lg opacity-40 cursor-pointer hover:opacity-80 '>Sayfayı Yenileyin</span>
            </div>
        )
      )}
  </div>
  );
};

export default GenericTable;