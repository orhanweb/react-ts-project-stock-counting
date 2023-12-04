import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface BarcodeScannerProps {
  onClose: () => void;
  setBarcodeValue: React.Dispatch<React.SetStateAction<string>>;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onClose, setBarcodeValue }) => {
  // useRef ile Html5QrcodeScanner nesnesi için bir referans oluşturuyoruz
  const html5QrCodeRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    console.log('BarcodeScanner useEffect called. html5QrCodeRef.current:', html5QrCodeRef.current);
  
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.clear();
      console.log('Existing html5QrCodeRef.current will be cleared.', html5QrCodeRef.current);
    }
  
    html5QrCodeRef.current = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 }, false);
    html5QrCodeRef.current.render(onScanSuccess, onScanFailure);
  
    return () => {
      console.log('BarcodeScanner useEffect cleanup called. html5QrCodeRef.current:', html5QrCodeRef.current);
      html5QrCodeRef.current?.clear();
    };
  }, []);
   

  const onScanSuccess = (decodedText: string) => {
    setBarcodeValue(decodedText);
    console.log("Barcode scanned:", decodedText);
    // Scanner'ı temizliyoruz
    handleClose();
  };

  const onScanFailure = (error: string) => {
    // Hata mesajlarını console'a yazdırıyoruz
    console.error(`QR Code scanning error: ${error}`);
  };

  // onClose metodunu güncelledik, böylece artık Html5QrcodeScanner instance'ını temizleyebilir
  const handleClose = () => {
    console.log('BarcodeScanner handleClose called.');

    html5QrCodeRef.current?.clear();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40" onClick={handleClose}>
      <div className="bg-white p-1 rounded-lg shadow-lg text-black z-50 w-64 h-64" onClick={(e) => e.stopPropagation()}>
        <div id="qr-reader"></div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
