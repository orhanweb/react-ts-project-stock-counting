import React, { createContext, useState, ReactNode } from 'react';
import Notification from '../Components/Notification';
import { NotificationProps, NotificationType } from '../Components/Notification/index.d';

// Context için interface tanımı
interface INotificationContext {
  addNotification: (message: string, type: NotificationType) => void;
}

export const NotificationContext = createContext<INotificationContext | null>(null);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const removeNotification = (id: number) => {
    setNotifications(notifications => notifications.filter(notification => notification.id !== id));
  };

  const addNotification = (message: string, type: NotificationType) => {
    const id = new Date().getTime();
    setNotifications(prev => {
      const newNotification = { id, message, type, removeSelf: removeNotification };
      const newNotifications = [newNotification, ...prev];

      // Listenin boyutu 3'ten büyükse, 3. elemandan sonraki tüm bildirimleri sil
      if (newNotifications.length > 3) {
        newNotifications.slice(3).forEach(notification => notification.removeSelf(notification.id));
      }
      
      return newNotifications;
    });
  };

   return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="z-50 absolute top-5 left-1/2 transform -translate-x-1/2 w-5/6 sm:w-auto sm:translate-x-0 sm:right-5 space-y-2 flex flex-col sm:items-end items-center">
        
        {notifications.map((notification) => (
          <Notification key={notification.id} {...notification} />
          ))}
      </div>
    </NotificationContext.Provider>
  );
};
