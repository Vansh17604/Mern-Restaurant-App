import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Toaster  } from './components/ui/sonner';

import Layout from './Layout/Layout'
import Login from './pages/Login'
import Contact from './pages/Contact/Contact'
import About from './pages/About/About'
import Home from './pages/Home/Home'
import AppRoutes from './route';
import Kitchenroutes from './kitchenroutes'
import Waiterroutes from './waiterroutes'




const App = () => {


  return (
  
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            {/* <CSpinner color="primary" variant="grow" /> */}
          </div>
        }
      >
        
            <Toaster richColors position="top-right" />
        <Routes>
          {AppRoutes()}
          {Kitchenroutes()}
          {Waiterroutes()}
   
          <Route exact path="/login" name="login" element={<Layout><Login /></Layout>} />
          <Route exact path="/contact" name="Contact" element={<Layout><Contact /></Layout>} />
          <Route exact path="/about" name="About" element={<Layout><About /></Layout>} />
          <Route exact path="/home" name="Home" element={<Layout><Home /></Layout>} />
          
         

       
        </Routes>
      </Suspense>
    </BrowserRouter>
    
  )
}

export default App