import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoComponent: React.FC<{toggleSidebar: (isOpen: boolean) => void}> = ({toggleSidebar}) => {
  let navigate = useNavigate();

  return (

     <a
     href="/"
     onClick={(e) => {
       e.preventDefault();
       navigate('/');
       toggleSidebar(false);
     }}
     className="w-full flex flex-col p-2 items-center cursor-pointer rounded-lg hover:bg-primary-lightest dark:hover:bg-primary-darkest transition-colors duration-300"
     aria-label="Ana Sayfaya Git"
     title="Ana Sayfaya Git"
   >
     <LogoIcon className="fill-text-darkest dark:fill-primary transition-all duration-300 h-24 sm:h-12  lg:h-24" />
     <span className="text-lg font-bold mt-2 text-text-darkest dark:text-primary transition-color duration-300 sm:hidden lg:block whitespace-nowrap">Stok Sayım</span>
   </a>
  );
};

export default LogoComponent;


interface LogoIconProps {
  className?: string
}

const LogoIcon: React.FC<LogoIconProps> = ({className}) => {

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1"
      viewBox="325 200 396 618"
      className={className} 
    >
      <path
        d="M6454 7897l-242-322 144-3 144-3v-199c0-110 2-200 5-200 2 0 48 24 102 54 54 29 143 78 198 108l100 55 3 91 3 91 145 3 145 3-186 240c-102 132-214 277-248 323-34 45-64 82-67 82-3-1-114-146-246-323zM5009 7740c-361-23-771-173-1058-388-110-83-286-263-363-372-130-183-242-435-282-633-23-112-39-323-32-422 26-345 135-615 343-845 231-257 409-351 1120-594 495-169 747-277 877-375l66-50v1168l-167 55c-93 30-249 80-347 111-334 106-467 174-576 292-265 290-184 729 169 912 124 64 198 83 349 88l132 6v1057l-57-1c-32-1-110-5-174-9z"
        transform="matrix(.1 0 0 -.1 0 1024)"
      ></path>
      <path
        d="M5420 7190c0-473 2-540 15-540s15 67 15 540-2 540-15 540-15-67-15-540zM5630 7141v-549l53-18c74-24 247-106 300-142l44-31 7 61c3 33 6 294 6 579v519l-37 18c-75 37-312 112-354 112-18 0-19-18-19-549zM6705 7076l-200-114-2-949-2-948 76-54c93-67 200-153 272-220 30-28 56-49 58-48 2 2 2 553 1 1225l-3 1222-200-114zM5254 6321c-2-2-4-174-4-381v-376l98-29c53-16 150-48 215-71l117-41v904l-211-1c-116-1-212-3-215-5zM5928 6023l-38-4v-684l93-34c50-19 145-57 210-86l117-53-2 432-3 431-170 1c-93 0-187-1-207-3zM5890 4419c0-774-3-820-50-926-31-69-110-159-165-189l-35-19v-567c0-326 4-568 9-568 29 0 217 56 304 91 132 52 246 113 382 204 292 195 477 429 622 784 76 188 115 458 95 653-49 460-278 801-705 1044-100 58-165 88-374 178l-83 35v-720zM3600 3654v-695l78 42c42 23 118 65 167 94 50 29 109 62 133 74l42 21v1160h-420v-696zM4830 3171V2102l23-6c29-8 351-8 371 0 14 6 16 103 16 1000 0 938-1 995-17 1001-10 3-99 37-197 75-99 37-183 68-188 68-4 0-8-481-8-1069zM4210 3680c0-209 4-380 8-380 5 0 65 33 134 73 68 39 159 90 201 112l77 40v535h-420v-380zM4475 3237c-83-45-176-98-208-117l-57-35 2-450 3-450 160-31c88-17 181-34 208-37l47-7v605c0 333-1 605-3 605-1 0-70-37-152-83zM5420 2680c0-500 2-570 15-570s15 70 15 570-2 570-15 570-15-70-15-570zM3935 2943c-44-25-137-80-207-121l-128-75v-199c0-109 1-198 3-198s89-25 192-55c104-30 197-55 207-55 17 0 18 22 18 375 0 206-1 375-2 375-2 0-39-21-83-47z"
        transform="matrix(.1 0 0 -.1 0 1024)"
      ></path>
    </svg>
  );
}