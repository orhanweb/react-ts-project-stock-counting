// src/Components/GenericTable/index.tsx
import React, { useCallback, useMemo, useState } from "react";
import { IoIosCloseCircle, IoIosMore } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import DropdownMenu from "../DropdownMenu";
import { FaCircleArrowDown, FaCircleArrowUp } from "react-icons/fa6";
import useSort from "../../Hooks/useSort";
import { TableProps } from "./index.d";
import { renderContent } from "../../Utils/renderContent";
import { getInitialSortConfig } from "../../Utils/getInitialSortConfig";
import Skeleton from "react-loading-skeleton";
import AsyncIconButton from "../Buttons/AsyncIconButton";
import { IoMdMore } from "react-icons/io";
import CustomTextInput from "../CustomTextInput";
import { debounce } from "lodash";

const TableHeaderCell: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  isSorted?: boolean;
  isAscending?: boolean;
}> = ({ children, onClick, isSorted = false, isAscending = false }) => (
  <th
    onClick={onClick}
    className={` ${
      onClick ? "cursor-pointer" : "cursor-default"
    } relative px-2 py-3 text-xs text-center font-semibold uppercase tracking-wider border-r last:border-r-0 border-text-lighter dark:border-text-dark `}
  >
    {children}
    {isSorted && (
      <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
        {isAscending ? <FaCircleArrowDown /> : <FaCircleArrowUp />}
      </span>
    )}
  </th>
);

const TableCell: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <td className="px-2 py-3 text-sm text-center cursor-default border-r last:border-r-0 border-text-lighter dark:border-text-dark">
    {children}
  </td>
);

