import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { cn } from "../../lib/utils";
import { 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Bell, 
  User,
  Search,
  Timer,
  ChefHat
} from 'lucide-react';
import { 
  fetchAllOrders, 
  assignKitchen, 
  markOrderAsPrepared 
} from '../../features/waiter/order/orderSlice';

// Timer Component for dishes in preparation
const DishTimer = ({ startTime, onComplete, darkMode }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(startTime);
      const elapsed = Math.floor((now - start) / 1000);
      setTimeElapsed(elapsed);
      
      if (elapsed >= 1800) {
        onComplete();
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, onComplete]);
  
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  
  return (
    <div className={cn(
      "flex items-center text-sm",
      darkMode ? "text-amber-300" : "text-orange-600"
    )}>
      <Timer size={14} className="mr-1" />
      <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, darkMode }) => (
  <div className={cn(
    "p-4 rounded-lg shadow-sm", 
    darkMode ? "bg-slate-800 text-white" : "bg-white"
  )}>
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className={cn(
          "text-sm font-medium", 
          darkMode ? "text-slate-300" : "text-gray-500"
        )}>{title}</h3>
        <p className="text-xl font-bold">{value}</p>
      </div>
      <div className={`p-2 rounded-full ${color}`}>
        <Icon size={18} className={darkMode ? "text-slate-900" : ""} />
      </div>
    </div>
  </div>
);

