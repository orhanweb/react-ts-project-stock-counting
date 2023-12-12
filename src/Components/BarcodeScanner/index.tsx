import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

interface BarcodeScannerProps {
  onClose: () => void;
  setBarcodeValue: React.Dispatch<React.SetStateAction<string>>;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onClose, setBarcodeValue }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
  const [barcodeReadError, setBarcodeReadError] = useState(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        setCameraPermissionDenied(false); // Reset the permission state
        setBarcodeReadError(false); // Reset the read error state
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          codeReader.decodeFromVideoElement(videoRef.current)
            .then((result) => {
              setBarcodeValue(result.getText());
              closeScanner();
            })
            .catch((_) => {
              setBarcodeReadError(true); // Set read error state to true
            });
        }
      })
      .catch((_) => {
        setCameraPermissionDenied(true); // Set permission state to denied
      });

    return () => {
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
      <div className="overflow-hidden p-2 rounded-lg shadow-lg bg-background-lightest text-text-darkest dark:bg-background-darker dark:text-text-lightest z-50 w-[90%] max-h-[75%] md:w-[75%] md:max-h-[75%] lg:max-w-[50%] lg:max-h-[75%] flex flex-col justify-center items-center m-2 transition-all duration-300 ease-in-out" onClick={(e) => e.stopPropagation()}>
        {cameraPermissionDenied ? (
          <p>Lütfen Kamera İzni Verin</p>
        ) : (
          <>
            <video ref={videoRef} className='rounded-lg'/>
            {barcodeReadError && <p className="text-center mt-2">Barkod Okunamadı Tekrar Deneyin</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default BarcodeScanner;
