import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Flag from 'react-world-flags';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { 
  Bell, 
  Search, 
  Coffee,
  ChefHat,
  Clock,
  Moon, 
  Sun, 
  ChevronDown,
  Menu,
  LogOut,
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
import { fetchKitchenHeader } from '../../features/admin/kitchen/kitchenSlice';
import { logout } from '../../features/auth/authSlice';

const AppHeader = ({ onToggleSidebar }) => {
  const { t, i18n } = useTranslation();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { kitchenHeader } = useSelector((state) => state.kitchen);
  const kitchenId = user?.id;
  const base_url = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (kitchenId) {
      dispatch(fetchKitchenHeader(kitchenId));
    }
  }, [dispatch, kitchenId]);
  
  
  const handleLogout = async () => {
    try {
      await dispatch(logout());
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const chef = {
    name: kitchenHeader?.name || "bhavesh",
    role: "Kitchen",
    avatar: kitchenHeader?.photo
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
    if (document) {
      document.body.classList.toggle('dark');
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    document.documentElement.lang = lng;
    setLanguageMenuOpen(false);
  };

  const toggleLanguageMenu = () => setLanguageMenuOpen(!languageMenuOpen);

  return (
    <header className={`sticky top-0 z-30 transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'} border-b`}>
      <div className="flex h-16 items-center px-4 sm:px-6">
        {/* Mobile menu button */}
        <Button 
          variant={darkMode ? "outline" : "ghost"} 
          size="icon" 
          className="md:hidden mr-2" 
          onClick={onToggleSidebar}
        >
          <Menu size={20} />
        </Button>
        
        {/* Kitchen name with icon */}
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${darkMode ? 'bg-amber-600' : 'bg-amber-400'}`}>
            <ChefHat size={20} className={darkMode ? 'text-white' : 'text-amber-900'} />
          </div>
          <div className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-amber-900'}`}>
            {t('kitchen_hub')}
          </div>
        </div>
        
        {/* Search bar */}
        <div className="hidden md:flex items-center ml-4 md:ml-8 flex-1 max-w-md">
          <div className="relative w-full">
          
          </div>
        </div>
        
        {/* Time with icon */}
        <div className="hidden md:flex ml-auto mr-6 items-center gap-2">
          <Clock size={18} className={darkMode ? 'text-slate-300' : 'text-amber-700'} />
          <div className={`text-sm ${darkMode ? 'text-white' : 'text-amber-900'}`}>
            <div className="font-medium">{currentTime}</div>
            <div className="text-xs">{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Language selector */}
          <div className="relative">
            <button
              onClick={toggleLanguageMenu}
              className={`p-2 rounded-full transition-all duration-300 ${
                darkMode 
                  ? 'bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700' 
                  : 'bg-amber-100 text-amber-700 hover:text-amber-600 hover:bg-amber-200'
              }`}
              aria-label={t('change_language')}
            >
              <Globe className="h-5 w-5" />
            </button>
            {languageMenuOpen && (
              <div className={`absolute right-0 mt-2 w-32 rounded-lg shadow-md z-50 border ${
                darkMode 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-white border-amber-200'
              }`}>
                <ul className="py-1">
                  <li>
                    <button
                      onClick={() => changeLanguage('en')}
                      className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm transition-colors ${
                        darkMode 
                          ? 'text-slate-200 hover:bg-slate-700' 
                          : 'text-amber-900 hover:bg-amber-50'
                      }`}
                    >
                    <Flag code="US" className="w-5 h-3" /> {t('english')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => changeLanguage('es')}
                      className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm transition-colors ${
                        darkMode 
                          ? 'text-slate-200 hover:bg-slate-700' 
                          : 'text-amber-900 hover:bg-amber-50'
                      }`}
                    >
                      <Flag code="ES" className="w-5 h-3" /> {t('spanish')}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Orders notifications */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={darkMode ? "outline" : "ghost"} size="icon" className="relative">
                <Coffee size={18} className={darkMode ? 'text-slate-300' : 'text-amber-700'} />
                <Badge className={`absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center font-semibold ${darkMode ? 'bg-amber-500 text-white' : 'bg-amber-600 text-white'}`}>5</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-72 ${darkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-white border-amber-200'}`}>
              <DropdownMenuLabel className={darkMode ? 'text-white' : 'text-amber-900'}>{t('active_orders')}</DropdownMenuLabel>
              <DropdownMenuSeparator className={darkMode ? 'bg-slate-700' : 'bg-amber-200'} />
              <div className="max-h-60 overflow-y-auto">
                <DropdownMenuItem className={`p-3 cursor-pointer ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-amber-50'}`}>
                  <div className="flex flex-col gap-1">
                    <div className={`font-medium ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>{t('order')} #2451</div>
                    <div className={`text-sm ${darkMode ? 'text-slate-300' : 'text-amber-900'}`}>{t('order_items_chicken_pasta')}</div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-amber-600'}`}>{t('table')} 3 • {t('urgent')}</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className={`p-3 cursor-pointer ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-amber-50'}`}>
                  <div className="flex flex-col gap-1">
                    <div className={`font-medium ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>{t('order')} #2452</div>
                    <div className={`text-sm ${darkMode ? 'text-slate-300' : 'text-amber-900'}`}>{t('order_items_steak_fries')}</div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-amber-600'}`}>{t('table')} 7 • {t('time_3_minutes_ago')}</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className={`p-3 cursor-pointer ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-amber-50'}`}>
                  <div className="flex flex-col gap-1">
                    <div className={`font-medium ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>{t('order')} #2453</div>
                    <div className={`text-sm ${darkMode ? 'text-slate-300' : 'text-amber-900'}`}>{t('order_items_pizza_salad')}</div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-amber-600'}`}>{t('table')} 4 • {t('time_7_minutes_ago')}</div>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className={darkMode ? 'bg-slate-700' : 'bg-amber-200'} />
              <DropdownMenuItem className={`text-center cursor-pointer ${darkMode ? 'hover:bg-slate-700 text-amber-400' : 'hover:bg-amber-50 text-amber-600'}`}>
                <span className="text-sm w-full">{t('view_all_orders')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          
          {/* Alerts */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={darkMode ? "outline" : "ghost"} size="icon" className="relative">
                <Bell size={18} className={darkMode ? 'text-slate-300' : 'text-amber-700'} />
                <Badge className={`absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center font-semibold ${darkMode ? 'bg-red-500 text-white' : 'bg-red-500 text-white'}`}>2</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-72 ${darkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-white border-amber-200'}`}>
              <DropdownMenuLabel className={darkMode ? 'text-white' : 'text-amber-900'}>{t('kitchen_alerts')}</DropdownMenuLabel>
              <DropdownMenuSeparator className={darkMode ? 'bg-slate-700' : 'bg-amber-200'} />
              <div className="max-h-60 overflow-y-auto">
                <DropdownMenuItem className={`p-3 cursor-pointer ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-amber-50'}`}>
                  <div className="flex flex-col gap-1">
                    <div className={`font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{t('low_inventory_alert')}</div>
                    <div className={`text-sm ${darkMode ? 'text-slate-300' : 'text-amber-900'}`}>{t('tomatoes_running_low')}</div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-amber-600'}`}>{t('time_10_minutes_ago')}</div>
                  </div>
                </DropdownMenuItem>
          
              </div>
              <DropdownMenuSeparator className={darkMode ? 'bg-slate-700' : 'bg-amber-200'} />
              <DropdownMenuItem className={`text-center cursor-pointer ${darkMode ? 'hover:bg-slate-700 text-amber-400' : 'hover:bg-amber-50 text-amber-600'}`}>
                <span className="text-sm w-full">{t('view_all_alerts')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          
          {/* Dark mode toggle */}
          <Button 
            variant={darkMode ? "outline" : "ghost"} 
            size="icon" 
            onClick={toggleDarkMode} 
            className={darkMode ? 'border-slate-700 hover:bg-slate-700' : 'hover:bg-amber-100'}
          >
            {darkMode ? (
              <Sun size={18} className="text-amber-400" />
            ) : (
              <Moon size={18} className="text-amber-700" />
            )}
          </Button>
          
          <Separator orientation="vertical" className={`h-8 mx-1 ${darkMode ? 'bg-slate-700' : 'bg-amber-200'}`} />
          
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant={darkMode ? "outline" : "ghost"} 
                className={`relative h-9 flex items-center gap-2 px-2 ${darkMode ? 'border-slate-700 hover:bg-slate-700' : 'hover:bg-amber-100'}`}
              >
                <Avatar className="h-8 w-8 border-2 border-amber-400">
                  <AvatarImage src={chef.avatar ? `${base_url}${chef.avatar}` : undefined} alt={chef.name} />
                  <AvatarFallback className={`${darkMode ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-900'}`}>
                    {chef.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start text-sm">
                  <span className={`font-medium leading-none ${darkMode ? 'text-white' : 'text-amber-900'}`}>{chef.name}</span>
                  <span className={`text-xs ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{chef.role}</span>
                </div>
                <ChevronDown className={`h-4 w-4 ${darkMode ? 'text-slate-400' : 'text-amber-500'}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-56 ${darkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-white border-amber-200'}`}>
              <DropdownMenuLabel className={darkMode ? 'text-white' : 'text-amber-900'}>{t('my_account')}</DropdownMenuLabel>
              <DropdownMenuSeparator className={darkMode ? 'bg-slate-700' : 'bg-amber-200'} />
            
              <DropdownMenuItem onClick={() => navigate("/kitchen/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/kitchen/changepassword")}>
                Change Password
              </DropdownMenuItem>
      
              <DropdownMenuSeparator className={darkMode ? 'bg-slate-700' : 'bg-amber-200'} />
              <DropdownMenuItem className={`${darkMode ? 'hover:bg-slate-700 text-red-400' : 'hover:bg-amber-50 text-red-500'} flex items-center gap-2`} onClick={handleLogout}>
                <LogOut size={16} />
                <span>{t('log_out')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile search - only shows on small screens */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-slate-400' : 'text-amber-500'}`} />
          <Input 
            placeholder={t('search_orders_recipes')}
            className={`pl-10 w-full ${darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400' : 'bg-white border-amber-200'}`}
          />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;