import React, { useEffect, useState } from 'react';
import CustomTextInput from '../../Components/CustomTextInput';
import "react-datepicker/dist/react-datepicker.css";
import Selector from '../../Components/Selector';
import AutoComplete from '../../Components/AutoComplete';
import { useQueryWrapper } from '../../Hooks/useQueryWrapper';
import { useGetCountTypeQuery, useGetCountVariantsQuery, useGetStructuresToCountQuery, useGetCountAreaQuery, useAddCountFormMutation} from '../../Redux/Services/countFormAPI';
import { StructureToCount } from '../../Redux/Models/apiTypes';
import { useNotifications } from '../../Hooks/useNotifications';
import { NotificationType } from '../../Components/Notification/index.d';
import CustomDatePicker from '../../Components/CustomDatePicker';
import AsyncIconButton from '../../Components/Buttons/AsyncIconButton';
import { LuClipboardEdit } from "react-icons/lu";
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { formatDateV1 } from '../../Utils/formatDateFuncs';


const CreateCount : React.FC = () => {
  //Application hooks
  const { t } = useTranslation();
  const { addNotification } = useNotifications(); // Bildirim ekleme fonksiyonu

  // States to be sent to the server
  const [countName, setCountName] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [countVariant, setCountVariant] = useState<number | null>();
  const [countType, setCountType] = useState<number | null>();
  const [countArea, setCountArea] = useState<number | null>();
  const [selectedStructure, setSelectedStructure] = useState<StructureToCount | null>(null); 
  
  //States used in page management
  const [isFormInvalid, setIsFormInvalid] = useState<boolean>(false);
  
  // Service uses
  const [addCountForm, { isLoading }] = useAddCountFormMutation();
  const { data: countVariants, isLoading: isLoadingCountVariants, error: countVariantsError } = useGetCountVariantsQuery();
  const { data: countTypes, isLoading: isLoadingCountTypes, error: countTypesError} = useGetCountTypeQuery({ variant: countVariant ?? 0 }, { skip: !countVariant });
  const { data: countAreas, isLoading: isLoadingCountAreas, error: countAreasError } = useGetCountAreaQuery();

  // Managing Errors
  useEffect(() => {
    if (countVariantsError) addNotification(`Sayım türleri yüklenirken bir hata oluştu: ${countVariantsError}`, NotificationType.Error);
    if (countTypesError)addNotification(`Sayım tipi yüklenirken bir hata oluştu: ${countTypesError}`, NotificationType.Error);
    if (countAreasError)addNotification(`Sayım alanı yüklenirken bir hata oluştu: ${countAreasError}`, NotificationType.Error)
  }, [countVariantsError, countTypesError, countAreasError]);

  // A function to select countVariant id by title
  const handleSelectCountVariant = (selectedTitle: string) => {
    const selectedVariant = countVariants?.find(variant => variant.title === selectedTitle);
    if (selectedVariant) setCountVariant(selectedVariant.id);
    // Reset Type when Count Variant changes
    setCountType(null)
  };

  // A function to select countType id by title
  const handleSelectCountType = (selectedTitle: string) => {
    const selectedType = countTypes?.find(type => type.title === selectedTitle);
    if (selectedType) setCountType(selectedType.id);
  };

  // A function to select countArea id by title
  const handleSelectCountArea = (selectedTitle: string) => {
    const selectedArea = countAreas?.find(area => area.title === selectedTitle);
    if (selectedArea) setCountArea(selectedArea.id);
  };

  // Find title value of selected option
  const selectedVariant = countVariants?.find(variant => variant.id === countVariant)?.title || '';
  const selectedType = countTypes?.find(type => type.id === countType)?.title || '';
  const selectedArea = countAreas?.find(area => area.id === countArea)?.title || '';

  const handleSubmit = async(event: React.FormEvent) => {
    event.preventDefault();
    // If any of the required states is empty, stop the process
    if (!countName || !startDate || !endDate || !selectedStructure || !countVariant || !countType || !countArea) {
      setIsFormInvalid(true);
      addNotification(t("common.form-is-empty"), NotificationType.Error);
      return; 
    }

    // Past history check
    const now = new Date();
    if ((startDate && startDate < now) || (endDate && endDate < now)) {
      addNotification(t("create-count.invalid-date-warning-1"), NotificationType.Warning);
      return;
    }

    // Check if end date is before start date
    if (startDate && endDate && endDate < startDate) {
      addNotification(t("create-count.invalid-date-warning-2"), NotificationType.Warning);
      return;
    }
    
    setIsFormInvalid(false);
    try {
      await addCountForm({
        name: countName,
        title: countName, 
        fclass: countVariant,
        ftype: countType,
        lock_items: 0, //Initially set to false
        user_id: 0, // Statically set to 0
        status: 0, // Initially set to false
        timeChanged: formatDateV1(new Date()),
        timeEntered: formatDateV1(new Date()),
        depo_id: selectedStructure?.id,
        site_id: countArea,
        startDate: formatDateV1(startDate),
        endDate: formatDateV1(endDate),
      }).unwrap();

      addNotification(t("create-count.succesfully-created"), NotificationType.Success);
      // Reset form fields to their initial state
      setCountName('');
      setStartDate(null);
      setEndDate(null);
      setCountVariant(null);
      setCountType(null);
      setCountArea(null);
      setSelectedStructure(null);
    } catch (error) {
      const err = error as { data?: { message?: string }, status?: number };
      const errorMessage = err.data?.message || t("create-count.unknown-error");
      addNotification(t("create-count.error-message",{errorMessage, status:err.status}), NotificationType.Error);
    }
  };
  
  const selectorConfigs = [
    { 
      id: 'count-variant',
      label: 'Sayım Türü',
      value: selectedVariant,
      options: countVariants?.map((variant) => variant.title) || [],
      onSelect: handleSelectCountVariant,
      isLoading: isLoadingCountVariants,
      placeholder: 'Tür Seçiniz',
      noDataText: 'Türler Yüklenemedi.'
    },
    { 
      id: 'count-type',
      label: 'Sayım Tipi',
      value: selectedType,
      options: countTypes?.map((type) => type.title) || [],
      onSelect: handleSelectCountType,
      isLoading: isLoadingCountTypes,
      placeholder: 'Tip Seçiniz',
      noDataText: 'Tipler Yüklenemedi.'
    },
    { 
      id: 'count-area',
      label: 'Sayım Alanı',
      value: selectedArea,
      options: countAreas?.map((area) => area.title) || [],
      onSelect: handleSelectCountArea,
      isLoading: isLoadingCountAreas,
      placeholder: 'Alan Seçiniz',
      noDataText: 'Alanlar Yüklenemedi.'
    }
  ];
  
  return (
    <div id='create-count-page' className="w-full lg:w-3/4 mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4 md:text-3xl lg:text-4xl mt-8">Yeni Sayım Oluştur</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Count name input field */}
        <div className="sayim-adi">
          <CustomTextInput 
            id='countName' 
            label='Sayım Adı:' 
            maxChars={50} 
            onChange={(e)=>{setCountName(e.target.value)}} 
            placeholder='Yeni sayım adı girin...' 
            value={countName}
            isError={!countName && isFormInvalid}
          />        
        </div>
        {/* Date Picker */}
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
        
        {/* Count Variant, Type and Area Selection */}
        {selectorConfigs.map((obj) => (
          <div key={obj.id} id={obj.id}>
            {
              obj.isLoading
              ? <div className='space-y-2'>
                  <Skeleton height={20} width={100} borderRadius={5}  className='p-0 mt-2' baseColor={`var(--skeleton-base-color)`}  highlightColor={`var(--skeleton-highlight-color)`} duration={1.2}/> 
                  <Skeleton height={35} width={100} count={3} borderRadius={8} containerClassName='flex flex-row gap-2' baseColor={`var(--skeleton-base-color)`}  highlightColor={`var(--skeleton-highlight-color)`} duration={1.6}/> 
                </div>
              : obj.options.length > 0 
                ? <Selector
                    label= {obj.label}
                    options={obj.options}
                    selectedOption={obj.value}
                    onSelect={obj.onSelect}
                  /> 
                : <span className='opacity-40 cursor-default'>{obj.noDataText}</span>
            }
          </div>
       ))}

        <div id='count-type-picker'>
          <label className="block text-sm mb-2">{`Sayılacak Yapı:`}</label>
          <AutoComplete 
                  queryHook={(arg: any, skip: boolean) => useQueryWrapper(useGetStructuresToCountQuery, arg, skip)}
                  formatLabel={(item: StructureToCount) => item.depo}
                  placeholder='Yapı ara...'
                  selectedSuggestion={selectedStructure}
                  onSelect={setSelectedStructure}
                  isError={!selectedStructure && isFormInvalid}
                />
        </div>
        <AsyncIconButton type='submit' isLoading={isLoading} title='Sayım Oluştur' Icon={LuClipboardEdit}/>
      </form>
    </div>
  );
};

export default CreateCount ;
