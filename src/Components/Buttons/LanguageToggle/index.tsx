import React from 'react';

const LanguageToggle: React.FC<{}> = ({}) => {


  return (
    <button
      onClick={()=>{}}
      className="flex items-center justify-center whitespace-nowrap w-full p-2 text-sm text-text-darkest dark:text-text-lightest transition-colors duration-300 bg-primary-lightest dark:bg-background-darkest border-2 border-transparent rounded-lg hover:border-background-darker dark:hover:border-primary-lighter focus:outline-none"
    >
     
      <span className="sm:hidden lg:inline ml-2">{'Dil Seç'}</span>
    </button>
  );
};

export default LanguageToggle;
