import React, { useEffect, useMemo, useState } from "react";
import CustomTextInput from "../../Components/CustomTextInput";
import "react-datepicker/dist/react-datepicker.css";
import Selector from "../../Components/Selector";
import {
  useGetCountTypeQuery,
  useGetCountVariantsQuery,
  useGetStructuresToCountQuery,
  useGetCountAreaQuery,
  useAddCountFormMutation,
} from "../../Redux/Services/countFormAPI";
import { useNotifications } from "../../Hooks/useNotifications";
import { NotificationType } from "../../Components/Notification/index.d";
import CustomDatePicker from "../../Components/CustomDatePicker";
import AsyncIconButton from "../../Components/Buttons/AsyncIconButton";
import { LuClipboardEdit } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { formatDateV1 } from "../../Utils/formatDateFuncs";
import AutoSelect from "../../Components/AutoSelect";
import { FormData } from "./index.d";

const initialFormData: FormData = {
  countName: "",
  startDate: null,
  endDate: null,
  countVariant: null,
  countType: null,
  countArea: null,
  structureID: null,
};

const CreateCount: React.FC = () => {
  //Application hooks
  const { t } = useTranslation();
  const { addNotification } = useNotifications(); // Notification adding function
  // State to send to server
  const [formData, setFormData] = useState<FormData>(initialFormData);
  // --- States used in page management
  const [isFormInvalid, setIsFormInvalid] = useState<boolean>(false);
  const [isFocusedStructureSelect, setIsFocusedStructureSelect] =
    useState<boolean>(false);

  // --- SERVICES
  const [addCountForm, { isLoading }] = useAddCountFormMutation();
  const {
    data: structures,
    isLoading: isLoadingStructure,
    error: structuresError,
  } = useGetStructuresToCountQuery(undefined, {
    skip: !isFocusedStructureSelect,
  });
  const {
    data: countVariants,
    isLoading: isLoadingCountVariants,
    error: countVariantsError,
  } = useGetCountVariantsQuery();
  const {
    data: countTypes,
    isLoading: isLoadingCountTypes,
    error: countTypesError,
  } = useGetCountTypeQuery(
    { variant: formData.countVariant ?? 0 },
    { skip: !formData.countVariant }
  );
  const {
    data: countAreas,
    isLoading: isLoadingCountAreas,
    error: countAreasError,
  } = useGetCountAreaQuery();

  // --- MANAGING ERRORS
  useEffect(() => {
    if (structuresError)
      addNotification(
        `Yapılar yüklenirken bir hata oluştu: ${structuresError}`,
        NotificationType.Error
      );
    if (countVariantsError)
      addNotification(
        `Sayım türleri yüklenirken bir hata oluştu: ${countVariantsError}`,
        NotificationType.Error
      );
    if (countTypesError)
      addNotification(
        `Sayım tipi yüklenirken bir hata oluştu: ${countTypesError}`,
        NotificationType.Error
      );
    if (countAreasError)
      addNotification(
        `Sayım alanı yüklenirken bir hata oluştu: ${countAreasError}`,
        NotificationType.Error
      );
  }, [structuresError, countVariantsError, countTypesError, countAreasError]);

  // --- PAGE FUNCTIONS
  const updateFormData = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  // A function to selects
  const handleSelect = (
    selectedTitle: string,
    fieldToUpdate: keyof FormData,
    data?: any[]
  ) => {
    const selectedItem = data?.find((item) => item.title === selectedTitle);
    if (selectedItem) {
      updateFormData(fieldToUpdate, selectedItem.id);
      // Reset Type when Count Variant changes
      if (fieldToUpdate === "countVariant") {
        updateFormData("countType", null);
      }
    }
  };

  // A function to select structure
  const handleSelectStructure = (selectedOption: any) => {
    updateFormData("structureID", selectedOption ? selectedOption.value : null);
  };

  const structureOptions = useMemo(() => {
    return (
      structures?.map((structure) => ({
        value: structure.id,
        label: structure.depo,
      })) || []
    );
  }, [structures]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // If any of the required states is empty, stop the process
    if (Object.values(formData).some((value) => !value)) {
      setIsFormInvalid(true);
      addNotification(t("common.form-is-empty"), NotificationType.Error);
      return;
    }

    // Past history check
    const now = new Date();
    if (
      (formData.startDate && formData.startDate < now) ||
      (formData.endDate && formData.endDate < now)
    ) {
      addNotification(
        t("create-count.invalid-date-warning-1"),
        NotificationType.Warning
      );
      return;
    }

    // Check if end date is before start date
    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      addNotification(
        t("create-count.invalid-date-warning-2"),
        NotificationType.Warning
      );
      return;
    }

    setIsFormInvalid(false);
    try {
      await addCountForm({
        name: formData.countName,
        title: formData.countName,
        fclass: formData.countVariant!,
        ftype: formData.countType!,
        lock_items: 0, //Initially set to false
        user_id: 0, // Statically set to 0
        status: 0, // Initially set to false
        timeChanged: formatDateV1(new Date()),
        timeEntered: formatDateV1(new Date()),
        depo_id: formData.structureID!,
        site_id: formData.countArea!,
        startDate: formatDateV1(formData.startDate!),
        endDate: formatDateV1(formData.endDate!),
      }).unwrap();

      addNotification(
        t("create-count.succesfully-created"),
        NotificationType.Success
      );
      // Reset form fields to their initial state
      setFormData(initialFormData);
    } catch (error) {
      const err = error as { data?: { message?: string }; status?: number };
      const errorMessage = err.data?.message || t("create-count.unknown-error");
      addNotification(
        t("create-count.error-message", { errorMessage, status: err.status }),
        NotificationType.Error
      );
    }
  };

  const selectorConfigs = [
    {
      id: "count-variant",
      label: "Sayım Türü",
      value:
        countVariants?.find((variant) => variant.id === formData.countVariant)
          ?.title || "",
      options: countVariants?.map((variant) => variant.title) || [],
      onSelect: (selectedTitle: string) =>
        handleSelect(selectedTitle, "countVariant", countVariants),
      isLoading: isLoadingCountVariants,
      placeholder: "Tür Seçiniz",
      noDataText: "Türler Yüklenemedi.",
    },
    {
      id: "count-type",
      label: "Sayım Tipi",
      value:
        countTypes?.find((type) => type.id === formData.countType)?.title || "",
      options: countTypes?.map((type) => type.title) || [],
      onSelect: (selectedTitle: string) =>
        handleSelect(selectedTitle, "countType", countTypes),
      isLoading: isLoadingCountTypes,
      placeholder: "Tip Seçiniz",
      noDataText: "Tipler Yüklenemedi.",
    },
    {
      id: "count-area",
      label: "Sayım Alanı",
      value:
        countAreas?.find((area) => area.id === formData.countArea)?.title || "",
      options: countAreas?.map((area) => area.title) || [],
      onSelect: (selectedTitle: string) =>
        handleSelect(selectedTitle, "countArea", countAreas),
      isLoading: isLoadingCountAreas,
      placeholder: "Alan Seçiniz",
      noDataText: "Alanlar Yüklenemedi.",
    },
  ];

  return (
    <div id="create-count-page" className="w-full lg:w-3/4 mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4 md:text-3xl lg:text-4xl mt-8">
        Yeni Sayım Oluştur
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Count name input field */}
        <CustomTextInput
          id="countName"
          label="Sayım Adı:"
          maxLength={50}
          onChange={(e) => {
            updateFormData("countName", e.target.value);
          }}
          placeholder="Yeni sayım adı girin..."
          value={formData.countName}
          isError={!formData.countName && isFormInvalid}
        />
        {/* Date Picker */}
        <div
          id="count-date-range"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <CustomDatePicker
            label="Başlangıç Tarihi:"
            selectedDate={formData.startDate}
            onChange={(date) => updateFormData("startDate", date ? date : null)}
            placeholderText="Başlangıç tarihi ve saati seçin"
            isError={!formData.startDate && isFormInvalid}
          />
          <CustomDatePicker
            label="Bitiş Tarihi:"
            selectedDate={formData.endDate}
            onChange={(date) => updateFormData("endDate", date ? date : null)}
            placeholderText="Bitiş tarihi ve saati seçin"
            isError={!formData.endDate && isFormInvalid}
          />
        </div>
        {/* Structure Selection */}
        <div id="count-type-picker">
          <AutoSelect
            label="Sayılacak Yapı"
            required
            isClearable
            options={structureOptions}
            value={structureOptions.find(
              (option) => option.value === formData.structureID
            )}
            onChange={handleSelectStructure}
            placeholder="Yapı ara..."
            isLoading={isLoadingStructure}
            onFocus={() => setIsFocusedStructureSelect(true)}
            onBlur={() => setIsFocusedStructureSelect(false)}
          />
        </div>
        {/* Count Variant, Type and Area Selection */}
        {selectorConfigs.map((obj) => (
          <div key={obj.id} id={obj.id}>
            {obj.isLoading ? (
              <div className="space-y-2">
                <Skeleton
                  height={20}
                  width={100}
                  borderRadius={5}
                  className="p-0 mt-2"
                  baseColor={`var(--skeleton-base-color)`}
                  highlightColor={`var(--skeleton-highlight-color)`}
                  duration={1.2}
                />
                <Skeleton
                  height={35}
                  width={100}
                  count={3}
                  borderRadius={8}
                  containerClassName="flex flex-row gap-2"
                  baseColor={`var(--skeleton-base-color)`}
                  highlightColor={`var(--skeleton-highlight-color)`}
                  duration={1.6}
                />
              </div>
            ) : obj.options.length > 0 ? (
              <Selector
                label={obj.label}
                options={obj.options}
                selectedOption={obj.value}
                onSelect={obj.onSelect}
              />
            ) : (
              <span className="opacity-40 cursor-default">
                {obj.noDataText}
              </span>
            )}
          </div>
        ))}

        <AsyncIconButton
          type="submit"
          isLoading={isLoading}
          title="Sayım Oluştur"
          Icon={LuClipboardEdit}
        />
      </form>
    </div>
  );
};

export default CreateCount;
