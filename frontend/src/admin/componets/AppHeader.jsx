import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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

const AppHeader = ({ onToggleSidebar }) => {
  const { t, i18n } = useTranslation();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  
  // Mock admin data
  const admin = {
    name: t('adminheader.name'),
    role: t('adminheader.role'),
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
        <div className="md:hidden font-semibold">{t("adminheader.tittle")}</div>
        
        {/* Search bar */}
        <div className="hidden md:flex items-center ml-2 md:ml-4 lg:ml-6 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder={t('adminheader.placeholdersearch')}
              className="pl-10 w-full bg-muted/30 border-muted focus-visible:bg-background"
            />
          </div>
        </div>
        
        {/* Date & Time */}
        <div className="hidden md:flex ml-auto mr-4 items-center">
          <div className="text-xs md:text-sm text-muted-foreground">
            <div className="font-medium text-foreground">{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            <div>{currentTime}</div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Language selector */}
        

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={18} />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center font-semibold">3</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>{t('notifications')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-60 overflow-y-auto">
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <div className="font-medium">{t('new_order')} #1243</div>
                    <div className="text-sm text-muted-foreground">{t('table_order_notification')}</div>
                    <div className="text-xs text-muted-foreground">{t('time_5_minutes_ago')}</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <div className="font-medium">{t('inventory_alert')}</div>
                    <div className="text-sm text-muted-foreground">{t('chicken_stock_low')}</div>
                    <div className="text-xs text-muted-foreground">{t('time_20_minutes_ago')}</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <div className="font-medium">{t('staff_checkin')}</div>
                    <div className="text-sm text-muted-foreground">{t('chef_michael_checkin')}</div>
                    <div className="text-xs text-muted-foreground">{t('time_1_hour_ago')}</div>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center cursor-pointer">
                <span className="text-primary text-sm w-full">{t('view_all_notifications')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Messages */}
          <Button variant="ghost" size="icon" className="relative">
            <MessageSquare size={18} />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center font-semibold">2</Badge>
          </Button>
          
          {/* Dark mode toggle */}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
            <div className="relative">
            <button
              onClick={toggleLanguageMenu}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300"
              aria-label={t('change_language')}
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
                    <Flag code="US" className="w-5 h-3" /> {t('english')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => changeLanguage('es')}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Flag code="ES" className="w-5 h-3" /> {t('spanish')}
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
                  <AvatarImage src={admin.avatar} alt={admin.name} />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start text-sm">
                  <span className="font-medium leading-none">{admin.name}</span>
                  <span className="text-xs text-muted-foreground">{admin.role}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t('adminheader.account')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{t('adminheader.profile')}</DropdownMenuItem>
              <DropdownMenuItem>{t('adminheader.prefrences')}</DropdownMenuItem>
              <DropdownMenuItem>{t('restaurant_settings')}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">{t('adminheader.logout')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile search - only shows on small screens */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder={t('adminheader.placeholdersearch')}
            className="pl-10 w-full bg-muted/30 border-muted"
          />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;