const DishCard = ({ dish, order, onAssignKitchen, onMarkPrepared, kitchenId, darkMode }) => {
  const { t,i18n } = useTranslation();
  const base_url = import.meta.env.VITE_BASE_URL;
  
  const getStatusColor = (status) => {
    const colors = {
      order: darkMode 
        ? 'bg-blue-900/30 text-blue-300' 
        : 'bg-blue-100 text-blue-800',
      prepare: darkMode 
        ? 'bg-amber-900/30 text-amber-300' 
        : 'bg-yellow-100 text-yellow-800',
      prepared: darkMode 
        ? 'bg-green-900/30 text-green-300' 
        : 'bg-green-100 text-green-800'
    };
    return colors[status] || colors.order;
  };

  const getButtonColor = (action) => {
    const colors = {
      assign: darkMode 
        ? 'bg-blue-900/30 hover:bg-blue-800/50 text-blue-300' 
        : 'bg-blue-100 hover:bg-blue-200 text-blue-800',
      prepared: darkMode 
        ? 'bg-green-900/30 hover:bg-green-800/50 text-green-300' 
        : 'bg-green-100 hover:bg-green-200 text-green-800',
      completed: darkMode 
        ? 'bg-slate-700 text-slate-400' 
        : 'bg-gray-100 text-gray-500'
    };
    return colors[action];
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const dishImage = dish.dish_id?.imageUrl;
const dishName = dish.dish_id?.dishName?.[i18n.language]
  const dishStatus = dish.status || 'order';

  return (
    <div className={cn(
      "p-4 rounded-lg shadow-sm", 
      darkMode ? "bg-slate-800 text-white" : "bg-white"
    )}>
      <div className="flex mb-3">
        <div className="h-16 w-16 rounded-md overflow-hidden mr-3 flex-shrink-0 bg-gray-100 flex items-center justify-center">
          {dishImage ? (
            <img
              src={`${base_url}${dishImage}`}
              alt={dishName}
              className="w-16 h-16 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : (
            <ChefHat size={24} className={cn(
              darkMode ? "text-slate-400" : "text-gray-400"
            )} />
          )}
          <div className="w-16 h-16 items-center justify-center hidden">
            <ChefHat size={24} className={cn(
              darkMode ? "text-slate-400" : "text-gray-400"
            )} />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className={cn(
              "font-medium text-sm", 
              darkMode ? "text-white" : "text-gray-900"
            )}>
              {dishName}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(dishStatus)}`}>
              {t(`kitchendashboard.status.${dishStatus}`)}
            </span>
          </div>
          <div className={cn(
            "text-sm mt-1", 
            darkMode ? "text-slate-300" : "text-gray-500"
          )}>
            {t('kitchendashboard.dish.quantity')}: {dish.quantity || 1} | {t('kitchendashboard.dish.order')}{order._id?.slice(-6)}
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className={cn(
              "text-xs", 
              darkMode ? "text-slate-400" : "text-gray-500"
            )}>
              {formatTime(order.createdAt)}
            </div>
            {dishStatus === 'prepare' && (
              <DishTimer 
                startTime={dish.updatedAt || order.updatedAt} 
                onComplete={() => onMarkPrepared(order._id, dish._id)}
                darkMode={darkMode}
              />
            )}
          </div>
        </div>
      </div>
      
      <div className={cn(
        "flex justify-between items-center border-t pt-3 text-sm",
        darkMode ? "border-slate-700" : "border-gray-200"
      )}>
        <div className="flex items-center">
          <User size={14} className={cn(
            "mr-1", 
            darkMode ? "text-slate-400" : "text-gray-400"
          )} />
          <span>
            {typeof order.waiterid === 'string' 
              ? `${t('kitchendashboard.dish.waiter')}${order.waiterid.slice(-6)}` 
              : order.waiterid?.name || t('kitchendashboard.dish.unknownWaiter')
            }
          </span>
        </div>
        <div>
          {t('kitchendashboard.dish.table')}{typeof order.tableid === 'string' 
            ? order.tableid.slice(-6) 
            : order.tableid?.tablenumber || 'N/A'
          }
        </div>
      </div>
      
      <div className="flex justify-between mt-3 gap-2">
        {dishStatus === 'order' && (
          <button 
            onClick={() => onAssignKitchen(order._id, dish._id)}
            className={cn(
              "flex-1 py-2 px-4 rounded-md font-medium transition-colors text-sm",
              getButtonColor('assign')
            )}
          >
            {t('kitchendashboard.buttons.startPreparing')}
          </button>
        )}
        {dishStatus === 'prepare' && (
          <button 
            onClick={() => onMarkPrepared(order._id, dish._id)}
            className={cn(
              "flex-1 py-2 px-4 rounded-md font-medium transition-colors text-sm",
              getButtonColor('prepared')
            )}
          >
            {t('kitchendashboard.buttons.markAsPrepared')}
          </button>
        )}
        {dishStatus === 'prepared' && (
          <div className={cn(
            "flex-1 py-2 px-4 rounded-md font-medium text-center text-sm",
            getButtonColor('completed')
          )}>
            {t('kitchendashboard.buttons.readyToServe')}
          </div>
        )}
      </div>
      
      {/* Dish Price (if available) */}
      {dish.dish_id?.price && (
        <div className={cn(
          "mt-3 pt-3 border-t text-sm flex justify-between",
          darkMode ? "border-slate-700" : "border-gray-200"
        )}>
          <span className={cn(
            darkMode ? "text-slate-400" : "text-gray-500"
          )}>{t('kitchendashboard.dish.price')}:</span>
          <span className={cn(
            "font-medium",
            darkMode ? "text-slate-300" : "text-gray-600"
          )}>
            ${(dish.dish_id.price * dish.quantity).toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
};

// Filter menu
const FilterMenu = ({ filter, setFilter, darkMode }) => {
  const { t } = useTranslation();
  
  const filterButtonClass = (currentFilter) => cn(
    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
    filter === currentFilter 
      ? (darkMode ? "bg-amber-600/20 text-amber-300" : "bg-blue-100 text-blue-800") 
      : (darkMode ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-gray-100 text-gray-800 hover:bg-gray-200")
  );

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button 
        onClick={() => setFilter('all')}
        className={filterButtonClass('all')}
      >
        {t('kitchendashboard.filters.allDishes')}
      </button>
      <button 
        onClick={() => setFilter('order')}
        className={filterButtonClass('order')}
      >
        {t('kitchendashboard.filters.newOrders')}
      </button>
      <button 
        onClick={() => setFilter('prepare')}
        className={filterButtonClass('prepare')}
      >
        {t('kitchendashboard.filters.inPreparation')}
      </button>
      <button 
        onClick={() => setFilter('prepared')}
        className={filterButtonClass('prepared')}
      >
        {t('kitchendashboard.filters.readyToServe')}
      </button>
    </div>
  );
};

const KitchenDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);
  const currentKitchenId = user?.id;
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const checkDarkMode = () => {
      if (document) {
        setDarkMode(document.body.classList.contains('dark'));
      }
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    
    if (document) {
      observer.observe(document.body, { 
        attributes: true, 
        attributeFilter: ['class'] 
      });
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // Flatten all dishes from all orders
  const allDishes = orders.reduce((acc, order) => {
    if (order.dishes && order.dishes.length > 0) {
      order.dishes.forEach(dish => {
        acc.push({
          ...dish,
          order: order
        });
      });
    }
    return acc;
  }, []);

  // Calculate stats based on individual dishes
  const stats = {
    pending: allDishes.filter(dish => (dish.status || 'order') === 'order').length,
    preparing: allDishes.filter(dish => (dish.status || 'order') === 'prepare').length,
    ready: allDishes.filter(dish => (dish.status || 'order') === 'prepared').length,
    total: allDishes.length
  };

  const handleAssignKitchen = async (orderId, dishId) => {
    if (currentKitchenId) {
      await dispatch(assignKitchen({ 
        orderId, 
        dishId,
        kitchenId: currentKitchenId
      }));
      // Refresh orders after assignment
      dispatch(fetchAllOrders());
    }
  };

  // Handle mark dish as prepared
  const handleMarkPrepared = async (orderId, dishId) => {
    await dispatch(markOrderAsPrepared({ orderId, dishId }));
    dispatch(fetchAllOrders());
  };

  // Filter and search dishes
  const filteredDishes = allDishes.filter(dish => {
    const dishStatus = dish.status || 'order';
    const matchesFilter = filter === 'all' || dishStatus === filter;
    const matchesSearch = searchTerm === '' || 
      dish.order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.dish_id?.dishName?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.dish_id?.dishName?.es?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof dish.order.waiterid === 'string' && dish.order.waiterid.includes(searchTerm)) ||
      (typeof dish.order.tableid === 'string' && dish.order.tableid.includes(searchTerm));
    
    return matchesFilter && matchesSearch;
  });

  if (isLoading && orders.length === 0) {
    return (
      <div className={cn(
        "p-4 md:p-6 w-full min-h-screen flex items-center justify-center",
        darkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900"
      )}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>{t('kitchendashboard.loading.loadingDishes')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-4 md:p-6 w-full min-h-screen",
      darkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900"
    )}>
      <div className="mb-6">
        <h1 className={cn(
          "text-xl md:text-2xl font-bold mb-2",
          darkMode ? "text-white" : ""
        )}>{t('kitchendashboard.title')}</h1>
        <p className={cn(
          "text-sm md:text-base",
          darkMode ? "text-slate-300" : "text-gray-500"
        )}>{t('kitchendashboard.subtitle')}</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          title={t('kitchendashboard.stats.newDishes')} 
          value={stats.pending} 
          icon={Clock} 
          color="bg-blue-100" 
          darkMode={darkMode}
        />
        <StatsCard 
          title={t('kitchendashboard.stats.inPreparation')} 
          value={stats.preparing} 
          icon={Timer} 
          color="bg-amber-100" 
          darkMode={darkMode}
        />
        <StatsCard 
          title={t('kitchendashboard.stats.readyToServe')} 
          value={stats.ready} 
          icon={CheckCircle} 
          color="bg-green-100" 
          darkMode={darkMode}
        />
        <StatsCard 
          title={t('kitchendashboard.stats.totalDishes')} 
          value={stats.total} 
          icon={Bell} 
          color="bg-purple-100" 
          darkMode={darkMode}
        />
      </div>
      
      {/* Search & Filter */}
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2",
            darkMode ? "text-slate-400" : "text-gray-400"
          )} size={18} />
          <input 
            type="text" 
            placeholder={t('kitchendashboard.search.placeholder')} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "pl-10 pr-4 py-2 w-full rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              darkMode 
                ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400" 
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
            )}
          />
        </div>
        
        <FilterMenu filter={filter} setFilter={setFilter} darkMode={darkMode} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDishes.map((dish, index) => (
          <DishCard 
            key={`${dish.order._id}-${dish._id || index}`}
            dish={dish} 
            order={dish.order}
            onAssignKitchen={handleAssignKitchen}
            onMarkPrepared={handleMarkPrepared}
            kitchenId={user?._id}
            darkMode={darkMode}
          />
        ))}
      </div>
      
      {/* Empty state */}
      {filteredDishes.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="mb-4 flex justify-center">
            <CheckCircle size={48} className={cn(
              darkMode ? "text-slate-600" : "text-gray-300"
            )} />
          </div>
          <h3 className="text-lg font-medium mb-2">{t('kitchendashboard.empty.noDishesFound')}</h3>
          <p className={cn(
            darkMode ? "text-slate-400" : "text-gray-500"
          )}>
            {searchTerm 
              ? `${t('kitchendashboard.empty.noMatchingDishes')} "${searchTerm}"` 
              : `${t('kitchendashboard.empty.there')} ${filter !== 'all' ? t(`kitchendashboard.status.${filter}`) : ''} ${t('kitchendashboard.empty.noDishesAtMoment')}`
            }
          </p>
        </div>
      )}
      
      {/* Loading overlay for actions */}
      {isLoading && orders.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={cn(
            "p-6 rounded-lg shadow-lg",
            darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-900"
          )}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>{t('kitchendashboard.loading.processing')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenDashboard;