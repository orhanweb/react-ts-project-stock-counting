// src/Pages/ViewCounts.tsx
import React, { useEffect, useState } from 'react';
import { CountList } from '../../Redux/Models/apiTypes';
import { useNotifications } from '../../Hooks/useNotifications';
import { NotificationType } from '../../Components/Notification/index.d';
import GenericTable from '../../Components/GenericTable';
import { TableColumn } from '../../Components/GenericTable/index.d';
import GenericCardList from '../../Components/GenericCardList';
import Loader from '../../Components/Loader';
import { useNavigate } from 'react-router-dom';
import { useGetCountListQuery } from '../../Redux/Services/countFormAPI';

const ViewCounts: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications(); 
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 940);
  // const [counts, setCounts] = useState<CountList[]>([]);
  const { data: counts, isLoading, error: countListError } = useGetCountListQuery();

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 940);
    window.addEventListener('resize', handleResize);
    return () => {window.removeEventListener('resize', handleResize);}
  }, []);

  // Managing Errors
  useEffect(() => {
    if (countListError) addNotification(`Sayım listesi yüklenirken bir hata oluştu: ${countListError}`, NotificationType.Error);
  }, [countListError]);

  // Kullanıcıyı sayım sayfasına yönlendirdiğinde eğer sayımın süresi dolmuş veya kapalı ise kullanıcıyı not found sayfasına yönlendir   navigate('/not-found', { state: { message: 'Sayım kapalı.' } })
  const createDropdownOptions = (item : CountList) =>[
    { label: 'Sayıma Git', onClick: () => navigate(`/count/${item.sayim_id}/addProduct`)},
    // { label: 'Düzenle', onClick: () => addNotification(`Düzenleme işlemi henüz eklenmedi: ${item.sayim_adi}`, NotificationType.Warning)},
    // { label: 'Sil', onClick: () => addNotification(`Silme işlemi henüz eklenmedi: ${item.sayim_adi}`, NotificationType.Warning), dangerEffect: true},
  ];

  return (
    <div className="view-count-page w-full mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4 md:text-3xl lg:text-4xl mt-8 cursor-default">Sayım Listesi</h1>
      {isMobileView
        ? <GenericCardList 
            initialSortBy='bitis' 
            data={counts || []} 
            isLoading={isLoading} 
            columns={viewCountsColumns} 
            titleKey='sayim_adi' 
            cardDropdownOptions={createDropdownOptions}/> 
        : <>
            <Loader isLoading={isLoading} message="Veriler yükleniyor..." />
            <GenericTable 
              initialSortBy='bitis'
              data={counts || []} 
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

const viewCountsColumns : TableColumn<CountList> [] = [
  { header:"Sayım Adı", key: 'sayim_adi', sortable: true},
  { header:"Başlangıç Tarihi", key: 'baslangic', sortable: true},
  { header:"Bitiş Tarihi", key: 'bitis', sortable: true},
  { header:"Sayım Türü", key: 'tur', sortable: true},
  { header:"Sayım Tipi", key: 'tip', sortable: true},
  { header:"Sayım Alanı", key: 'alan', sortable: true},
  { header:"Yapı Adı", key: 'depo_name', sortable: true},
  { header:"Sayım Durumu", key: 'durum', sortable: true, render:(item)=> item.durum === '1'? <span>Devam Ediyor</span> : <span>Sayım Bitti</span>},
]
