import React, { ButtonHTMLAttributes } from 'react';
import { IconType } from 'react-icons/lib';

interface ResponsiveIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  Icon?: IconType; 
  iconSize?: number; 
}

const ResponsiveIconButton: React.FC<ResponsiveIconButtonProps> = ({title, Icon, iconSize = 20, children, ...props}) => {
  if (!title && !Icon && !children) return null;

  return (
    <button
      {...props}
      className="flex items-center justify-center whitespace-nowrap w-fit rounded-full lg:w-full p-2 text-sm text-text-darkest dark:text-text-lightest transition-colors duration-300 bg-primary-lightest dark:bg-background-darkest border-2 border-transparent lg:rounded-lg hover:border-background-darker dark:hover:border-primary-lighter focus:outline-none"
    >
        <div className="flex items-center justify-center gap-1">
            {Icon && React.createElement(Icon, { size: iconSize })}
            {title && <span className='hidden lg:inline ml-2'>{title}</span>}
        </div>
    </button>
  );
};

export default ResponsiveIconButton;
