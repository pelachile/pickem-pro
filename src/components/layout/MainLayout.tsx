import React from 'react';
import { Outlet } from '@tanstack/react-router';
import Sidebar from './Sidebar';

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-navy-900 via-ocean-600 to-sky-400">
      {/* Static Sidebar */}
      <Sidebar />
      
      {/* Dynamic Content Area */}
      <main className="flex-1 p-4 ml-64 transition-all duration-300 ease-in-out">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;