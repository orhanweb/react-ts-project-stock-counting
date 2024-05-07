import { useEffect } from "react";
import { NotificationType } from "../Components/Notification/index.d";
import { useNotifications } from "../Hooks/useNotifications";

interface ErrorConfig {
  error: any;
  message: string;
}

// Custom hook to manage error notifications
export const useErrorManager = (errors: ErrorConfig[]) => {
  const { addNotification } = useNotifications();

  useEffect(
    () => {
      errors.forEach(({ error, message }) => {
        if (error) {
          addNotification(`${message}: ${error.error}`, NotificationType.Error);
        }
      });
    },
    errors.map((e) => e.error)
  );
};
