import React, { useState } from 'react';
import CustomTextInput from '../../../Components/CustomTextInput';
import "react-datepicker/dist/react-datepicker.css";
import CountTypeSelector from '../../../Components/CountTypeSelector';
import { CountType } from '../../../Components/CountTypeSelector/index.d';
import AutoComplete from '../../../Components/AutoComplete';
import { useQueryWrapper } from '../../../Hooks/useQueryWrapper';
import { useGetMarketsQuery } from '../../../Redux/Services/countLocationAPI';
import { Market } from '../../../Redux/Models/apiTypes';
import { useNotifications } from '../../../Hooks/useNotifications';
import { NotificationType } from '../../../Components/Notification/index.d';
import CustomDatePicker from '../../../Components/CustomDatePicker';

const CreateCountForm : React.FC = () => {
  const [countName, setCountName] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [countType, setCountType] = useState<CountType>(CountType.Market);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [isFormInvalid, setIsFormInvalid] = useState<boolean>(false);
  
  const { addNotification } = useNotifications(); // Bildirim ekleme fonksiyonu

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Eğer zorunlu statelerden herhangi biri boşsa, işlemi durdur
    if (!countName || !startDate || !endDate || !selectedMarket) {
      setIsFormInvalid(true);
      addNotification("Form da boş alan var.", NotificationType.Error);
      return; 
    }

    // Geçmiş tarih kontrolü
    const now = new Date();
    if ((startDate && startDate < now) || (endDate && endDate < now)) {
      addNotification("Sayım tarihleri geçmiş bir tarihi içeremez.", NotificationType.Warning);
      return;
    }

    // Bitiş tarihinin başlangıç tarihinden önce olup olmadığını kontrol et
    if (startDate && endDate && endDate < startDate) {
      addNotification("Bitiş tarihi, başlangıç tarihinden önce olamaz.", NotificationType.Warning);
      return;
    }

    setIsFormInvalid(false);
    console.log('Form submitted:', countName, startDate, endDate, countType);
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
        <div className="sayim-tarih-araligi grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CustomDatePicker
            label="Başlangıç Tarihi:"
            selectedDate={startDate}
            onChange={setStartDate}
            placeholderText="Başlangıç tarihi ve saati seçin"
            isError={!startDate && isFormInvalid}
          />
          <CustomDatePicker
            label="Bitiş Tarihi:"
            selectedDate={endDate}
            onChange={setEndDate}
            placeholderText="Bitiş tarihi ve saati seçin"
            isError={!endDate && isFormInvalid}
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
      </form>
    </div>
  );
};

export default CreateCountForm ;
