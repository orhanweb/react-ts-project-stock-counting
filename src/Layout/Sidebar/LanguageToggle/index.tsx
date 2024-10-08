import React, { useState } from "react";
import DropdownMenu from "../../../Components/DropdownMenu";
import { useTranslation } from "react-i18next";
import ResponsiveIconButton from "../../../Components/Buttons/ResponsiveIconButton";
import { MdLanguage } from "react-icons/md";

const LanguageToggle: React.FC<{
  toggleSidebar: (isOpen: boolean) => void;
}> = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { i18n } = useTranslation();

  const languageOptions = [
    { label: "English", onClick: () => changeLanguage("en") },
    { label: "Türkçe", onClick: () => changeLanguage("tr") },
  ];

  // Function that saves the user's language preference to localStorage and changes the i18n language
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang); // Save user's language preference to localStorage
    toggleSidebar(false);
  };

  return (
    <div className="relative w-fit lg:w-full">
      <ResponsiveIconButton
        onClick={(event) => {
          event.stopPropagation();
          setDropdownOpen(!dropdownOpen);
        }}
        Icon={MdLanguage}
        title={"Dil Seç"}
      />
      {dropdownOpen && (
        <DropdownMenu
          id="language-dropdown"
          options={languageOptions}
          closeDropdown={() => setDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageToggle;
