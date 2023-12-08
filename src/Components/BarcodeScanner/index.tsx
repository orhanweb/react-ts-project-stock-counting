import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
 
interface BarcodeScannerProps {
  onClose: () => void;
  setBarcodeValue: React.Dispatch<React.SetStateAction<string>>;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onClose, setBarcodeValue }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          codeReader.decodeFromVideoElement(videoRef.current)
            .then((result) => {
              setBarcodeValue(result.getText());
              closeScanner();  
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () =>  {
      codeReader.reset();
    }
  }, []);

   
  const closeScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40" onClick={closeScanner}>
      <div className="p-2 rounded-lg shadow-lg bg-background-lightest text-text-darkest dark:bg-background-darker dark:text-text-lightest z-50 w-auto m-2" onClick={(e) => e.stopPropagation()}>
        <video ref={videoRef}/>
      </div>
    </div>
  );
};

export default BarcodeScanner;