const GenericTable = <T extends {}>(props: TableProps<T>) => {
  const {
    data,
    columns,
    initialSortBy,
    dropdownOptions,
    isLoading = false,
    getTableActions,
  } = props;
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [searchTerms, setSearchTerms] = useState<Record<keyof T, string>>(
    {} as Record<keyof T, string>
  );
  const [liveSearchTerms, setLiveSearchTerms] = useState<
    Record<keyof T, string>
  >({} as Record<keyof T, string>);

  const [isActiveTableDropdown, setIsActiveTableDropdown] =
    useState<boolean>(false);

  // Initial sorting configuration of the useSort hook
  const initialSortConfig = useMemo(
    () =>
      getInitialSortConfig(
        columns,
        initialSortBy?.key,
        initialSortBy?.direction
      ),
    [initialSortBy, columns]
  );
  const { sortedItems, sortConfig, requestSort } = useSort<T>(
    data,
    initialSortConfig
  );
  // Determine if there are any dropdown options for any items
  const showDropdownColumn = useMemo(
    () =>
      data.some((item) => dropdownOptions && dropdownOptions(item).length > 0),
    [data, dropdownOptions]
  );

  const handleSearchChange = useCallback(
    debounce((key: keyof T, value: string) => {
      setSearchTerms((prev) => ({ ...prev, [key]: value }));
    }, 300),
    []
  );

  // Instant update function for input fields
  const handleInputChange = (key: keyof T, value: string) => {
    setLiveSearchTerms((prev) => ({ ...prev, [key]: value }));
    handleSearchChange(key, value);
  };

  // Calculate filtered data
  const filteredData = useMemo(() => {
    return sortedItems.filter((item) => {
      return Object.keys(searchTerms).every((key) => {
        const searchTerm = searchTerms[key as keyof T].toLowerCase();
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
  }, [sortedItems, searchTerms, columns]);

  return (
    <div>
      {isLoading ? (
        <>
          <Skeleton
            height={20}
            width={300}
            borderRadius={5}
            className="p-0 mt-2"
            baseColor={`var(--skeleton-base-color)`}
            highlightColor={`var(--skeleton-highlight-color)`}
            duration={1.2}
          />
          <Skeleton
            height={40}
            count={5}
            className="p-0 mt-2"
            borderRadius={10}
            baseColor={`var(--skeleton-base-color)`}
            highlightColor={`var(--skeleton-highlight-color)`}
            duration={1.4}
          />
        </>
      ) : data.length > 0 ? (
        <div>
          <div className="flex flex-row justify-between w-full mb-2">
            <div className="font-light">
              {data.length} veriden <strong>{filteredData.length}</strong> veri
              listeleniyor
            </div>

            {getTableActions && (
              <div className="relative">
                <AsyncIconButton
                  title="İşlemler"
                  Icon={IoMdMore}
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsActiveTableDropdown(!isActiveTableDropdown);
                  }}
                  className="pl-1"
                />
                {isActiveTableDropdown && (
                  <DropdownMenu
                    id={"table-actions"}
                    options={getTableActions()}
                    closeDropdown={() => setIsActiveTableDropdown(false)}
                  />
                )}
              </div>
            )}
          </div>
          <table className="w-full border border-text-lighter dark:border-text-dark leading-normal transition-colors duration-300 ease-in-out">
            <thead>
              <tr className="bg-primary-lighter dark:bg-primary-darkest text-text-darkest dark:text-text-lightest transition-colors duration-300 ease-in-out ">
                {columns.map((column, columnIndex) => (
                  <TableHeaderCell
                    key={columnIndex}
                    onClick={
                      column.sortable
                        ? () => requestSort(column.key)
                        : undefined
                    }
                    isSorted={sortConfig?.sortBy === column.key}
                    isAscending={sortConfig?.direction === "ascending"}
                  >
                    {column.header}
                  </TableHeaderCell>
                ))}
                {showDropdownColumn && (
                  <TableHeaderCell>
                    <IoIosMore size={22} />
                  </TableHeaderCell>
                )}
              </tr>
              <tr className="border-b border-text-lighter dark:border-text-dark">
                {columns.map((column, columnIndex) => (
                  <TableCell key={`search-${columnIndex}`}>
                    <CustomTextInput
                      id={`search-${columnIndex}`}
                      placeholder={`Ara...`}
                      isOpenClearTextButton={false}
                      value={liveSearchTerms[column.key as keyof T] || ""}
                      onChange={(e) =>
                        handleInputChange(column.key, e.target.value)
                      }
                    />
                  </TableCell>
                ))}
                {showDropdownColumn && (
                  <TableCell>
                    <button
                      className="hover:text-primary"
                      onClick={() => {
                        setSearchTerms({} as Record<keyof T, string>);
                        setLiveSearchTerms({} as Record<keyof T, string>);
                      }}
                    >
                      <IoIosCloseCircle size={22} />
                    </button>
                  </TableCell>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`${
                      rowIndex % 2 === 0
                        ? "bg-transparent"
                        : "bg-text-lighter bg-opacity-30"
                    } text-text-darkest dark:text-text-lightest transition-colors duration-300 ease-in-out`}
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell key={`${rowIndex}-${colIndex}`}>
                        {column.render
                          ? column.render(item)
                          : renderContent(item[column.key as keyof T])}
                      </TableCell>
                    ))}
                    {showDropdownColumn && (
                      <TableCell>
                        <div className="relative inline-block">
                          <button
                            className="hover:text-primary"
                            onClick={(event) => {
                              event.stopPropagation();
                              setActiveDropdown(
                                activeDropdown === rowIndex ? null : rowIndex
                              );
                            }}
                          >
                            {activeDropdown === rowIndex ? (
                              <IoClose size={22} className="text-error" />
                            ) : (
                              <IoIosMore size={22} />
                            )}
                          </button>
                          {activeDropdown === rowIndex && (
                            <DropdownMenu
                              options={dropdownOptions!(item)}
                              closeDropdown={() => setActiveDropdown(null)}
                              id={rowIndex}
                            />
                          )}
                        </div>
                      </TableCell>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + (showDropdownColumn ? 1 : 0)}>
                    <div className="text-center py-5">
                      <span className="text-xl opacity-50 cursor-default">
                        Aradığınız kriterlere göre veri bulunamadı
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-5 flex flex-col gap-4">
          <span className="text-3xl opacity-20 cursor-default">
            Gösterilecek veri yok
          </span>
          <span
            onClick={() => window.location.reload()}
            className="text-lg opacity-40 cursor-pointer hover:opacity-80 "
          >
            Sayfayı Yenileyin
          </span>
        </div>
      )}
    </div>
  );
};

export default GenericTable;
