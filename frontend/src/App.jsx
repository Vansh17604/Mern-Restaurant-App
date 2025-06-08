import React, { Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Toaster } from './components/ui/sonner';
import { validateToken } from './features/auth/authSlice';

import Layout from './Layout/Layout'
import Login from './pages/Login'
import Contact from './pages/Contact/Contact'
import About from './pages/About/About'
import Home from './pages/Home/Home'
import AppRoutes from './route';
import Kitchenroutes from './kitchenroutes'
import Waiterroutes from './waiterroutes'
import PrivateRoute from './PrivateRoute';
import AdminLayout from './admin/componets/AdminLayout';

// Admin pages
import AdminDashboard from './admin/pages/AdminDashboard';
import WaiterRegistration from './admin/pages/WaiterRegister';
import AddCategory from './admin/pages/AddCategory';
import AddSubCategory from './admin/pages/AddSubCategory';
import AddDish from './admin/pages/AddDish';
import ViewDish from './admin/pages/ViewDish';
import AddTable from './admin/pages/AddTable';
import ViewWaiter from './admin/pages/ViewWaiter';
import KitchenRegister from './admin/pages/KitchenRegister';
import ViewKitchen from './admin/pages/ViewKitchen';

import KitchenDashboard from './kitchen/Pages/Kitchendashboard';
import KitchenChangePassword from './kitchen/Pages/KitchenChangePassword';
import KitchenProfile from './kitchen/Pages/KitchenProfile';
import KitchenLayout from './kitchen/components/KitchenLayout';
import WaiterDashboard from './waiter/pages/WaiterDashboard';
import WaiterLayout from './waiter/componets/WaiterLayout';
import ChangePassword from './admin/pages/ChangePassword';
import AdminProfile from './admin/pages/AdminProfile';
import OrderDetails from './admin/pages/OrderDetails';

import WaiterChangePassword from './waiter/pages/WaiterChangePassword';
import WaiterProfile from './waiter/pages/WaiterProfile';

const App = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await dispatch(validateToken()).unwrap();
      } catch (error) {
     
        console.log('Token validation failed:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Show loading while initializing auth
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
        </div>
      }>
        <Toaster richColors position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route exact path="/login" element={<Layout><Login /></Layout>} />
          <Route exact path="/contact" element={<Layout><Contact /></Layout>} />
          <Route exact path="/about" element={<Layout><About /></Layout>} />
          <Route exact path="/home" element={<Layout><Home /></Layout>} />
          <Route exact path="/" element={<Layout><Home /></Layout>} />
          <Route path="/unauthorized" element={<Layout><div>Unauthorized Access</div></Layout>} />

          {/* Private Routes */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute roles={['Admin']}>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            {/* Nest all admin routes directly here */}
            <Route index element={<AdminDashboard />} />
            <Route path="waiter-registration" element={<WaiterRegistration />} />
            <Route path="addcategory" element={<AddCategory />} />
            <Route path="addubcategory" element={<AddSubCategory />} />
            <Route path="adddish" element={<AddDish />} />
            <Route path="viewdish" element={<ViewDish />} />
            <Route path="addtable" element={<AddTable />} />
            <Route path="viewwaiter" element={<ViewWaiter />} />
            <Route path="kitchen-register" element={<KitchenRegister />} />
            <Route path="viewkitchen" element={<ViewKitchen />} />
            <Route path="changepassword" element={<ChangePassword />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="orderdetail" element={<OrderDetails/>} />
          </Route>

           <Route
            path="/kitchen/*"
            element={
              <PrivateRoute roles={['Kitchen']}>
                <KitchenLayout />
              </PrivateRoute>
            }
          >
              <Route index element={<KitchenDashboard />} />
              <Route path='changepassword' element={<KitchenChangePassword/>}/>
              <Route path='profile' element={<KitchenProfile/>}/>
              </Route>


            

          <Route
            path="/waiter/*"
            element={
              <PrivateRoute roles={['Waiter']}>
              <WaiterLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<WaiterDashboard/>} />
            <Route path='changepassword' element={<WaiterChangePassword/>}/>
            <Route path="profile" element={<WaiterProfile/>}/>

            </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App