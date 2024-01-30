import { GenericCardListProps } from './index.d';
import { renderContent } from '../../Utils/renderContent';
import { useEffect, useMemo, useState } from 'react';
import AccordionCard from '../AccordionCard';
import ActionBar from '../ActionBar';
import DropdownMenu from '../DropdownMenu';
import { ActionButtonProps } from '../ActionBar/index.d';
import Dialog from '../../CustomDialog';
import { getInitialSortConfig } from '../../Utils/getInitialSortConfig';
import useSort, { SortConfig, SortDirection } from '../../Hooks/useSort';
import { FaCircleArrowDown,FaCircleArrowUp } from "react-icons/fa6";
import { motion } from 'framer-motion';

const GenericCardList = <T extends {}>({ data, columns, titleKey, actions, cardDropdownOptions, initialSortBy }: GenericCardListProps<T>) => {
    const [openCardIndex, setOpenCardIndex] = useState<number | null>(null);
    const [isAllCardOpen, setIsAllCardOpen] = useState<boolean>(false);
    const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null);
    const [isSortDialogOpen, setIsSortDialogOpen] = useState<boolean>(false);
    const [tempSortConfig, setTempSortConfig] = useState<SortConfig<T> | null>(null);

    const toggleCard = (index: number) => {
        setOpenCardIndex(prevIndex => prevIndex === index ? null : index);
        setIsAllCardOpen(false)
    };
    
    const toggleAllCardButtonText = isAllCardOpen? 'Tekli Aç' :'Tümünü Aç';
    const toggleAllCardButtonFunc = () => {
        setIsAllCardOpen(!isAllCardOpen)
        setOpenCardIndex(null);
    } 

    // Check sortable columns we need at least one to show sort button in action bar
    const isSortableColumnPresent = useMemo(() => columns.some(column => column.sortable), [columns]);
    // Sıralanabilir sütunların listesi
    const sortableColumns = useMemo(() => columns.filter(column => column.sortable), [columns]);

    // Sıralanacak sütun için seçme mantığı
    const handleSortSelection = (columnKey: keyof T) => {
        setTempSortConfig(prevConfig => {
            if (sortConfig.sortBy === columnKey && !prevConfig){// Eğer zaten sıralanan sütun seçilirse  
                return {sortBy: columnKey,direction: sortConfig.direction === SortDirection.ASCENDING ? SortDirection.DESCENDING : SortDirection.ASCENDING,};
            }
            else{// Eğer aynı sütun seçilirse, yönü değiştir 
                return prevConfig && prevConfig.sortBy === columnKey
                ?   { sortBy: columnKey,direction: prevConfig.direction === SortDirection.ASCENDING ? SortDirection.DESCENDING : SortDirection.ASCENDING,}
                :   { sortBy: columnKey, direction: SortDirection.ASCENDING }               
            } 
        });
    };

    // Dialog açılıp kapandığında geçici sıralama state'ini null'a çek
    useEffect((()=>setTempSortConfig(null)),[isSortDialogOpen])

    // Sıralanan sütun için buton renklendirmesi
    const getButtonStyle = (columnKey: keyof T) => {
        const activeConfig = tempSortConfig || sortConfig;
        const isActive = activeConfig && activeConfig.sortBy === columnKey;
        return isActive ? 'border-primary text-primary' : 'border-background';
    };
    
    // Sıralanan sütun için artan azalan ikonları döndüren fonksiyon
    const getSortIcon = (columnKey: keyof T) => {
        const activeConfig = tempSortConfig || sortConfig;
        if (activeConfig && activeConfig.sortBy === columnKey) {
            return activeConfig.direction === SortDirection.ASCENDING ? <FaCircleArrowDown /> : <FaCircleArrowUp />;
        }
        return null;
    };
    
    // Sütunlarda key alıp header döndüren fonksiyon
    const getColumnHeaderByKey = (key: keyof T) => {
        const column = columns.find(c => c.key === key);
        return column ? column.header : '';
    };
    
    // Sıralamada açıklama metni veren fonksiyon
    const getSortingStatusText = () => {
        if (!sortConfig && !tempSortConfig) return null;
      
        return tempSortConfig
          ? tempSortConfig.sortBy === sortConfig?.sortBy
            ? tempSortConfig.direction !== sortConfig?.direction 
              ? "Sıralanan sütun aynı, sadece yönü değişecektir." 
              : "Sıralama değişmeyecektir."
            : `Sıralama, ${getColumnHeaderByKey(tempSortConfig.sortBy)} sütununa göre yapılacaktır.`
          : `Şuanda sıralama ${getColumnHeaderByKey(sortConfig.sortBy)} sütununa göre yapılmaktadır.`;
      };
      
      
    // ActionBar butons
    const actionBarButtons : ActionButtonProps[] = [
        {
            text: toggleAllCardButtonText,
            onClick: toggleAllCardButtonFunc,
        },
        ...(isSortableColumnPresent ? [{ text: "Sırala",onClick: ()=> setIsSortDialogOpen(true) }] : []),
        ...(actions ?? [])
    ];

    // useSort hook'unu başlangıç sıralama yapılandırması
    const initialSortConfig = useMemo(() => getInitialSortConfig(columns,initialSortBy), [initialSortBy, columns]);
    const { sortedItems, sortConfig, requestSort } = useSort<T>(data, initialSortConfig);

    // useMemo kullanarak başlık sütunu ve render fonksiyonunu hesaplama
    const renderTitle = useMemo(() => {
        const column = columns.find(c => c.key === titleKey);
        if (column && column.render) {
            return (item: T) => column.render!(item);
        } else {
            return (item: T) => renderContent(item[titleKey as keyof T]);
        }
    }, [columns, titleKey]);

    const listVariants = {
        visible: {transition: {staggerChildren: 0.05, delayChildren: 0.2}},
        hidden: { }
    };

    const cardVariants = {
        visible: { opacity: 1, x: 0 },
        hidden: { opacity: 0, x: -100 }
    };

    return (
        <div id='GenericCardList' className='flex flex-col gap-2'>
            <ActionBar buttons={actionBarButtons}/>
            {data && <div className='font-light'>{data.length} veri listeleniyor</div>}
            <motion.div
                className='flex flex-col gap-4'
                initial="hidden"
                animate="visible"
                variants={listVariants}
            >
                {sortedItems.map((item, index) => (  
                    <motion.div
                    key={index}
                    variants={cardVariants}
                    >
                        <AccordionCard  key={index}
                            title={renderTitle(item)}
                            isOpen={isAllCardOpen || index === openCardIndex}
                            onClick={() => toggleCard(index)}
                        >
                            {columns.map((column, colIndex) => (
                                column.key !== titleKey && (
                                    <span key={colIndex} className="block">
                                        <strong className="font-bold">{column.header}:</strong>&nbsp;
                                        {column.render ? column.render(item) : renderContent(item[column.key as keyof T])}
                                    </span>
                                )
                            ))}
                            {cardDropdownOptions && cardDropdownOptions(item).length > 0 && (
                                <div className="relative inline-block mt-2 ">

                                    <button
                                        className={ ` px-4 py-2 rounded-lg cursor-default text-sm whitespace-nowrap transition ease-in-out duration-300 bg-primary hover:bg-primary-lighter dark:hover:bg-primary-darker text-text-darkest dark:text-text-lightest`}
                                        onClick={() => setActiveDropdownIndex(activeDropdownIndex === index ? null : index)}
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
            ))}
            </motion.div>
          
            <Dialog title='Sırala' confirmButtonLabel='Sırala' isOpen={isSortDialogOpen} onClose={()=> setIsSortDialogOpen(false)} onConfirm={()=> tempSortConfig && (tempSortConfig.sortBy !== sortConfig.sortBy || tempSortConfig.direction !== sortConfig.direction) && requestSort(tempSortConfig.sortBy)}>
               <div>
                    <div className='text-sm font-light mb-2'>Sıralamak istediğiniz sütunu seçin.</div>
                    <div className='flex flex-col gap-2'>
                        {sortableColumns.map((column, index) => (
                            <button key={index} onClick={() => handleSortSelection(column.key)}  className={ `px-4 py-3 text-left w-full text-sm font-medium border ${getButtonStyle(column.key)} border-background rounded-lg`}>
                                <div className='flex justify-between items-center'>
                                    {column.header}
                                    {getSortIcon(column.key)}
                                </div>
                            </button> 
                        ))}
                    </div>
                    {getSortingStatusText() && <div className="text-sm font-light mt-2">{getSortingStatusText()}</div>}
               </div>
            </Dialog>
        </div>
    );
}

export default GenericCardList;
