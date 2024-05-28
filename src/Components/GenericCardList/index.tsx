import { GenericCardListProps } from "./index.d";
import { renderContent } from "../../Utils/renderContent";
import { useMemo, useState } from "react";
import AccordionCard from "../AccordionCard";
import ActionBar from "../ActionBar";
import DropdownMenu from "../DropdownMenu";
import { ActionButtonProps } from "../ActionBar/index.d";
import { getInitialSortConfig } from "../../Utils/getInitialSortConfig";
import useSort from "../../Hooks/useSort";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SortDialog from "./Modals/SortDialog";
import FilterDialog from "./Modals/FilterDialog";

const GenericCardList = <T extends {}>({
  data,
  columns,
  titleKey,
  actions,
  cardDropdownOptions,
  initialSortBy,
  isLoading = false,
}: GenericCardListProps<T>) => {
  const [openCardIndex, setOpenCardIndex] = useState<number | null>(null);
  const [isAllCardOpen, setIsAllCardOpen] = useState<boolean>(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(
    null
  );
  const [isSortDialogOpen, setIsSortDialogOpen] = useState<boolean>(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<T[]>(data);

  const toggleCard = (index: number) => {
    setOpenCardIndex((prevIndex) => (prevIndex === index ? null : index));
    setIsAllCardOpen(false);
  };

  const toggleAllCardButtonText = isAllCardOpen ? "Tekli Aç" : "Tümünü Aç";
  const toggleAllCardButtonFunc = () => {
    setIsAllCardOpen(!isAllCardOpen);
    setOpenCardIndex(null);
  };

  // Check sortable columns we need at least one to show sort button in action bar
  const isSortableColumnPresent = useMemo(
    () => columns.some((column) => column.sortable),
    [columns]
  );
  // List of sortable columns
  const sortableColumns = useMemo(
    () => columns.filter((column) => column.sortable),
    [columns]
  );
  // ActionBar buttons
  const actionBarButtons: ActionButtonProps[] = [
    {
      text: toggleAllCardButtonText,
      onClick: toggleAllCardButtonFunc,
    },
    ...(isSortableColumnPresent
      ? [{ text: "Sırala", onClick: () => setIsSortDialogOpen(true) }]
      : []),
    { text: "Filtrele", onClick: () => setIsFilterDialogOpen(true) },
    ...(actions ? actions() : []),
  ];

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

  // Calculating header column and render function using useMemo
  const renderTitle = useMemo(() => {
    const column = columns.find((c) => c.key === titleKey);
    if (column && column.render) {
      return (item: T) => column.render!(item);
    } else {
      return (item: T) => renderContent(item[titleKey as keyof T]);
    }
  }, [columns, titleKey]);

  const listVariants = {
    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
    hidden: {},
  };

  const cardVariants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -100 },
  };

  return (
    <div id="GenericCardList" className="flex flex-col gap-2">
      {isLoading ? (
        <>
          <Skeleton
            height={35}
            width={100}
            count={3}
            borderRadius={8}
            containerClassName="flex flex-row gap-2"
            baseColor={`var(--skeleton-base-color)`}
            highlightColor={`var(--skeleton-highlight-color)`}
            duration={1.6}
          />
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
            height={60}
            count={3}
            borderRadius={10}
            className="p-0 mt-2"
            baseColor={`var(--skeleton-base-color)`}
            highlightColor={`var(--skeleton-highlight-color)`}
            duration={1.4}
          />
        </>
      ) : data.length > 0 ? (
        <div className="flex flex-col gap-2">
          <ActionBar buttons={actionBarButtons} />
          {data && (
            <div className="font-light">
              {data.length} veriden <strong>{filteredData.length}</strong> veri
              listeleniyor
            </div>
          )}
          <motion.div
            className="flex flex-col gap-4"
            initial="hidden"
            animate="visible"
            variants={listVariants}
          >
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <motion.div key={index} variants={cardVariants}>
                  <AccordionCard
                    key={index}
                    title={renderTitle(item)}
                    isOpen={isAllCardOpen || index === openCardIndex}
                    onClick={() => toggleCard(index)}
                  >
                    {columns.map(
                      (column, colIndex) =>
                        column.key !== titleKey && (
                          <span key={colIndex} className="block">
                            <span className="">{column.header}:</span>&nbsp;
                            {column.render ? (
                              <span className="font-bold">
                                {column.render(item)}
                              </span>
                            ) : (
                              <strong>
                                {renderContent(item[column.key as keyof T])}
                              </strong>
                            )}
                          </span>
                        )
                    )}
                    {cardDropdownOptions &&
                      cardDropdownOptions(item).length > 0 && (
                        <div className="relative inline-block mt-2 ">
                          <button
                            className={` px-4 py-2 rounded-lg cursor-default text-sm whitespace-nowrap transition ease-in-out duration-300 bg-primary hover:bg-primary-lighter dark:hover:bg-primary-darker text-text-darkest dark:text-text-lightest`}
                            onClick={(event) => {
                              event.stopPropagation();
                              setActiveDropdownIndex(
                                activeDropdownIndex === index ? null : index
                              );
                            }}
                          >
                            İşlemler
                          </button>

                          {activeDropdownIndex === index && (
                            <DropdownMenu
                              id={`card-dropdown-${index}`}
                              options={cardDropdownOptions(item)}
                              closeDropdown={() => setActiveDropdownIndex(null)}
                            />
                          )}
                        </div>
                      )}
                  </AccordionCard>
                </motion.div>
              ))
            ) : (
              <span className="text-xl opacity-50 text-center cursor-default">
                Aradığınız kriterlere göre veri bulunamadı
              </span>
            )}
          </motion.div>
        </div>
      ) : (
        <div className="text-center py-5 flex flex-col gap-4">
          <span className="text-3xl opacity-20 cursor-default">
            Gösterilecek veri yok
          </span>
          <button
            onClick={() => window.location.reload()}
            className="text-lg opacity-40 hover:opacity-80 cursor-default"
          >
            Sayfayı Yenileyin
          </button>
        </div>
      )}
      <SortDialog
        sortableColumns={sortableColumns}
        isSortDialogOpen={isSortDialogOpen}
        sortConfig={sortConfig}
        setIsSortDialogOpen={setIsSortDialogOpen}
        requestSort={requestSort}
      />
      <FilterDialog
        isFilterDialogOpen={isFilterDialogOpen}
        setIsFilterDialogOpen={setIsFilterDialogOpen}
        columns={columns}
        data={sortedItems}
        onFilter={setFilteredData}
      />
    </div>
  );
};

export default GenericCardList;
