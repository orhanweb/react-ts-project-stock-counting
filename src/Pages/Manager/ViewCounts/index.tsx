// src/Pages/ViewCounts.tsx
import React, { useEffect, useState } from 'react';
import { CountFormData } from '../../../Redux/Models/apiTypes';
import { useNotifications } from '../../../Hooks/useNotifications';
import { NotificationType } from '../../../Components/Notification/index.d';
import GenericTable from '../../../Components/GenericTable';
import { TableColumn } from '../../../Components/GenericTable/index.d';
import GenericCardList from '../../../Components/GenericCardList';
import Loader from '../../../Components/Loader';

const ViewCounts: React.FC = () => {
  const { addNotification } = useNotifications(); 
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 640);
  const [counts, setCounts] = useState<CountFormData[]>([]); // Yeni state: counts
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    setIsLoading(true)
    const timer = setTimeout(() => {
      setCounts(staticCounts); // 3 saniye sonra verileri state'e yerleştir
      setIsLoading(false); // Yükleme tamamlandı, isLoading'i güncelle
    }, 10000);

    return () => {clearTimeout(timer); window.removeEventListener('resize', handleResize);}
  
  }, []);
  
  const createDropdownOptions = (item : CountFormData) =>[
    { label: 'Sayıma Git', onClick: () => addNotification(`Üzerinde çalışılıyor: ${item.countName}`, NotificationType.Warning)},
    { label: 'Düzenle', onClick: () => addNotification(`Düzenleme işlemi henüz eklenmedi: ${item.countName}`, NotificationType.Warning)},
    { label: 'Sil', onClick: () => addNotification(`Silme işlemi henüz eklenmedi: ${item.countName}`, NotificationType.Warning), dangerEffect: true},
  ];
  return (
    <div className="view-count-page w-full mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4 md:text-3xl lg:text-4xl mt-8 cursor-default">Sayım Listesi</h1>
      {isMobileView
        ? <GenericCardList 
            initialSortBy='endDate' 
            data={counts} 
            isLoading={isLoading} 
            columns={viewCountsColumns} 
            titleKey='countName' 
            cardDropdownOptions={createDropdownOptions}/> 
        : <>
            <Loader isLoading={isLoading} message="Veriler yükleniyor..." />
            <GenericTable 
              initialSortBy='endDate'
              data={counts}
              isLoading={isLoading} 
              columns={viewCountsColumns}
              dropdownOptions={createDropdownOptions}
            />
          </> 
      }
    </div>
  );
};

export default ViewCounts;

const viewCountsColumns : TableColumn<CountFormData> [] = [
  { header:"Sayım Adı", key: 'countName', sortable: true,},
  { header:"Başlangıç Tarihi", key: 'startDate', sortable: true, render: (item) => item.startDate.toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })},
  { header:"Bitiş Tarihi", key: 'endDate', sortable: true, render: (item) => item.endDate.toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })},
  { header:"Sayım Tipi", key: 'countType', sortable: true},
  { header:"Yapı ID", key: 'selectedStructureId', sortable: true},
]

const staticCounts: CountFormData[] = [
  {
    countName: 'Market Sayımı 1',
    startDate: new Date(2024, 0, 5),
    endDate: new Date(2024, 3, 6),
    countType: 'Market',
    selectedStructureId: 1
  },
  {
    countName: 'Depo Sayımı 1',
    startDate: new Date(2024, 0, 7),
    endDate: new Date(2024, 0, 8),
    countType: 'Depo',
    selectedStructureId: 2
  },
  {
    countName: 'Araç Sayımı 1',
    startDate: new Date(2024, 0, 10),
    endDate: new Date(2024, 0, 11),
    countType: 'Araç',
    selectedStructureId: 3
  },
];