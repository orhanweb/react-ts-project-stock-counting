import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { SidebarLinkProps } from './index.d';
import {SlNote } from 'react-icons/sl';
import {BsViewList } from 'react-icons/bs';
import {FaBarcode, FaCheckSquare } from 'react-icons/fa';

import ThemeToggle from '../../Components/ThemeToggle';
import LogoComponent from '../../Components/LogoComponent';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `whitespace-nowrap flex items-center sm:justify-center lg:justify-normal px-4 py-2 rounded-lg transition ease-in-out duration-300
   text-text-darkest bg-primary-lightest bg-opacity-0 dark:text-text-lightest dark:bg-primary-darkest dark:bg-opacity-0
  ${
    isActive
      ? 'bg-opacity-100 dark:bg-opacity-100 '
      : 'hover:bg-opacity-75 dark:hover:bg-opacity-50'
  }`;

const SidebarLink: React.FC<SidebarLinkProps & { toggleSidebar: (isOpen: boolean) => void }> = ({ to, label, icon, toggleSidebar }) => (
    <NavLink to={to} className={linkClass} onClick={() => toggleSidebar(false)} >
      <div className="flex items-center" title={label}>
      {React.cloneElement(icon, { size: '20px' })}
      <span className="sm:hidden lg:inline ml-2">{label}</span> {/* 'lg:inline' sınıfı ekleyerek 'lg' breakpoint'ten itibaren etiketleri göster */}
      </div>
    </NavLink>
  );

// Yönetici (Manager) için sidebar linkleri
const managerSidebarLinks: SidebarLinkProps[] = [
  { to: '/manager/create-counts', label: 'Sayım Oluştur', icon: <SlNote /> },
  { to: '/manager/view-counts', label: 'Sayımları Görüntüle', icon: <BsViewList /> },
];

// Sayım için sidebar linkleri
const countSidebarLinks: SidebarLinkProps[] = [
  { to: '/count/products', label: 'Ürün Say', icon: <FaBarcode /> },
  { to: '/count/show-counted', label: 'Sayılanları Göster', icon: <FaCheckSquare /> },
];

const Sidebar: React.FC<{ isSidebarOpen: boolean, toggleSidebar: (isOpen: boolean) => void  }> = ({ isSidebarOpen,toggleSidebar  }) => {
  const location = useLocation();

  const links = useMemo(() => {
    if (location.pathname.startsWith('/count/')) {
      return countSidebarLinks;
    } else if (location.pathname.startsWith('/manager/')) {
      return managerSidebarLinks;
    }
    return [];
  }, [location.pathname]);

  return (
    <aside className={`fixed inset-y-0 left-0 w-64 sm:w-12 lg:w-64 h-full z-30 transition-width duration-500 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:relative sm:translate-x-0 sm:block`} aria-label="Sidebar">
      <div className="flex flex-col h-full py-2 px-3 sm:px-1 lg:px-3 bg-primary-light dark:bg-background-darker transition-colors duration-300 ease-in-out">
        <LogoComponent toggleSidebar={toggleSidebar}/>
        <div className="my-3 rounded-full mx-auto bg-background-darkest dark:bg-background-lightest dark:bg-opacity-70 transition-colors duration-300" style={{width: '98%', height:'3px'}} />
        <div className="overflow-y-auto overflow-x-hidden">
          <ul className="space-y-2">
            {links.map((link) => (
              <SidebarLink key={link.to} to={link.to} label={link.label} icon={link.icon} toggleSidebar={toggleSidebar} />
            ))}
          </ul>
        </div>
        <div className="mt-auto">
          <ThemeToggle toggleSidebar={toggleSidebar}/>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;