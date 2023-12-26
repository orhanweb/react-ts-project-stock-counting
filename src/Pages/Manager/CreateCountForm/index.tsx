import React, { useState } from 'react';
import CustomTextInput from '../../../Components/CustomTextInput';
import "react-datepicker/dist/react-datepicker.css";
import CustomDateRangePicker from '../../../Components/CustomDateRangePicker';
import CountTypeSelector from '../../../Components/CountTypeSelector';
import { CountType } from '../../../Components/CountTypeSelector/index.d';
import AutoComplete from '../../../Components/AutoComplete';
import { useQueryWrapper } from '../../../Hooks/useQueryWrapper';
import { useGetMarketsQuery } from '../../../Redux/Services/countLocationAPI';
import { Market } from '../../../Redux/Models/apiTypes';
import { useNotifications } from '../../../Hooks/useNotifications';
import { NotificationType } from '../../../Contexts/notificationContext';

const CreateCountForm : React.FC = () => {
  const [countName, setCountName] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [countType, setCountType] = useState<CountType>(CountType.Market);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [isFormInvalid, setIsFormInvalid] = useState<boolean>(false);
  
  const { addNotification } = useNotifications(); // Hook'u kullanarak bildirim fonksiyonunu alın

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Eğer zorunlu statelerden herhangi biri boşsa, işlemi durdur
    if (!countName || !startDate || !endDate || !selectedMarket) {
      setIsFormInvalid(true);
      addNotification("Form da boş alan var.", NotificationType.Error); // Hata bildirimi göster
      return; 
    }
    setIsFormInvalid(false);

    console.log('Form submitted:', countName, startDate, endDate,countType);
    // Burada form verilerini işleme veya API'ye gönderme işlemi yapılacak.
  };

  // Sayım tipine göre label içeriğini belirleme
  const getLabelForCountType = (type: CountType) => {
    switch(type) {
      case CountType.Depo:
        return "Depolar";
      case CountType.Market:
        return "Marketler";
      case CountType.Vehicle:
        return "Araçlar";
    }
  };
  // Örnek Bileşenler
  const DepotComponent = () => <div>Henüz depo Apisi yok</div>;
  const VehicleComponent = () => <div>Henüz araç Apisi yok</div>;

  const getComponentForCountType = (type: CountType) => {
    switch(type) {
      case CountType.Depo:
        return <DepotComponent />;
      case CountType.Market:
        return <AutoComplete 
                  queryHook={(arg: any, skip: boolean) => useQueryWrapper(useGetMarketsQuery, arg, skip)}
                  formatLabel={(item: Market) => item.name}
                  placeholder='Market Ara...'
                  selectedSuggestion={selectedMarket}
                  onSelect={setSelectedMarket}
                  isError={!selectedMarket && isFormInvalid}
                />;
      case CountType.Vehicle:
        return <VehicleComponent />;
    }
  };

  return (
    <div className="create-count-page w-full lg:w-3/4 mx-auto">
      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl mt-8 mb-4">Yeni Sayım Oluştur</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Sayım adı input alanı */}
        <div className="sayim-adi">
          <CustomTextInput 
            id='countName' 
            label='Sayım Adı:' 
            maxChars={50} 
            onChange={setCountName} 
            placeholder='Yeni sayım adı girin...' 
            value={countName}
            isError={!countName && isFormInvalid}
          />        
        </div>
        {/* Tarih Seçici */}
        <div className="sayim-tarih-araligi">
          <CustomDateRangePicker
            label="Sayım Tarihi Aralığı:"
            startDate={startDate}
            endDate={endDate}
            onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
            isError={(!startDate || !endDate) && isFormInvalid}
          />
        </div>
        {/* Sayım Tipi Seçimi */}
        <div className= "sayim-tipi">
          <CountTypeSelector countType={countType} setCountType={setCountType} />
        </div>

        <div className="sayim-tipi-secim-sonuc">
          <label className="block text-sm mb-2">{`${getLabelForCountType(countType)}:`}</label>
          {getComponentForCountType(countType)}
        </div>
        {/* Diğer form alanları ve düğmeler burada eklenebilir */}
        <button type="submit" className="mt-2 bg-primary-light dark:bg-primary-darkest text-text-darkest dark:text-text-lightest py-2 px-4 w-fit rounded-lg hover:bg-primary dark:hover:bg-primary transition-colors duration-300 ease-in-out">
          Sayım Oluştur
        </button>
        <button type="button" onClick={()=> addNotification("Bilgi verdim", NotificationType.Info)} className="mt-2 bg-primary-light dark:bg-primary-darkest text-text-darkest dark:text-text-lightest py-2 px-4 w-fit rounded-lg hover:bg-primary dark:hover:bg-primary transition-colors duration-300 ease-in-out">
          Bilgi
        </button>
        <button type="button" onClick={()=> addNotification("İşlem başarılıı.", NotificationType.Success)} className="mt-2 bg-primary-light dark:bg-primary-darkest text-text-darkest dark:text-text-lightest py-2 px-4 w-fit rounded-lg hover:bg-primary dark:hover:bg-primary transition-colors duration-300 ease-in-out">
          Başarılı
        </button>
        <button type="button" onClick={()=> addNotification("Bu işte bir terslik var.", NotificationType.Warning)} className="mt-2 bg-primary-light dark:bg-primary-darkest text-text-darkest dark:text-text-lightest py-2 px-4 w-fit rounded-lg hover:bg-primary dark:hover:bg-primary transition-colors duration-300 ease-in-out">
          Uyarı
        </button>
      </form>
    </div>
  );
};

export default CreateCountForm ;
