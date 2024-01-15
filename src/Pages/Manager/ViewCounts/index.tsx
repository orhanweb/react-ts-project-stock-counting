// src/Pages/ViewCounts.tsx
import React from 'react';
import { CountFormData } from '../../../Redux/Models/apiTypes';
import { useNotifications } from '../../../Hooks/useNotifications';
import { NotificationType } from '../../../Components/Notification/index.d';
import GenericTable from '../../../Components/GenericTable';
import { TableColumn } from '../../../Components/GenericTable/index.d';

const ViewCounts: React.FC = () => {
  const { addNotification } = useNotifications(); 

  const createDropdownOptions = (item : CountFormData) =>[
    { label: 'Sayıma Git', onClick: () => addNotification(`Üzerinde çalışılıyor: ${item.countName}`, NotificationType.Warning)},
    { label: 'Düzenle', onClick: () => addNotification(`Düzenleme işlemi henüz eklenmedi: ${item.countName}`, NotificationType.Warning)},
    { label: 'Sil', onClick: () => addNotification(`Silme işlemi henüz eklenmedi: ${item.countName}`, NotificationType.Warning), dangerEffect: true},
  ];
  return (
    <div className="view-count-page w-full lg:w-3/4 mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4 md:text-3xl lg:text-4xl mt-8 cursor-default">Sayım Listesi</h1>
      <GenericTable 
        initialSortBy='endDate'
        data={staticCounts}
        columns={viewCountsColumns}
        dropdownOptions={createDropdownOptions}
      />
    </div>
  );
};

export default ViewCounts;

const viewCountsColumns : TableColumn<CountFormData> [] = [
  { header:"Sayım Adı", key: 'countName', sortable: true,},
  { header:"Başlangıç Tarihi", key: 'startDate', sortable: true, render: (item) => (item.startDate.toLocaleDateString())},
  { header:"Bitiş Tarihi", key: 'endDate', sortable: true, render: (item) => (item.endDate.toLocaleDateString())},
  { header:"Sayım Tipi", key: 'countType', sortable: true},
  { header:"Yapı ID", key: 'selectedStructureId', sortable: true},
]

const staticCounts: CountFormData[] = [
  {
    countName: 'Market Sayımı 1',
    startDate: new Date(2024, 0, 5),
    endDate: new Date(2024, 0, 6),
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
  {
    countName: 'Market Sayımı 2',
    startDate: new Date(2024, 0, 12),
    endDate: new Date(2024, 0, 14),
    countType: 'Market',
    selectedStructureId: 2
  },
  {
    countName: 'Araç Sayımı 2',
    startDate: new Date(2024, 1, 7),
    endDate: new Date(2024, 2, 14),
    countType: 'Araç',
    selectedStructureId: 3
  },
];