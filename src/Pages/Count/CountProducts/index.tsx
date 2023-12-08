import React, { useState, FormEvent,useEffect } from 'react';
import AutoComplete from '../../../Components/AutoComplete';
import { useGetCorridorsQuery, useGetMarketsQuery, useGetSectionAndLevelQuery } from '../../../Redux/Services/countLocationAPI';
import { Corridor, Market, Product, SectionAndLevel } from '../../../Redux/Models/apiTypes';
import { AutoCompleteProps } from '../../../Components/AutoComplete/index.d';
import AutoCompleteV2 from '../../../Components/AutoCompleteV2';
import { useGetProductNamesQuery,useGetBarcodesQuery } from '../../../Redux/Services/productsInfosAPI';
import { MdSwapHoriz } from 'react-icons/md';
import { FaQrcode } from "react-icons/fa6";
import BarcodeScanner from '../../../Components/BarcodeScanner';

// Genel wrapper fonksiyonu
const useQueryWrapper = (queryHook: any, queryArg: any, skip: boolean) => {
  const { data, isFetching } = queryHook(queryArg, { skip });
  return { data, isFetching };
};

// Ürün birim türlerini ayrıştıran fonksiyon
const getUnitTypes = (product: Product) => {
  let units: string[] = [];
  if (product.unit && !units.includes(product.unit)) units.push(product.unit);
  if (product.unit2 && !units.includes(product.unit2)) units.push(product.unit2);
  if (product.unit3 && !units.includes(product.unit3)) units.push(product.unit3);
  return units;
};

