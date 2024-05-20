import React, { useEffect, useRef, useState } from "react";
import { useNotifications } from "../../Hooks/useNotifications";
import { NotificationType } from "../Notification/index.d";
import AutoSelect from "../AutoSelect";
import Quagga from "@ericblade/quagga2";
import jsQR from "jsqr";

interface BarcodeQRScannerProps {
  onClose: () => void;
  onDetected: (data: string) => void;
}

let qrInterval: NodeJS.Timeout;

const BarcodeQRScanner: React.FC<BarcodeQRScannerProps> = ({
  onClose,
  onDetected,
}) => {
  const { addNotification } = useNotifications();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  // List camera devices and start camera streaming on startup
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

  // Camera stream start function
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
        startScanning();
      })
      .catch((_) => {
        setCameraPermissionDenied(true);
        addNotification("Kamera izni reddedildi.", NotificationType.Error);
      });
  };

  // Camera stream stop function
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    Quagga.stop();
    clearInterval(qrInterval);
  };

  // Initialization function of both barcode and QR code scanning function
  const startScanning = () => {
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
              "2of5_reader",
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
      // Barcode scanning is done here
      Quagga.onDetected((result) => {
        const code = result?.codeResult?.code;
        if (code) {
          handleDetected(code);
        }
      });
      // QR code scanning is called here
      qrInterval = setInterval(() => {
        if (videoRef.current) {
          const canvas = document.createElement("canvas");
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const context = canvas.getContext("2d");
          if (context) {
            context.drawImage(
              videoRef.current,
              0,
              0,
              canvas.width,
              canvas.height
            );
            const imageData = context.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            scanQRCode(imageData);
          }
        }
      }, 150);
    }
  };
  // QR code scanning is done here
  const scanQRCode = (imageData: ImageData) => {
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code?.data) {
      handleDetected(code.data);
    }
  };

  // When there is any scanning
  const handleDetected = (data: string) => {
    closeScanner();
    onDetected(data);
  };

  // Component shutdown function
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
        className="overflow-hidden p-2 rounded-lg shadow-lg bg-background-lightest text-text-darkest dark:bg-background-darker dark:text-text-lightest z-50 w-fit max-h-[75%] md:w-fit md:max-w-[75%] md:max-h-[75%] lg:w-fit lg:max-w-[50%] lg:max-h-[75%] flex flex-col justify-center items-center m-2 transition-all duration-300 ease-in-out"
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
