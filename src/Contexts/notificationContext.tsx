import React, { createContext, useState, ReactNode, useEffect } from "react";
import Notification from "../Components/Notification";
import {
  NotificationProps,
  NotificationType,
} from "../Components/Notification/index.d";
import { AnimatePresence } from "framer-motion";

const NOTIFICATION_TIMEOUT = 3000; // 3 second timeout period

// Interface definition for context
interface INotificationContext {
  addNotification: (message: string, type: NotificationType) => void;
}

export const NotificationContext = createContext<INotificationContext | null>(
  null
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const removeNotification = (id: string) => {
    setNotifications((notifications) =>
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const addNotification = (message: string, type: NotificationType) => {
    const randomPart = Math.floor(Math.random() * 10000000);
    const timestamp = new Date().getTime();
    const id = `${timestamp}-${randomPart}`;
    const newNotification = { id, message, type };

    setNotifications((prev) => [newNotification, ...prev]);
    setTimeout(() => removeNotification(id), NOTIFICATION_TIMEOUT);
  };

  useEffect(() => {
    if (notifications.length > 5) {
      setNotifications(notifications.slice(0, 5));
    }
  }, [notifications]);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="z-[150] absolute top-5 left-1/2 transform -translate-x-1/2 w-5/6 sm:w-auto sm:translate-x-0 sm:left-auto sm:right-5 space-y-2 flex flex-col sm:items-end items-center">
        <AnimatePresence>
          {notifications.map((notification) => (
            <Notification key={notification.id} {...notification} />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
