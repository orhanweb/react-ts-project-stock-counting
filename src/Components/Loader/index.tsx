// Loader.tsx
import React from 'react';
import { RotatingLines } from 'react-loader-spinner';

interface LoaderProps {
    isLoading: boolean;
    messages?: string[];
}

const Loader: React.FC<LoaderProps> = ({ isLoading, messages }) => {
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
                {messages && messages.length > 0 ? (
                  messages.map((message, index) => (
                    <p key={index} className="text-text-lightest text-lg">{message}</p>
                  ))
                ) : (
                  <p className="text-text-lightest text-lg">Yükleniyor...</p>
                )}
            </div>
        </div>
    );
};

export default Loader;
