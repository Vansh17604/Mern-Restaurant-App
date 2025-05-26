import React from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import AppSlidebar from './AppSidbar';

const WaiterLayout = () => {
  return (
    <div className="admin-layout">
     <div className="flex flex-col min-h-screen">
  <AppHeader />
  <div className="flex flex-1">
    <AppSlidebar />
    <main className="flex-1 p-4 bg-gray-100">
      <Outlet />
    </main>
  </div>
  <AppFooter />
</div>
    </div>
  );
};

export default WaiterLayout;