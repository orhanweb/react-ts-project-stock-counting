import React, { useEffect, useRef, useState } from "react";
import { useNotifications } from "../../Hooks/useNotifications";
import { NotificationType } from "../Notification/index.d";
import AutoSelect from "../AutoSelect";
import { FaTimesCircle } from "react-icons/fa";

import "../../dynamsoft.config";
import { CameraEnhancer, CameraView } from "dynamsoft-camera-enhancer";
import { CaptureVisionRouter } from "dynamsoft-capture-vision-router";
import { MultiFrameResultCrossFilter } from "dynamsoft-utility";

interface BarcodeQRScannerProps {
  onClose: () => void;
  onDetected: (data: string) => void;
}

const BarcodeQRScanner: React.FC<BarcodeQRScannerProps> = ({
  onClose,
  onDetected,
}) => {
  const { addNotification } = useNotifications();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  // Define state variables for Dynamsoft objects
  const cameraEnhancerRef = useRef<CameraEnhancer | null>(null);
  const cvRouterRef = useRef<CaptureVisionRouter | null>(null);

  useEffect(() => {
    const initializeDynamsoft = async () => {
      try {
        const cameraView = await CameraView.createInstance();
        cameraEnhancerRef.current = await CameraEnhancer.createInstance(
          cameraView
        );

        cvRouterRef.current = await CaptureVisionRouter.createInstance();
        cvRouterRef.current.setInput(cameraEnhancerRef.current);

        // Kamera open and start scanning
        await cameraEnhancerRef.current.open();
        await startScanning(cvRouterRef.current);

        // Manually start the camera stream and connect it to the video element
        await startCameraStream(videoRef, selectedDeviceId);
      } catch (error) {
        setCameraPermissionDenied(true);
        addNotification(
          `Bir hata oluştu. Lütfen barkod okuyucu kapatıp tekrar açın. ${error}`,
          NotificationType.Error
        );
      }
    };
    initializeDynamsoft();

    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    const changeCamera = async () => {
      if (cameraEnhancerRef.current && selectedDeviceId) {
        try {
          await cameraEnhancerRef.current.selectCamera(selectedDeviceId);
          await startCameraStream(videoRef, selectedDeviceId);
        } catch (error) {
          addNotification(
            `Kamera değiştirilirken bir hata oluştu. ${error}`,
            NotificationType.Error
          );
        }
      }
    };

    changeCamera();
  }, [selectedDeviceId]);

  // List camera devices and start camera streaming on startup
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      setCameraPermissionDenied(true);
      addNotification(
        "EnumerateDevices API'si bu tarayıcıda desteklenmiyor.",
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
  }, []);

  const startCameraStream = async (
    videoRef: React.RefObject<HTMLVideoElement>,
    selectedDeviceId: string | null
  ) => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedDeviceId ?? undefined,
          facingMode: selectedDeviceId ? undefined : "environment",
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }
  };

  // Scan start function
  const startScanning = async (cvRouterInstance: CaptureVisionRouter) => {
    if (!cvRouterInstance) return;

    cvRouterInstance.addResultReceiver({
      onDecodedBarcodesReceived: (result) => {
        if (!result.barcodeResultItems.length) return;
        const item = result.barcodeResultItems[0];
        handleDetected(item.text);
      },
    });

    const filter = new MultiFrameResultCrossFilter();
    filter.enableResultCrossVerification("barcode", true);
    filter.enableResultDeduplication("barcode", true);
    await cvRouterInstance.addResultFilter(filter);

    await cvRouterInstance.startCapturing("ReadSingleBarcode");
  };

  // Camera stream stop function
  const stopCamera = () => {
    if (cvRouterRef.current) {
      cvRouterRef.current.dispose();
      cvRouterRef.current = null;
    }
    if (cameraEnhancerRef.current) {
      cameraEnhancerRef.current.dispose();
      cameraEnhancerRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
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
        className="p-2 m-2 rounded-lg bg-background-lightest text-text-darkest dark:bg-background-darker dark:text-text-lightest w-fit md:w-fit md:max-w-[75%] lg:w-fit lg:max-w-[50%] flex flex-col justify-center items-center transition-all duration-300 ease-in-out"
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
            <video
              ref={videoRef}
              className="rounded-lg max-h-[60vh]"
              autoPlay
              playsInline
            />
            <div className="flex gap-2">
              <div className="w-full">
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
                      .find((option) => option.value === selectedDeviceId) ||
                    null
                  }
                />
              </div>
              <button onClick={closeScanner}>
                <FaTimesCircle
                  size={36}
                  className={"text-error hover:text-opacity-70"}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarcodeQRScanner;
