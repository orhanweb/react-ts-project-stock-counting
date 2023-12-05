import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css'; // Date picker stil dosyası
import DatePicker from 'react-datepicker'; // Date picker için önerilen bir paket
// // src/Pages/ViewCounts.tsx
// import React from 'react';

// const ViewCounts: React.FC = () => {
//   // Sayım oluşturma formu ve mantığı burada olacak
//   return <div className='text-center'>View Counts Page</div>;
// };

// export default ViewCounts;
const CreateCountForm: React.FC = () => {
  const [countName, setCountName] = useState('');
  const [dateRange, setDateRange] = useState<[Date?, Date?]>([undefined, undefined]);
  //const [selectedStore, setSelectedStore] = useState('');
  // Diğer state'ler ve ilgili işlevsellikler...

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Form gönderim mantığı...
  };

  return (
    <div className="create-count-page">
      <h1 className="text-center text-2xl md:text-3xl lg:text-5xl mb-8">Yeni Sayım Oluştur</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="form-item">
          <label htmlFor="countName" className="block mb-2">
            Sayım Adı:
          </label>
          <input
            
            id="countName"
            placeholder='denme'
            type="text"
            value={countName}
            onChange={(e) => setCountName(e.target.value)}
            className="border p-2 rounded w-full"
          />





        </div>
        <div className="form-item">
          <label htmlFor="dateRange" className="block mb-2">
            Tarih Aralığı:
          </label>
          <DatePicker
            selectsRange={true}
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={(update) => setDateRange(update as [Date?, Date?])}
            className="border p-2 rounded w-full"
          />
        </div>
        
        <input
  type="date"
  className="w-44 bg-transparent border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-purple-500 dark:focus:border-purple-300 transition-colors"
/>
<select
  className="bg-transparent border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-orange-500 dark:focus:border-orange-300 transition-colors"
>
  <option>Seçenek 1</option>
  <option>Seçenek 2</option>
  <option>Seçenek 3</option>
</select>
        {/* Market/Depo Seçimi, Alan Seçimi, Bölüm Seçimi ve Kat Seçimi için ilgili UI elemanları... */}
        <div className="form-item">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Sayım Oluştur
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCountForm;
