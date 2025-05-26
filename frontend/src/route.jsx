import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Admin layout components
import AdminLayout from './admin/componets/AdminLayout';

// Admin pages
import AdminDashboard from './admin/pages/AdminDashboard';

import Home from './admin/pages/Home';
import NotFound from './admin/pages/NotFound';
import WaiterRegistration from './admin/pages/WaiterRegister';
import AddCategory from './admin/pages/AddCategory';
import AddSubCategory from './admin/pages/AddSubCategory';
import AddDish from './admin/pages/AddDish';
import ViewDish from './admin/pages/ViewDish';
import AddTable from './admin/pages/AddTable';


const AppRoutes = () => {
  return (

<>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        
        {/* Admin routes - All wrapped in AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
         
          <Route path="" element={<Navigate to="/admin/" replace />} />
          <Route path="waiter-registration" element={<WaiterRegistration />} />
           <Route path="addcategory" element={<AddCategory />} />
           <Route path='addubcategory' element={<AddSubCategory/>}/>
           <Route path="adddish" element={<AddDish/>} />
            <Route path="viewdish" element={<ViewDish/>} />
          <Route path="addtable" element={<AddTable />} />
          {/* Add more admin routes here */}
          {/* <Route path="users" element={<AdminUsers />} /> */}
          {/* <Route path="settings" element={<AdminSettings />} /> */}
        </Route>
        
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
     
 </>
  );
};

export default AppRoutes;