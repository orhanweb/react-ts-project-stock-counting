import { NotificationType } from "../../Contexts/notificationContext";
import { MdError} from "react-icons/md";
import { PiInfoFill } from "react-icons/pi";
import { HiCheckCircle } from "react-icons/hi";

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
const Notification: React.FC<{ message: string; type: NotificationType }> = ({ message, type }) => {
    return (
      <div className={`flex items-center py-1 pl-1 pr-2 ${getBackgroundColorForType(type)} rounded-full text-text-lightest`}>
        {getIconForType(type)}
        <span className="ml-1">{message}</span>
      </div>
    );
};

export default Notification;
