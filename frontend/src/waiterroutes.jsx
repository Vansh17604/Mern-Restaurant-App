import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Admin layout components
import WaiterDashboard from './waiter/pages/WaiterDashboard';

// Admin pages
import WaiterLayout from './waiter/componets/WaiterLayout';



const Waiterroutes = () => {
  return (

<>
       
        
        {/* Admin routes - All wrapped in AdminLayout */}
        <Route path="/waiter" element={<WaiterLayout />}>
          <Route index element={<WaiterDashboard />} />
         
          <Route path="" element={<Navigate to="/waiter/" replace />} />
         
          {/* Add more admin routes here */}
          {/* <Route path="users" element={<AdminUsers />} /> */}
          {/* <Route path="settings" element={<AdminSettings />} /> */}
        </Route>
        
      
     
 </>
  );
};

export default Waiterroutes;