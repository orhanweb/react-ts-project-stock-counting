import React, { useState } from 'react';
import CustomTextInput from '../../../Components/CustomTextInput';
import "react-datepicker/dist/react-datepicker.css";
import CustomDateRangePicker from '../../../Components/CustomDateRangePicker';
import CountTypeSelector from '../../../Components/CountTypeSelector';

const CreateCountForm : React.FC = () => {
  const [countName, setCountName] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [countType, setCountType] = useState('depot'); // Sayım tipi için state

  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted:', countName, startDate, endDate);
    // Burada form verilerini işleme veya API'ye gönderme işlemleri yapılabilir
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
          />        
        </div>
        {/* Tarih Seçici */}
        <div className="sayim-tarih-araligi">
          <CustomDateRangePicker
            label="Sayım Tarihi Aralığı:"
            startDate={startDate}
            endDate={endDate}
            onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
          />
        </div>
        {/* Sayım Tipi Seçimi */}
        <div className= "sayim-tipi">
          <CountTypeSelector countType={countType} setCountType={setCountType} />
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
