import React, { useState } from 'react';
import CustomTextInput from '../../../Components/CustomTextInput';
import "react-datepicker/dist/react-datepicker.css";
import CustomDatePicker from '../../../Components/CustomDateRangePicker';
import CountTypeSelector from '../../../Components/CountTypeSelector';
import AsyncCheckableTree from '../../../Components/AsyncCheckableTree';
import { TreeNode } from '../../../Components/AsyncCheckableTree/index.d';

const CreateCountForm : React.FC = () => {
  const [countName, setCountName] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [countType, setCountType] = useState('depot'); // Sayım tipi için state


  const dummyData: TreeNode[]  = [
    {
      id: '1',
      label: 'Market 1',
      type: 'mainStructure', // 'mainStructure', 'corridor', 'section', veya 'level'
      children: [
        {
          id: '1-1',
          label: 'A Koridoru',
          type: 'level',
          children: [
            {
              id: '1-1-1',
              label: '1. Bölge',
              type: 'section',
              isLeaf: true
              // Diğer opsiyonel özellikler
            },
            {
              id: '1-1-2',
              label: '2. Bölge',
              type: 'section',
              isLeaf: true,
              hasError: true
              // Diğer opsiyonel özellikler
            }
          ],
          // Diğer opsiyonel özellikler
        },
        {
          id: '1-2',
          label: 'B Koridoru',
          type: 'level',
          isLoading: true
          // Diğer opsiyonel özellikler
        }
      ],
      // Diğer opsiyonel özellikler
    },
    // Diğer TreeNode nesneleri
  ];
  

  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted:', countName, startDate, endDate);
    // Burada form verilerini işleme veya API'ye gönderme işlemleri yapılabilir
  };
  
  return (
    <div className="create-count-page">
      <h1 className="text-center text-2xl md:text-3xl lg:text-5xl my-8">Yeni Sayım Oluştur</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Sayım adı input alanı */}
        <div className="form-item">
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
        <div className="form-item">
          <CustomDatePicker
            label="Sayım Tarihi Aralığı:"
            startDate={startDate}
            endDate={endDate}
            onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
          />
        </div>
        {/* Sayım Tipi Seçimi */}
        <div className= "form-item">
          <CountTypeSelector countType={countType} setCountType={setCountType} />
        </div>
        <AsyncCheckableTree data={dummyData} />
        {/* Diğer form alanları ve düğmeler burada eklenebilir */}
        <button type="submit" className="mt-2 bg-primary-light dark:bg-primary-darkest text-text-darkest dark:text-text-lightest py-2 px-4 w-fit rounded-xl hover:bg-primary dark:hover:bg-primary transition-colors duration-300 ease-in-out">
          Sayım Oluştur
        </button>
      </form>
    </div>
  );
};

export default CreateCountForm ;
