// Loader.tsx
import React from 'react';
import { RotatingLines } from 'react-loader-spinner';

interface LoaderProps {
    isLoading: boolean;
    message?: string;
}

const Loader: React.FC<LoaderProps> = ({ isLoading, message }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-[200]">
            <div className='flex flex-col justify-center items-center gap-4'>
            <RotatingLines 
                visible={true}
                width="96" 
                strokeColor="#1dc46b" // Tailwind primary renk
                strokeWidth="3"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
            />
                <p className="text-text-lightest text-lg">{message || 'Yükleniyor...'}</p>
            </div>
        </div>
    );
};

export default Loader;
