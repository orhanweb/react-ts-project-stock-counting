import React from 'react';
import { MdAdd } from 'react-icons/md';

interface BarcodeScannerButtonProps {
  setValue: React.Dispatch<React.SetStateAction<string>>; // String state'i güncellemek için kullanılacak setter fonksiyonu
}

const BarcodeScannerButton: React.FC<BarcodeScannerButtonProps> = ({ setValue }) => {
  const handleClick = () => {
    // Örnek olarak, butona her tıklamada yeni bir rastgele sayıyı string olarak state'e atayalım
    const newValue = Math.random().toString();
    setValue(newValue);
  };

  return (
    <button onClick={handleClick} className="p-2 text-xl bg-gray-300 text-black rounded hover:bg-gray-400">
      <MdAdd />
    </button>
  );
};

export default BarcodeScannerButton;
