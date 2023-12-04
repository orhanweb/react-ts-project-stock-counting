import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './index.css';
 
interface BarcodeScannerProps {
  onClose: () => void;
  setBarcodeValue: React.Dispatch<React.SetStateAction<string>>;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onClose, setBarcodeValue }) => {
  // useRef ile Html5QrcodeScanner nesnesi için bir referans oluşturuyoruz
  const html5QrCodeRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if(html5QrCodeRef.current?.getState() === undefined ){
       html5QrCodeRef.current = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 }, false);
       html5QrCodeRef.current.render(onScanSuccess, onScanFailure);
    }
  }, []);
   
  const onScanSuccess = (decodedText: string) => {
    setBarcodeValue(decodedText);
    // Scanner'ı temizliyoruz
    handleClose();
  };

  const onScanFailure = (_: string) => {
    // Hata mesajlarını console'a yazdırıyoruz
    //console.error(`QR Code scanning error: ${error}`);
  };

  // onClose metodunu güncelledik, böylece artık Html5QrcodeScanner instance'ını temizleyebilir
  const handleClose = () => {
    html5QrCodeRef.current?.clear();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40" onClick={handleClose}>
      <div className="p-2 rounded-lg shadow-lg bg-background-lightest text-text-darkest dark:bg-background-darker dark:text-text-lightest  z-50 w-min h-min" onClick={(e) => e.stopPropagation()}>
        <div id="qr-reader"></div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
