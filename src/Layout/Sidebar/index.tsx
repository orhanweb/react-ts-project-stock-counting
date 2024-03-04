import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { SidebarLinkProps } from './index.d';
import { LuClipboardEdit } from "react-icons/lu";
import {BsViewList } from 'react-icons/bs';
import { MdAssignmentAdd,MdOutlineAssignment } from "react-icons/md";

import ThemeToggle from './ThemeToggle';
import LogoComponent from '../../Components/LogoComponent';
import LanguageToggle from './LanguageToggle';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center sm:justify-center lg:justify-normal px-4 sm:px-0 lg:px-4 py-2 rounded-lg transition ease-in-out duration-300
   text-text-darkest bg-primary-lightest bg-opacity-0 dark:text-text-lightest dark:bg-primary-darkest dark:bg-opacity-0
  ${
    isActive
      ? 'bg-opacity-100 dark:bg-opacity-100 '
      : 'hover:bg-opacity-75 dark:hover:bg-opacity-50'
  }`;

const SidebarLink: React.FC<SidebarLinkProps & { toggleSidebar: (isOpen: boolean) => void }> = ({ to, label, icon, toggleSidebar }) => (
    <NavLink to={to} className={linkClass} onClick={() => toggleSidebar(false)} >
      <div className="flex items-center justify-center w-full" title={label}>
      {React.cloneElement(icon, { size: '20px' })}
      <span className="flex-1 truncate sm:hidden lg:inline ml-2">{label}</span>
      </div>
    </NavLink>
  );

const Sidebar: React.FC<{ isSidebarOpen: boolean, toggleSidebar: (isOpen: boolean) => void  }> = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();

  const sidebarLinks = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(segment => segment.length > 0);
    const baseLinks: SidebarLinkProps[] = [
      { to: '/', label: 'Sayım Oluştur', icon: <LuClipboardEdit /> },
      { to: '/view-counts', label: 'Sayımları Görüntüle', icon: <BsViewList /> },
    ];

    if (pathSegments[0] === 'count' && pathSegments[1]) {
      const countID = pathSegments[1];
      baseLinks.push(
        { to: `/count/${countID}/addProduct`, label: 'Ürün Ekle', icon: <MdAssignmentAdd /> },
        { to: `/count/${countID}/view-counted`, label: 'Sayılanları Göster', icon: <MdOutlineAssignment /> },
      );
    }

    return baseLinks;
  }, [location.pathname]);
  
  return (
    <aside className={`fixed inset-y-0 left-0 w-64 sm:w-12 lg:w-64 z-30 transition-width duration-500 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:relative sm:translate-x-0 sm:block`} aria-label="Sidebar">
      <div className="flex flex-col items-start justify-between w-full h-full py-2 px-3 sm:px-1 lg:px-3 bg-primary-light dark:bg-background-darker transition-colors duration-300 ease-in-out">
        {/* Logo and Header Part */}
        <div className='w-full'>
          <LogoComponent toggleSidebar={toggleSidebar}/>
          <hr className="w-full mx-auto border rounded-full my-3 border-y-2 border-background-darkest dark:border-background-lightest transition-all duration-300" />
        </div>
        {/* Navigation Part - Scrollable */}
        <div className="flex-1 w-full overflow-y-auto">
          <ul className="space-y-2">
            {sidebarLinks.map((link) => (
              <SidebarLink key={link.to} to={link.to} label={link.label} icon={link.icon} toggleSidebar={toggleSidebar} />
            ))}
          </ul>
        </div>
        {/* Footer Part */}
        <div className="w-full flex flex-col gap-2 items-center">
          <LanguageToggle toggleSidebar={toggleSidebar}/>
          <ThemeToggle toggleSidebar={toggleSidebar}/>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;