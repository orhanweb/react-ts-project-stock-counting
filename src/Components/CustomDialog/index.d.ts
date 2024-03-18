export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showCancelButton?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  dialogType?: DialogType;
  isSmallDialog?: boolean;
  cancelButtonLabel?: string;
  confirmButtonLabel?: string;
  isDeactivateCloseAfterConfirm?: boolean;
}

export enum DialogType {
  Classic,
  Info,
  Warning,
  Danger,
}
