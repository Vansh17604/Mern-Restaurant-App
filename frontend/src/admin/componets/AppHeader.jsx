import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Flag from 'react-world-flags';
import { 
  Bell, 
  Search, 
  MessageSquare, 
  Moon, 
  Sun, 
  ChevronDown,
  Menu,
  Globe
} from 'lucide-react';

import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../components/ui/dropdown-menu";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { logout } from '../../features/auth/authSlice';

import { fetchAdminDetails } from '../../features/admin/admin/adminSlice'; // Add your correct import path

import { useDispatch, useSelector } from 'react-redux';

const AppHeader = ({ onToggleSidebar }) => {
  const { t, i18n } = useTranslation();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const navigate = useNavigate();
  
  // ✅ Safe state access with fallbacks
  const { admin = {}, isLoading, isError, isSuccess, message } = useSelector((state) => state.admin || {});
  const { user } = useSelector((state) => state.auth || {}); 
  const adminId = user?.id;
  const dispatch = useDispatch();

  // Fetch admin details on component mount
  useEffect(() => {
    if (adminId) {
      dispatch(fetchAdminDetails(adminId));
    }
  }, [dispatch, adminId]);
  
  // ✅ Safe admin data with proper fallbacks
  const adminData = {
    name: admin?.name || t('adminheader.name') || 'Admin',
    role: admin?.role || "Admin",
    avatar: admin?.avatar || "/api/placeholder/32/32"
  };

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (typeof document !== 'undefined') { // ✅ Safe document access
      document.body.classList.toggle('dark');
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('language', lng);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lng;
    }
    setLanguageMenuOpen(false);
  };

  const toggleLanguageMenu = () => setLanguageMenuOpen(!languageMenuOpen);

 
  if (isLoading) {
    return (
      <header className="bg-background border-b border-border sticky top-0 z-30">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span>Loading...</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-30">
      <div className="flex h-16 items-center px-4 sm:px-6">
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden mr-2" 
          onClick={onToggleSidebar}
        >
          <Menu size={20} />
        </Button>
        
        {/* Restaurant name - shown only on mobile */}
        <div className="md:hidden font-semibold">{t("adminheader.tittle") || "Restaurant"}</div>
        
        {/* Search bar */}
        <div className="hidden md:flex items-center ml-2 md:ml-4 lg:ml-6 flex-1 max-w-md">
          <div className="relative w-full">
           
          </div>
        </div>
        
        {/* Date & Time */}
        <div className="hidden md:flex ml-auto mr-4 items-center">
          <div className="text-xs md:text-sm text-muted-foreground">
            <div className="font-medium text-foreground">
              {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
            <div>{currentTime}</div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2 md:gap-4">

          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={toggleLanguageMenu}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300"
              aria-label={t('change_language') || 'Change language'}
            >
              <Globe className="h-5 w-5" />
            </button>
            {languageMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md z-50">
                <ul className="py-1">
                  <li>
                    <button
                      onClick={() => changeLanguage('en')}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Flag code="US" className="w-5 h-3" /> {t('english') || 'English'}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => changeLanguage('es')}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Flag code="ES" className="w-5 h-3" /> {t('spanish') || 'Spanish'}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          <Separator orientation="vertical" className="h-8 mx-1" />
          
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={adminData.avatar} alt={adminData.name} />
                  <AvatarFallback>{adminData.name.charAt(0) || 'A'}</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start text-sm">
                  <span className="font-medium leading-none">{adminData.name}</span>
                  <span className="text-xs text-muted-foreground">{adminData.role}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t('adminheader.account') || 'Account'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/admin/profile")}>
                { 'Profile'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/admin/changepassword")}>
                {  'Change Password'}
              </DropdownMenuItem>
         
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
                {t('adminheader.logout') || 'Logout'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
         
        </div>
      </div>
    </header>
  );
};

export default AppHeader;