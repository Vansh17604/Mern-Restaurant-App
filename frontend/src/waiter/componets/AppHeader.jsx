import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  Settings,
  Edit,
  Trash2
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";

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
import { fetchOrderbyWaiterId } from '../../features/waiter/order/orderSlice';
import {fetchWaiterHeader} from '../../features/admin/waiter/waiterSlice';
import { logout } from '../../features/auth/authSlice';


const AppHeader = ({ onToggleSidebar }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
    const { header } = useSelector((state) => state.waiter);
  const { orders, isLoading } = useSelector((state) => state.order);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const navigate = useNavigate();
  
  const currentWaiterId = user?.id;
  
  useEffect(() => {
    if (currentWaiterId) {
    
      dispatch(fetchOrderbyWaiterId(currentWaiterId));
      dispatch(fetchWaiterHeader(currentWaiterId));
    
      
    }
  }, [currentWaiterId, dispatch]);
  const base_url = import.meta.env.VITE_BASE_URL;

    const handleLogout = async () => {
  try {
    await dispatch(logout());
   
  } catch (err) {
    console.log(err)
   
  }
};

 
  const getOrdersByStatus = (status) => {
    return orders.filter(order => {
      switch(status) {
        case 'ready_pickup':
          return order.orderstatus === 'ready' || order.orderstatus === 'completed';
        case 'ready_order':
          return order.orderstatus === 'order' && !order.dishes?.length;
        case 'in_progress':
          return order.orderstatus === 'order' && order.dishes?.length > 0;
        default:
          return false;
      }
    });
  };

  const getTimeSinceOrder = (createdAt) => {
    const now = new Date();
    const orderTime = new Date(createdAt);
    const diffMinutes = Math.floor((now - orderTime) / (1000 * 60));
    
    if (diffMinutes < 1) return t('just_now');
    if (diffMinutes < 60) return `${diffMinutes} ${t('min')}`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h ${diffMinutes % 60}m`;
  };

  const getOrderStatusText = (order) => {
    if (order.orderstatus === 'ready') return t('table_status_ready_pickup');
    if (order.orderstatus === 'order' && !order.dishes?.length) return t('table_status_ready_order');
    if (order.orderstatus === 'order' && order.dishes?.length > 0) return t('table_status_in_progress');
    return order.orderstatus;
  };

  // Waiter info - use actual user data
  const waiter = {
    name: header?.name || "Waiter",
    role: user?.role || t('waiter'),
    avatar: header?.photo || "/api/placeholder/32/32"
  };

  // Get active orders count
  const activeOrdersCount = orders.filter(order => 
    order.orderstatus === 'order' || order.orderstatus === 'ready'
  ).length;



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
                 
                </ul>
              </div>
            )}
          </div>

          

          {/* Table orders - Dynamic */}
         <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant={darkMode ? "outline" : "ghost"} size="icon" className="relative">
      <ClipboardList size={18} className={darkMode ? 'text-slate-300' : 'text-teal-700'} />
      {activeOrdersCount > 0 && (
        <Badge className={`absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center font-semibold ${darkMode ? 'bg-teal-500 text-white' : 'bg-teal-600 text-white'}`}>
          {activeOrdersCount}
        </Badge>
      )}
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className={`w-96 ${darkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-white border-teal-200'}`}>
    <DropdownMenuLabel className={darkMode ? 'text-white' : 'text-teal-900'}>
      {t('active_tables')} {isLoading && '(Loading...)'}
    </DropdownMenuLabel>
    <DropdownMenuSeparator className={darkMode ? 'bg-slate-700' : 'bg-teal-200'} />
    <div className="max-h-96 overflow-y-auto">
      {isLoading ? (
        <DropdownMenuItem className={`p-3 ${darkMode ? 'text-slate-400' : 'text-teal-600'}`}>
          {t('loading_orders')}
        </DropdownMenuItem>
      ) : orders.length === 0 ? (
        <DropdownMenuItem className={`p-3 ${darkMode ? 'text-slate-400' : 'text-teal-600'}`}>
          {t('no_active_orders')}
        </DropdownMenuItem>
      ) : (
        orders.slice(0, 5).map((order) => (
          <div key={order._id} className={`p-3 border-b last:border-b-0 ${darkMode ? 'border-slate-700' : 'border-teal-100'}`}>
            {/* Order Header */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className={`font-medium ${darkMode ? 'text-teal-400' : 'text-teal-700'}`}>
                  {t('table')} {order.table_number || order.tableId || order._id.slice(-4)}
                </div>
                <div className={`text-sm ${darkMode ? 'text-slate-300' : 'text-teal-900'}`}>
                  {getOrderStatusText(order)}
                </div>
                <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-teal-600'}`}>
                  {getTimeSinceOrder(order.createdAt)}
                </div>
              </div>
              <div className="flex gap-1">
                
              </div>
            </div>

            {/* Order Dishes */}
            {order.dishes && order.dishes.length > 0 && (
              <div className="space-y-2">
                <div className={`text-xs font-medium ${darkMode ? 'text-slate-300' : 'text-teal-800'}`}>
                  Dishes ({order.dishes.length} items)
                </div>
                <div className="space-y-2">
                  {order.dishes.map((dishItem, index) => (
                    <div 
                      key={dishItem._id || index}
                      className={`flex items-center gap-2 p-2 rounded-md ${darkMode ? 'bg-slate-700' : 'bg-teal-50'}`}
                    >
                      <img
                        src={`${base_url}${dishItem.dish_id?.imageUrl || '/default.png'}`} 
                        alt={dishItem.dish_id?.dishName?.en || 'Dish'}
                        className="w-8 h-8 object-cover rounded-md flex-shrink-0"
                        onError={(e) => {
                          e.target.src = '/placeholder-dish.jpg';
                        }}
                      />

                      {/* Dish Details */}
                      <div className="flex-grow min-w-0">
                        <div className={`font-medium text-xs truncate ${darkMode ? 'text-white' : 'text-teal-900'}`}>
                          {dishItem.dish_id?.dishName?.en || dishItem.dish_id?.dishName?.es || 'Unknown Dish'}
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-teal-700'}`}>
                          {dishItem.dish_id?.currency || 'EUR'} {dishItem.dish_id?.price || 0}
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-slate-600 text-slate-200' : 'bg-teal-100 text-teal-800'}`}>
                        {dishItem.quantity}
                      </div>


                   
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className={`mt-2 pt-2 border-t ${darkMode ? 'border-slate-600' : 'border-teal-200'}`}>
              <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-teal-600'}`}>
                Total Qty: {order.quantity || order.dishes?.reduce((sum, dish) => sum + dish.quantity, 0) || 0} | 
                ID: {order._id.slice(-6)}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
    <DropdownMenuSeparator className={darkMode ? 'bg-slate-700' : 'bg-teal-200'} />
    <DropdownMenuItem className={`text-center cursor-pointer ${darkMode ? 'hover:bg-slate-700 text-teal-400' : 'hover:bg-teal-50 text-teal-600'}`}>
      <span className="text-sm w-full">{t('view_all_tables')}</span>
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
          
          {/* User menu - Dynamic */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant={darkMode ? "outline" : "ghost"} 
                className={`relative h-9 flex items-center gap-2 px-2 ${darkMode ? 'border-slate-700 hover:bg-slate-700' : 'hover:bg-teal-100'}`}
              >
                <Avatar className="h-8 w-8 border-2 border-teal-400">
                  <AvatarImage src={`${base_url}${waiter.avatar}`} alt={waiter.name} />
                  <AvatarFallback className={`${darkMode ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-900'}`}>
                    {waiter.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
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
               <DropdownMenuItem onClick={() => navigate("/waiter/profile")}>
                Profile
              </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/waiter/changepassword")}>
                Change Password
              </DropdownMenuItem>
             
              <DropdownMenuSeparator className={darkMode ? 'bg-slate-700' : 'bg-teal-200'} />
              <DropdownMenuItem  className={`${darkMode ? 'hover:bg-slate-700 text-red-400' : 'hover:bg-teal-50 text-red-500'} flex items-center gap-2`}  onClick={handleLogout} >
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