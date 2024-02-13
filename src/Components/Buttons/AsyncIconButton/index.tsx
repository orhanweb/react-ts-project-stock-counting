import React, { ButtonHTMLAttributes } from 'react';
import { IconType } from 'react-icons/lib';
import { RotatingLines } from 'react-loader-spinner';

interface AsyncIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  title?: string; // Optional title prop
  Icon?: IconType; // Opsiyonel bir Icon prop'u, react-icons'tan herhangi bir ikon olabilir
  iconSize?: number; // İkon boyutu için opsiyonel bir prop
}

const AsyncIconButton: React.FC<AsyncIconButtonProps> = ({ isLoading = false, title, Icon, iconSize = 20, children, ...props}) => {
  if (!title && !Icon && !children) return null;

  return (
    <button
      {...props}
      className={`${isLoading ? "bg-background-light dark:bg-background cursor-not-allowed" : "bg-primary-light dark:bg-primary-darkest hover:bg-primary dark:hover:bg-primary"} min-w-[100px] py-2 px-4 rounded-lg text-text-darkest dark:text-text-lightest transition-all duration-300 ease-in-out ${props.className}`}
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
        : children ? children 
        : (
          <div className="flex items-center justify-center gap-1">
            {Icon && React.createElement(Icon, { size: iconSize })}
            {title && <span>{title}</span>}
          </div>
        )}
    </button>
  );
};

export default AsyncIconButton;
