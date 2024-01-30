import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaBarsStaggered } from 'react-icons/fa6';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };

  return (
    <div className="flex h-screen text-text-darkest dark:text-text-lightest bg-background-lightest dark:bg-background-dark">
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={()=> toggleSidebar(false)}
        />
      )}

      {/* Menu Button */}
      <button
        className="fixed top-0 left-0 p-2 m-2 text-text-darkest bg-primary-lighter hover:bg-primary-lightest dark:bg-primary-darker dark:hover:bg-primary-darkest dark:text-text-lightest rounded-lg transition-colors duration-300 ease-in-out z-30 sm:hidden"
        onClick={()=> toggleSidebar(true)}>
        <FaBarsStaggered size="20px"/>
      </button>


      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Content */}
      <div className="flex-1 overflow-auto bg-background-lightest dark:bg-background-dark transition-colors duration-300">
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
