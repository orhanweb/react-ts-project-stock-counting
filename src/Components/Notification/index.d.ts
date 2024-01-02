// Notification türünü belirleme
export interface NotificationProps {
    id: number;
    message: string;
    type: NotificationType;
    removeSelf: (id: number) => void;
}

// Bildirim tiplerini enum olarak tanımlama
export enum NotificationType {
    Warning = 'warning',
    Info = 'info',
    Error = 'error',
    Success = 'success'
}