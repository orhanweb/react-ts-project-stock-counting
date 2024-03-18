import React, { FC, FormEvent } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import { DialogProps, DialogType } from "./index.d";

// Special classifications for specific modal cards
const dialogTypeClasses = {
  [DialogType.Danger]:
    "border-error bg-gradient-to-bl from-error/25 to-transparent",
  [DialogType.Info]:
    "border-info bg-gradient-to-bl from-info/40 to-transparent",
  [DialogType.Warning]:
    "border-warning bg-gradient-to-bl from-warning/30 to-transparent",
  [DialogType.Classic]:
    "border-primary bg-gradient-to-bl from-primary/30  to-transparent",
};

const dialogButtonClasses = {
  [DialogType.Danger]: "border-error bg-error/10 text-error hover:bg-error",
  [DialogType.Info]: "border-info bg-text-darker/10 text-info hover:bg-info",
  [DialogType.Warning]:
    "border-warning bg-warning/10 text-warning hover:bg-warning",
  [DialogType.Classic]:
    "border-primary bg-primary/10 text-primary-darkest dark:text-primary-lightest hover:bg-primary",
};

const Dialog: FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showCancelButton = false,
  onConfirm,
  onCancel,
  isSmallDialog = false,
  isDeactivateCloseAfterConfirm = false,
  cancelButtonLabel = "Vazgeç",
  confirmButtonLabel = "Onayla",
  dialogType = DialogType.Classic,
}) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onConfirm?.();
    if (!isDeactivateCloseAfterConfirm) {
      onClose();
    }
  };
  //
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key={"dialog"}
          id="dialog"
          className="fixed inset-0 z-[100] backdrop-blur-sm flex justify-center items-center"
          onClick={handleOverlayClick}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
        >
          <motion.div
            key={"dialog-card"}
            id="dialog-card"
            className={`p-4 rounded-xl shadow-2xl mx-2 w-full sm:w-3/4 lg:w-[800px] bg-background-lightest dark:bg-background-darkest dark:text-text-lightest text-black border-2 ${dialogTypeClasses[dialogType]}`}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 400, scale: 0.3 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.3 },
            }}
            exit={{
              opacity: 0,
              y: 400,
              scale: 0.5,
              transition: { duration: 0.3 },
            }}
          >
            <div
              id="dialog-header"
              className="flex justify-between items-center"
            >
              {/* Dialog Title */}
              <h2 className="text-xl">{title}</h2>
              {/* Dialog Close Button */}
              <button className="cursor-pointer" onClick={onClose}>
                <IoCloseCircle
                  size={36}
                  className={"text-error hover:text-opacity-70"}
                />
              </button>
            </div>
            {/* Divider */}
            <hr className="border-t border-background mt-2 mb-4 w-full" />
            {/* Dialog Content */}
            <form onSubmit={handleSubmit}>
              <div
                className={`max-h-[50vh] ${
                  isSmallDialog ? "overflow-visible" : "overflow-auto"
                }`}
              >
                {children}
              </div>
              {/* Dialog Buttons */}
              <div className="flex justify-end mt-4 space-x-3">
                {showCancelButton && (
                  <button
                    type="button"
                    className={`border border-background/50 text-text-darkest dark:text-text-lightest hover:bg-background/50 hover:text-text-lightest py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out `}
                    onClick={handleCancel}
                  >
                    {cancelButtonLabel}
                  </button>
                )}
                {onConfirm && (
                  <button
                    type="submit"
                    className={`border py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out hover:text-text-lightest ${dialogButtonClasses[dialogType]}`}
                  >
                    {confirmButtonLabel}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Dialog;
