import React from "react";
import { IoLockOpen, IoLockClosed } from "react-icons/io5";
import AccordionCard from "../../../../Components/AccordionCard";
import { formatDateV2 } from "../../../../Utils/formatDateFuncs";
import { CountDetailsCardProps } from "./index.d";

// Accordion card used to show counting information in detail on the page
const CountDetailsCard: React.FC<CountDetailsCardProps> = ({
  countDetails,
  countedProducts,
  isCardOpen,
  toggleCardOpen,
}) => {
  return (
    <AccordionCard
      title={
        <div className="flex justify-between items-center w-full">
          <span>{`Sayım Detayları ${
            !countedProducts ? "- Yükleniyor.." : ""
          }`}</span>
          {countDetails &&
            (countDetails.durum === "1" ? (
              <IoLockOpen className="text-green-500" size={20} />
            ) : (
              <IoLockClosed className="text-red-500" size={20} />
            ))}
        </div>
      }
      isOpen={isCardOpen}
      onClick={toggleCardOpen}
    >
      <span className="block">
        Sayımın adı: <strong>{countedProducts?.sayim_adi}</strong>
      </span>
      <span className="block">
        Sayılan Yapı: <strong>{countedProducts?.depos_adi}</strong>
      </span>
      <span className="block">
        Ürün Çeşidi: <strong>{countedProducts?.urun_cesidi}</strong>
      </span>
      <span className="block">
        Personel Sayısı: <strong>{countedProducts?.personel_sayisi}</strong>
      </span>
      <span className="block">
        İlk ürün saati:{" "}
        <strong>{formatDateV2(countedProducts?.ilk_sayim_saati ?? "")}</strong>
      </span>
      <span className="block">
        Son ürün saati:{" "}
        <strong>{formatDateV2(countedProducts?.son_sayim_saati ?? "")}</strong>
      </span>
      <span className="block">
        Sayım Durumu:{" "}
        <span
          className={`italic ${
            countDetails?.durum === "1" ? "text-success" : "text-error"
          }`}
        >
          {countDetails?.durum === "1" ? "Açık" : "Kapalı"}
        </span>
      </span>
    </AccordionCard>
  );
};

export default CountDetailsCard;
