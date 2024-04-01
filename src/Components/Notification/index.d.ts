// Determining Notification type
export interface NotificationProps {
  id: number;
  message: string;
  type: NotificationType;
}

// Defining notification types as enum
export enum NotificationType {
  Warning = "warning",
  Info = "info",
  Error = "error",
  Success = "success",
}
