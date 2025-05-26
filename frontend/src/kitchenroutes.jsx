import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Admin layout components
import KitchenDashboard from './kitchen/Pages/Kitchendashboard';

// Admin pages
import KitchenLayout from './kitchen/components/KitchenLayout'



const Kitchenroutes = () => {
  return (

<>
       
        
        {/* Admin routes - All wrapped in AdminLayout */}
        <Route path="/kitchen" element={<KitchenLayout />}>
          <Route index element={<KitchenDashboard />} />
         
          <Route path="" element={<Navigate to="/kitchen/" replace />} />
         
          {/* Add more admin routes here */}
          {/* <Route path="users" element={<AdminUsers />} /> */}
          {/* <Route path="settings" element={<AdminSettings />} /> */}
        </Route>
        
      
     
 </>
  );
};

export default Kitchenroutes;