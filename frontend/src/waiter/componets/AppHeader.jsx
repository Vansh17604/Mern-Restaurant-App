import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Flag from 'react-world-flags';
import { 
  Bell, 
  Search, 
  UtensilsCrossed,
  ClipboardList,
  Clock,
  Moon, 
  Sun, 
  ChevronDown,
  Menu,
  LogOut,
  Globe,
  Settings
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

const AppHeader = ({ onToggleSidebar }) => {
  const { t, i18n } = useTranslation();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  
  // Mock waiter data
  const waiter = {
    name: "Emily Parker",
    role: t('senior_waiter'),
    avatar: "/api/placeholder/32/32"
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
    <header className={`sticky top-0 z-30 transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200'} border-b`}>
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
        
        {/* Restaurant name with icon */}
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${darkMode ? 'bg-teal-600' : 'bg-teal-400'}`}>
            <UtensilsCrossed size={20} className={darkMode ? 'text-white' : 'text-teal-900'} />
          </div>
          <div className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-teal-900'}`}>
            {t('waiter_hub')}
          </div>
        </div>
        
        {/* Search bar */}
        <div className="hidden md:flex items-center ml-4 md:ml-8 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-slate-400' : 'text-teal-500'}`} />
            <Input 
              placeholder={t('search_tables_orders_menu')}
              className={`pl-10 w-full ${darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus-visible:border-teal-500' : 'bg-white border-teal-200 focus-visible:border-teal-400'}`}
            />
          </div>
        </div>
        
        {/* Time with icon */}
        <div className="hidden md:flex ml-auto mr-6 items-center gap-2">
          <Clock size={18} className={darkMode ? 'text-slate-300' : 'text-teal-700'} />
          <div className={`text-sm ${darkMode ? 'text-white' : 'text-teal-900'}`}>
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
                  ? 'bg-slate-800 text-slate-300 hover:text-teal-400 border border-slate-700' 
                  : 'bg-teal-100 text-teal-700 hover:text-teal-600 hover:bg-teal-200'
              }`}
              aria-label={t('change_language')}
            >
              <Globe className="h-5 w-5" />
            </button>
            {languageMenuOpen && (
              <div className={`absolute right-0 mt-2 w-32 rounded-lg shadow-md z-50 border ${
                darkMode 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-white border-teal-200'
              }`}>
                <ul className="py-1">
                  <li>
                    <button
                      onClick={() => changeLanguage('en')}
                      className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm transition-colors ${
                        darkMode 
                          ? 'text-slate-200 hover:bg-slate-700' 
                          : 'text-teal-900 hover:bg-teal-50'
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
                          : 'text-teal-900 hover:bg-teal-50'
                      }`}
                    >
                      <Flag code="ES" className="w-5 h-3" /> {t('spanish')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => changeLanguage('fr')}
                      className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm transition-colors ${
                        darkMode 
                          ? 'text-slate-200 hover:bg-slate-700' 
                          : 'text-teal-900 hover:bg-teal-50'
                      }`}
                    >
                      <Flag code="FR" className="w-5 h-3" /> {t('french')}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Configuration/Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={darkMode ? "outline" : "ghost"} size="icon">
                <Settings size={18} className={darkMode ? 'text-slate-300' : 'text-teal-700'} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-56 ${darkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-white border-teal-200'}`}>
              <DropdownMenuLabel className={darkMode ? 'text-white' : 'text-teal-900'}>{t('configuration')}</DropdownMenuLabel>
              <DropdownMenuSeparator className={darkMode ? 'bg-slate-700' : 'bg-teal-200'} />
              <DropdownMenuItem className={darkMode ? 'hover:bg-slate-700' : 'hover:bg-teal-50'}>
                {t('table_layout')}
              </DropdownMenuItem>
              <DropdownMenuItem className={darkMode ? 'hover:bg-slate-700' : 'hover:bg-teal-50'}>
                {t('notification_settings')}
              </DropdownMenuItem>
              <DropdownMenuItem className={darkMode ? 'hover:bg-slate-700' : 'hover:bg-teal-50'}>
                {t('order_preferences')}
              </DropdownMenuItem>
              <DropdownMenuItem className={darkMode ? 'hover:bg-slate-700' : 'hover:bg-teal-50'}>
                {t('display_options')}
              </DropdownMenuItem>
              <DropdownMenuSeparator className={darkMode ? 'bg-slate-700' : 'bg-teal-200'} />
              <DropdownMenuItem className={darkMode ? 'hover:bg-slate-700' : 'hover:bg-teal-50'}>
                {t('sync_with_pos')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Table orders */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={darkMode ? "outline" : "ghost"} size="icon" className="relative">
                <ClipboardList size={18} className={darkMode ? 'text-slate-300' : 'text-teal-700'} />
                <Badge className={`absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center font-semibold ${darkMode ? 'bg-teal-500 text-white' : 'bg-teal-600 text-white'}`}>8</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-72 ${darkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-white border-teal-200'}`}>
              <DropdownMenuLabel className={darkMode ? 'text-white' : 'text-teal-900'}>{t('active_tables')}</DropdownMenuLabel>
              <DropdownMenuSeparator className={darkMode ? 'bg-slate-700' : 'bg-teal-200'} />
              <div className="max-h-60 overflow-y-auto">
                <DropdownMenuItem className={`p-3 cursor-pointer ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-teal-50'}`}>
                  <div className="flex flex-col gap-1">
                    <div className={`font-medium ${darkMode ? 'text-teal-400' : 'text-teal-700'}`}>{t('table')} 3</div>
                    <div className={`text-sm ${darkMode ? 'text-slate-300' : 'text-teal-900'}`}>{t('table_status_ready_pickup')}</div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-teal-600'}`}>{t('seated_time_25_min')}</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className={`p-3 cursor-pointer ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-teal-50'}`}>
                  <div className="flex flex-col gap-1">
                    <div className={`font-medium ${darkMode ? 'text-teal-400' : 'text-teal-700'}`}>{t('table')} 7</div>
                    <div className={`text-sm ${darkMode ? 'text-slate-300' : 'text-teal-900'}`}>{t('table_status_ready_order')}</div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-teal-600'}`}>{t('seated_time_5_min')}</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className={`p-3 cursor-pointer ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-teal-50'}`}>
                  <div className="flex flex-col gap-1">
                    <div className={`font-medium ${darkMode ? 'text-teal-400' : 'text-teal-700'}`}>{t('table')} 4</div>
                    <div className={`text-sm ${darkMode ? 'text-slate-300' : 'text-teal-900'}`}>{t('table_status_appetizers_served')}</div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-teal-600'}`}>{t('seated_time_15_min')}</div>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className={darkMode ? 'bg-slate-700' : 'bg-teal-200'} />
              <DropdownMenuItem className={`text-center cursor-pointer ${darkMode ? 'hover:bg-slate-700 text-teal-400' : 'hover:bg-teal-50 text-teal-600'}`}>
                <span className="text-sm w-full">{t('view_all_tables')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Alerts */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={darkMode ? "outline" : "ghost"} size="icon" className="relative">
                <Bell size={18} className={darkMode ? 'text-slate-300' : 'text-teal-700'} />
                <Badge className={`absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center font-semibold ${darkMode ? 'bg-red-500 text-white' : 'bg-red-500 text-white'}`}>3</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-72 ${darkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-white border-teal-200'}`}>
              <DropdownMenuLabel className={darkMode ? 'text-white' : 'text-teal-900'}>{t('service_alerts')}</DropdownMenuLabel>
              <DropdownMenuSeparator className={darkMode ? 'bg-slate-700' : 'bg-teal-200'} />
              <div className="max-h-60 overflow-y-auto">
                <DropdownMenuItem className={`p-3 cursor-pointer ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-teal-50'}`}>
                  <div className="flex flex-col gap-1">
                    <div className={`font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{t('table')} 3 - {t('assistance')}</div>
                    <div className={`text-sm ${darkMode ? 'text-slate-300' : 'text-teal-900'}`}>{t('water_refill_request')}</div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-teal-600'}`}>{t('time_2_minutes_ago')}</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className={`p-3 cursor-pointer ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-teal-50'}`}>
                  <div className="flex flex-col gap-1">
                    <div className={`font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{t('table')} 5 - {t('check_request')}</div>
                    <div className={`text-sm ${darkMode ? 'text-slate-300' : 'text-teal-900'}`}>{t('customers_ready_pay')}</div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-teal-600'}`}>{t('time_5_minutes_ago')}</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className={`p-3 cursor-pointer ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-teal-50'}`}>
                  <div className="flex flex-col gap-1">
                    <div className={`font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{t('kitchen')} - {t('order_ready')}</div>
                    <div className={`text-sm ${darkMode ? 'text-slate-300' : 'text-teal-900'}`}>{t('order')} #2451 {t('ready_pickup')}</div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-teal-600'}`}>{t('just_now')}</div>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className={darkMode ? 'bg-slate-700' : 'bg-teal-200'} />
              <DropdownMenuItem className={`text-center cursor-pointer ${darkMode ? 'hover:bg-slate-700 text-teal-400' : 'hover:bg-teal-50 text-teal-600'}`}>
                <span className="text-sm w-full">{t('view_all_alerts')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Dark mode toggle */}
          <Button 
            variant={darkMode ? "outline" : "ghost"} 
            size="icon" 
            onClick={toggleDarkMode} 
            className={darkMode ? 'border-slate-700 hover:bg-slate-700' : 'hover:bg-teal-100'}
          >
            {darkMode ? (
              <Sun size={18} className="text-teal-400" />
            ) : (
              <Moon size={18} className="text-teal-700" />
            )}
          </Button>
          
          <Separator orientation="vertical" className={`h-8 mx-1 ${darkMode ? 'bg-slate-700' : 'bg-teal-200'}`} />
          
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant={darkMode ? "outline" : "ghost"} 
                className={`relative h-9 flex items-center gap-2 px-2 ${darkMode ? 'border-slate-700 hover:bg-slate-700' : 'hover:bg-teal-100'}`}
              >
                <Avatar className="h-8 w-8 border-2 border-teal-400">
                  <AvatarImage src={waiter.avatar} alt={waiter.name} />
                  <AvatarFallback className={`${darkMode ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-900'}`}>EP</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start text-sm">
                  <span className={`font-medium leading-none ${darkMode ? 'text-white' : 'text-teal-900'}`}>{waiter.name}</span>
                  <span className={`text-xs ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>{waiter.role}</span>
                </div>
                <ChevronDown className={`h-4 w-4 ${darkMode ? 'text-slate-400' : 'text-teal-500'}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-56 ${darkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-white border-teal-200'}`}>
              <DropdownMenuLabel className={darkMode ? 'text-white' : 'text-teal-900'}>{t('my_account')}</DropdownMenuLabel>
              <DropdownMenuSeparator className={darkMode ? 'bg-slate-700' : 'bg-teal-200'} />
              <DropdownMenuItem className={darkMode ? 'hover:bg-slate-700' : 'hover:bg-teal-50'}>
                <div className="flex items-center gap-2 w-full">
                  <div className="h-4 w-4 rounded-full bg-green-500"></div>
                  <span>{t('available')}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className={darkMode ? 'hover:bg-slate-700' : 'hover:bg-teal-50'}>{t('my_tables')}</DropdownMenuItem>
              <DropdownMenuItem className={darkMode ? 'hover:bg-slate-700' : 'hover:bg-teal-50'}>{t('menu_book')}</DropdownMenuItem>
              <DropdownMenuItem className={darkMode ? 'hover:bg-slate-700' : 'hover:bg-teal-50'}>{t('shifts_schedule')}</DropdownMenuItem>
              <DropdownMenuSeparator className={darkMode ? 'bg-slate-700' : 'bg-teal-200'} />
              <DropdownMenuItem className={`${darkMode ? 'hover:bg-slate-700 text-red-400' : 'hover:bg-teal-50 text-red-500'} flex items-center gap-2`}>
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
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-slate-400' : 'text-teal-500'}`} />
          <Input 
            placeholder={t('search_tables_orders_menu')}
            className={`pl-10 w-full ${darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400' : 'bg-white border-teal-200'}`}
          />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;