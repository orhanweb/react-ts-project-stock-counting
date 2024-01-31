import React, { ButtonHTMLAttributes } from 'react';
import { RotatingLines } from 'react-loader-spinner';

// Buton prop tiplerini tanımlıyoruz.
interface AsyncButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
}

// AsyncButton bileşenini tanımlıyoruz.
const AsyncButton: React.FC<AsyncButtonProps> = ({ isLoading, children, ...props }) => {
  return (
    <button
      {...props}
      className={`${isLoading ? "bg-background-light dark:bg-background cursor-not-allowed" : "bg-primary-light dark:bg-primary-darker hover:bg-primary dark:hover:bg-primary-darkest"} min-w-[100px] py-2 px-4 rounded-xl text-text-darkest dark:text-text-lightest  transition-all duration-300 ease-in-out ${props.className}`}
      disabled={isLoading}
    >
      {isLoading 
        ? <div className='flex items-center justify-center'>
            <RotatingLines 
                visible={true}
                width="25" 
                strokeColor="var(--spinner-color)"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"/>
            </div>
        : children}
    </button>
  );
};

export default AsyncButton;
