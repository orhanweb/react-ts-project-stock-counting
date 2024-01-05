import React, { useEffect } from 'react';
import { NotificationProps, NotificationType } from "../../Components/Notification/index.d";
import { MdError} from "react-icons/md";
import { PiInfoFill } from "react-icons/pi";
import { HiCheckCircle } from "react-icons/hi";

const NOTIFICATION_TIMEOUT = 3000; // 3 saniyelik zaman aşımı süresi

// İkon Fonksiyonu
const getIconForType = (type: NotificationType) => {
    switch (type) {
      case NotificationType.Warning:
        return <MdError className="text-2xl" />;
      case NotificationType.Info:
        return <PiInfoFill className="text-2xl" />;
      case NotificationType.Error:
        return <MdError className="text-2xl" />;
      case NotificationType.Success:
        return <HiCheckCircle className="text-2xl" />;
      default:
        return null;
    }
};
  
// Arka Plan Rengi Fonksiyonu
const getBackgroundColorForType = (type: NotificationType) => {
  switch (type) {
    case NotificationType.Warning:
      return 'bg-warning';
    case NotificationType.Info:
      return 'bg-info';
    case NotificationType.Error:
      return 'bg-error';
    case NotificationType.Success:
      return 'bg-success';
    default:
      return 'bg-background';
  }
};
  
// Notification Bileşeni
const Notification: React.FC<NotificationProps> = ({ id, message, type, removeSelf }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeSelf(id);
    }, NOTIFICATION_TIMEOUT);
    return () => clearTimeout(timer);
  }, [removeSelf]);
  
  return (
    <div id={`notification-${id}`} className={`flex items-center py-1 pl-1 pr-2 ${getBackgroundColorForType(type)} rounded-lg text-text-lightest w-fit max-w-md`}>
      <div className="flex-shrink-0"> 
        {getIconForType(type)}
      </div>      
      <span className="ml-1 break-words">{message}</span>
    </div>
  );
};

export default Notification;
