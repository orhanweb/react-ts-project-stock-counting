import React, { FC } from 'react';
import { IoCloseCircle } from "react-icons/io5";
import { AnimatePresence, motion } from 'framer-motion';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    showCancelButton?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
    cancelButtonLabel?: string;
    confirmButtonLabel?: string;
}

const Dialog: FC<DialogProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    showCancelButton = false, 
    onConfirm, 
    onCancel, 
    cancelButtonLabel = "Vazgeç", 
    confirmButtonLabel = "Onayla" 
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

    const handleConfirm = () => {
        onConfirm?.();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key={'dialog'}
                    id='dialog'
                    className="fixed inset-0 z-[100] backdrop-blur-sm flex justify-center items-center"
                    onClick={handleOverlayClick}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, transition: { duration: 0.3} }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3} }}
                >
                    <motion.div
                        key={'dialog-card'}
                        id='dialog-card'
                        className="bg-background-lightest dark:bg-background-darkest dark:text-text-lightest text-black p-4 rounded-xl shadow-2xl mx-10 sm:mx-0 w-full sm:w-3/4 md:w-1/2 lg:w-[500px] max-h-[70%] overflow-auto"
                        onClick={e => e.stopPropagation()}
                        initial={{ opacity: 0, y: 400, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } }}
                        exit={{ opacity: 0, y: 400, scale: 0.5, transition: { duration: 0.3 } }}
                    >
                        <div id='dialog-header' className='flex justify-between items-center'>
                            {/* Dialog Title */}
                            <h2 className="text-xl">{title}</h2>
                            {/* Dialog Close Button */}
                            <button className="cursor-pointer" onClick={onClose}>
                                <IoCloseCircle size={36} className={'text-error hover:text-opacity-70'} />
                            </button>
                        </div>
                        {/* Divider */}
                        <hr className="border-t border-background my-2 w-full" />
                        {/* Dialog Content */}
                        <div>{children}</div>
                        {/* Dialog Buttons */}
                        <div className="flex justify-end mt-4 space-x-3">
                            {showCancelButton && (
                                <button className="border border-error text-error hover:bg-error hover:text-text-lightest py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out" onClick={handleCancel}>
                                    {cancelButtonLabel}
                                </button>
                            )}
                            {onConfirm && (
                                <button className="bg-primary hover:bg-primary-darker text-text-lightest py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out" onClick={handleConfirm}>
                                    {confirmButtonLabel}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Dialog;