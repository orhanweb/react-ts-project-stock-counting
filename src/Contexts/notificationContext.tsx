import React, { createContext, useState, ReactNode } from 'react';
import Notification from '../Components/Notification';

// Notification türünü belirleme
interface INotification {
  id: number;
  message: string;
  type: NotificationType;
}

// Bildirim tiplerini enum olarak tanımlama
export enum NotificationType {
  Warning = 'warning',
  Info = 'info',
  Error = 'error',
  Success = 'success'
}
const NOTIFICATION_TIMEOUT = 3000; // 3 saniyelik zaman aşımı süresi

// Context için interface tanımı
interface INotificationContext {
  addNotification: (message: string, type: NotificationType) => void;
}

export const NotificationContext = createContext<INotificationContext | null>(null);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const removeNotification = (id: number) => {
    setNotifications(notifications => notifications.filter(notification => notification.id !== id));
  };

  const addNotification = (message: string, type: NotificationType) => {
    const id = new Date().getTime();
    setNotifications(prev => {
      const newNotifications = [{ id, message, type }, ...prev];
      if (newNotifications.length > 3) {
        newNotifications.length = 3; // En fazla 3 bildirim tut
      }
      return newNotifications;
    });

    setTimeout(() => removeNotification(id), NOTIFICATION_TIMEOUT);
  };

   return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="absolute top-5 right-5 space-y-2">
        {notifications.map((notification) => (
          <Notification key={notification.id} message={notification.message} type={notification.type} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
