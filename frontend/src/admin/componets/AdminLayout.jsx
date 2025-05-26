import React from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import Sidebar from './Sildebar';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
     <div className="flex flex-col min-h-screen">
  <AppHeader />
  <div className="flex flex-1">
    <Sidebar />
    <main className="flex-1 p-4 bg-gray-100">
      <Outlet />
    </main>
  </div>
  <AppFooter />
</div>
    </div>
  );
};

export default AdminLayout;