const CountProducts: React.FC = () => {
  // Veri tabanına gönderilecek stateler
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | null>(null);
  const [selectedSectionLevel, setSelectedSectionLevel] = useState<SectionAndLevel | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [unitValues, setUnitValues] = useState<Record<string, string>>({});

  // Sayfa kontrolünde kullanılan stateler
  const [showScanner, setShowScanner] = useState<boolean>(false); // Barkod okuyucunun görünürlüğü için state
  const [barcodeValue, setBarcodeValue] = useState<string>('');
  const [showBarcodeInput, setShowBarcodeInput] = useState<boolean>(true);
  const [isFormInvalid, setIsFormInvalid] = useState<boolean>(false);

  // Seçilen ürün değiştiğinde unitValues state'ini güncelle
  useEffect(() => {
    const initialUnitValues: Record<string, string> = {};
    if (selectedProduct) {
      getUnitTypes(selectedProduct).forEach((unitType) => {
        initialUnitValues[unitType] = '';
      });
    }
    setUnitValues(initialUnitValues);
  }, [selectedProduct]);
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Eğer zorunlu statelerden herhangi biri boşsa, işlemi durdur
    if (!selectedMarket || !selectedCorridor || !selectedSectionLevel || !selectedProduct) {
      setIsFormInvalid(true); // Form geçersiz, hata state'ini güncelle
      return; // Form gönderimini durdur
    }
    setIsFormInvalid(false); // Form geçerli, hata state'ini sıfırla
    // Eğer tüm zorunlu alanlar doldurulmuşsa, form verilerini işleme
    const formData = {
      marketId: selectedMarket.id,
      corridorId: selectedCorridor.id,
      sectionLevelId: selectedSectionLevel.id,
      productId: selectedProduct.id,
      stockData: unitValues
    };
  
    console.log('Form Data:', formData);
    // Burada formData'yı API'ye gönderme işlemini yapcam
    setSelectedProduct(null);
  };
  
  
  const toggleInputType = () => {
    setSelectedProduct(null);
    setShowBarcodeInput(!showBarcodeInput);
  };
  
  // Input alanlarını güncelleyen fonksiyon
  const handleUnitChange = (unitType: string, value: string) => {
    setUnitValues({ ...unitValues, [unitType]: value });
  };
  
  // LOCATION AUTO COMPLETE COMPONENTS VARIABLES
  const autoCompleteFields: AutoCompleteProps[] = [
    {
      queryHook: (arg: any, skip: boolean) => useQueryWrapper(useGetMarketsQuery, arg, skip),
      formatLabel: (item: Market) => item.name,
      placeholder: "Market Ara...",
      selectedSuggestion: selectedMarket,
      onSelect: setSelectedMarket,
      isError: isFormInvalid && !selectedMarket
    },
    {
      queryHook: (arg: any, skip: boolean) => useQueryWrapper(useGetCorridorsQuery, { marketId: arg }, skip || !selectedMarket),
      formatLabel: (item: Corridor) => item.name,
      placeholder: "Koridor Ara...",
      selectedSuggestion: selectedCorridor,
      onSelect: setSelectedCorridor,
      queryArg: selectedMarket?.id,
      disabled: !selectedMarket,
      isError: isFormInvalid && !selectedCorridor
    },
    {
      queryHook: (arg: any, skip: boolean) => useQueryWrapper(useGetSectionAndLevelQuery, { zoneId: arg }, skip || !selectedCorridor),
      formatLabel: (item: SectionAndLevel) => `Bölge: ${item.name} - Kat: ${item.floor}`,
      placeholder: "Bölge ve Seviye Ara...",
      selectedSuggestion: selectedSectionLevel,
      onSelect: setSelectedSectionLevel,
      queryArg: selectedCorridor?.id,
      disabled: !selectedCorridor,
      isError: isFormInvalid && !selectedSectionLevel
    }
  ];

  return (
    <div className="w-full lg:w-3/4 mx-auto"> {/* Genişlik ve padding ayarlamaları */}
      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl mt-8 mb-4">Ürün Sayım Sayfası</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <h2 className="text-center text-xl md:text-2xl lg:text-3xl mt-2">Konum Seç</h2> 
        <div className="konum-secimi flex flex-col lg:flex-row w-full items-center justify-center gap-4 py-4">
          {autoCompleteFields.map((field, index) => (
            <AutoComplete
              key={index}
              queryHook={field.queryHook}
              formatLabel={field.formatLabel}
              placeholder={field.placeholder}
              selectedSuggestion={field.selectedSuggestion}
              onSelect={field.onSelect}
              queryArg={field.queryArg}
              disabled={field.disabled}
              isError={field.isError}
            />
          ))}
        </div>
        <h2 className="text-center text-xl md:text-2xl lg:text-3xl mt-2">Ürün Seç</h2> 
        <div className="urun-secimi flex flex-row items-center justify-center gap-2 w-full py-4">
          <button type="button" onClick={toggleInputType} className="p-2 text-xl bg-primary dark:bg-primary-darkest text-text-lightest rounded-lg hover:bg-primary-light hover:dark:bg-primary-darker transition-colors duration-300 ease-in-out">
            <MdSwapHoriz />
          </button>
          {showBarcodeInput ? (
            <div className='flex items-center w-full gap-2'> 
              <AutoCompleteV2
                key={"barcode"}
                queryHook={(arg: any, skip: boolean) => useQueryWrapper(useGetBarcodesQuery, { barcode: arg }, skip || !arg)}
                formatLabel={(item: Product) => `Ürün Adı: ${item.name}\nÜrün Barkodu: ${item.barcode1}`}
                formatInputValue={(item:Product)=> item.barcode1}
                onSelect={setSelectedProduct}
                selectedSuggestion={selectedProduct}
                placeholder="Ürün barkodu ara..."
                isError={isFormInvalid && !selectedProduct}
                externalInputValue={barcodeValue}
              />
              <button type="button" onClick={() => setShowScanner(true)} className="p-2 text-xl bg-background-light text-text-darkest dark:bg-background-darkest dark:text-text-lightest rounded-lg hover:text-primary hover:dark:text-primary transition-colors duration-300 ease-in-out">
                <FaQrcode />
              </button>          
            </div>
          ) : (
            <AutoCompleteV2
              key={"productNameOrCode"}
              queryHook={(arg: any, skip: boolean) => useQueryWrapper(useGetProductNamesQuery, { productName: arg }, skip || !arg)}
              formatLabel={(item: Product) => `Ürün Adı: ${item.name}\nÜrün Kodu: ${item.code}`}
              formatInputValue={(item:Product)=> item.name}
              onSelect={setSelectedProduct}
              selectedSuggestion={selectedProduct}
              placeholder="Ürün adı veya Kod ara..."
              isError={isFormInvalid && !selectedProduct}
            />
          )}
        </div>
        <h2 className="text-center text-xl md:text-2xl lg:text-3xl mt-2">Stok Gir</h2>
        <div className="stok-girme-secimi mt-2  py-4 w-full">
          {selectedProduct ? (
            <div className="flex flex-col lg:flex-row w-full items-center justify-center gap-4">
              {Object.keys(unitValues).map((unitType) => (
                  <input
                    key={unitType}
                    type="number"
                    placeholder={`${unitType} Miktarı`}
                    className='w-full border rounded p-2 border-background bg-transparent text-text-darkest dark:text-text-lightest focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-300 ease-in-out'
                    id={unitType}
                    value={unitValues[unitType]}
                    onChange={(e) => handleUnitChange(unitType, e.target.value)}
                  />
              ))}
            </div>
          ) : (
            <p className='text-center text-text-light'>Stok Girmek İçin Ürün Seçin</p>
          )}
        </div>
        {/* Barkod okuma bileşeni */}
        {showScanner && (
        <BarcodeScanner 
          onClose={() => setShowScanner(false)}
          setBarcodeValue={setBarcodeValue}
        />
      )}
        <button type="submit" className="mt-4 px-4 py-2 bg-primary dark:bg-primary-darkest text-text-lightest rounded-lg hover:bg-primary-light hover:dark:bg-primary-darker transition-colors duration-300 ease-in-out">
          Gönder
        </button>
      </form>
    </div>
  );
  
};

export default CountProducts;
