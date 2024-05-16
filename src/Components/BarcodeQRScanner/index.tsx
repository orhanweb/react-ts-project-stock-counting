import React, { useEffect, useRef, useState } from "react";
import { useNotifications } from "../../Hooks/useNotifications";
import { NotificationType } from "../Notification/index.d";
import AutoSelect from "../AutoSelect";
import Quagga from "@ericblade/quagga2"; // 1. Quagga2'yi import etme

interface BarcodeQRScannerProps {
  onClose: () => void;
}

const BarcodeQRScanner: React.FC<BarcodeQRScannerProps> = ({ onClose }) => {
  const { addNotification } = useNotifications();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  // Kamera akışını başlatma fonksiyonu
  const startCamera = (deviceId?: string | null) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraPermissionDenied(true);
      addNotification(
        "getUserMedia API'si bu tarayıcıda desteklenmiyor.",
        NotificationType.Warning
      );
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        video: {
          deviceId: deviceId ?? undefined,
          facingMode: deviceId ? undefined : "environment",
        },
      })
      .then((stream) => {
        setCameraPermissionDenied(false);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        startQuagga();
      })
      .catch((_) => {
        setCameraPermissionDenied(true);
        addNotification("Kamera izni reddedildi.", NotificationType.Error);
      });
  };

  // Quagga'yı başlatma fonksiyonu
  const startQuagga = () => {
    if (videoRef.current) {
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            target: videoRef.current,
            constraints: {
              facingMode: "environment",
            },
          },
          decoder: {
            readers: [
              "code_128_reader",
              "ean_reader",
              "ean_8_reader",
              "code_39_reader",
              "code_39_vin_reader",
              "codabar_reader",
              "upc_reader",
              "upc_e_reader",
              "i2of5_reader",
            ],
          },
        },
        (err) => {
          if (err) {
            console.error(err);
            return;
          }
          Quagga.start();
        }
      );

      Quagga.onDetected((result) => {
        console.log("Barkod tespit edildi: ", result.codeResult.code); // 3. Barkodları konsola yazdırma
      });
    }
  };

  // Kamera akışını durdurma fonksiyonu
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    Quagga.stop(); // 2. Quagga2'yi durdurma
  };

  // Kamera cihazlarını listeleme ve başlangıçta kamera akışını başlatma
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      setCameraPermissionDenied(true);
      addNotification(
        "enumerateDevices API'si bu tarayıcıda desteklenmiyor.",
        NotificationType.Warning
      );
      return;
    }

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);
    });

    startCamera(selectedDeviceId);

    return () => {
      stopCamera();
    };
  }, [selectedDeviceId]);

  // Bileşeni kapatma fonksiyonu
  const closeScanner = () => {
    stopCamera();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100]"
      onClick={closeScanner}
    >
      <div
        className="overflow-hidden p-2 rounded-lg shadow-lg bg-background-lightest text-text-darkest dark:bg-background-darker dark:text-text-lightest z-50 w-[90%] max-h-[75%] md:w-[75%] md:max-h-[75%] lg:max-w-[50%] lg:max-h-[75%] flex flex-col justify-center items-center m-2 transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        {!navigator.mediaDevices ||
        !navigator.mediaDevices.enumerateDevices ||
        !navigator.mediaDevices.getUserMedia ? (
          <p>
            Tarayıcınız kamera erişimi veya medya cihazlarını listeleme
            API'lerini desteklemiyor.
          </p>
        ) : cameraPermissionDenied ? (
          <p>Lütfen Kamera İzni Verin</p>
        ) : (
          <div className="flex flex-col gap-2">
            <video ref={videoRef} autoPlay playsInline className="rounded-lg" />
            <AutoSelect
              placeholder={"Kamera Seç..."}
              options={devices.map((device) => ({
                value: device.deviceId,
                label: device.label || `Camera ${device.deviceId}`,
              }))}
              onChange={(selectedOption) => {
                const value = (selectedOption as { value: string }).value;
                setSelectedDeviceId(value);
              }}
              value={
                devices
                  .map((device) => ({
                    value: device.deviceId,
                    label: device.label || `Camera ${device.deviceId}`,
                  }))
                  .find((option) => option.value === selectedDeviceId) || null
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BarcodeQRScanner;
