import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { cn } from "../../lib/utils";
import { 
  Clock, 
  CheckCircle,
  Users,
  Utensils,
  Plus,
  X,
  Edit,
  User,
  UserCheck,
  ShoppingCart,
  Truck,
  Filter,
  Search,
  ChevronDown
} from 'lucide-react';

import { Button } from "../../components/ui/button";

import StatsCard from '../componets/StatsCard';
import TakeOrderModal from '../modals/TakeOrderModal';

import { 
  fetchTables,  
  assignWaiter,
  resetTableState 
} from '../../features/admin/table/tableSlice';

import { 
  fetchOrderbyWaiterId,
  resetOrderState,
  markOrderAsServed
} from '../../features/waiter/order/orderSlice';

const WaiterDashboard = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { tables, isLoading, isError, message } = useSelector((state) => state.table);
  const { orders, isLoading: ordersLoading } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);
  const currentWaiterId = user?.id;
  const currentWaiterRole = user?.role;
  
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isTakeOrderModalOpen, setIsTakeOrderModalOpen] = useState(false);
  const [orderMode, setOrderMode] = useState('create'); // 'create' or 'edit'
  const [existingOrder, setExistingOrder] = useState(null);
  const [modalInitialized, setModalInitialized] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    dispatch(fetchOrderbyWaiterId(currentWaiterId));
    dispatch(fetchTables());
    
    return () => {
      dispatch(resetTableState());
      dispatch(resetOrderState());
    };
  }, [dispatch]);

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

  const formatTableData = (backendTables) => {
    return backendTables.map(table => {
      const tableOrders = orders.filter(order => 
        order.tableid === table._id || order.tableid?._id === table._id
      );
      
      return {
        id: table._id,
        tableNumber: table.tablenumber,
        status: getTableStatus(table.tablestatus),
        capacity: table.tablecapacity,
        waiter: table.waiter_id,
        waiterName: table.waiter_id?.name || null,
        waiterId: table.waiter_id?._id || table.waiter_id,
        isWaiterAssigned: !!table.waiter_id,
        isAssignedToCurrentWaiter: table.waiter_id?._id === currentWaiterId || table.waiter_id === currentWaiterId,
        originalStatus: table.tablestatus,
        orders: tableOrders,
        hasActiveOrders: tableOrders.length > 0,
        totalOrderAmount: tableOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      };
    });
  };

  const getTableStatus = (backendStatus) => {
    const statusMap = {
      'Available': 'Available',
      'Assigned': 'Assigned',
    };
    return statusMap[backendStatus] || 'Available';
  };

  const formattedTables = formatTableData(tables);

  const getFilteredTablesByRole = (tables) => {
    tables.filter(table => 
      table.status === 'Available' || 
      table.isAssignedToCurrentWaiter
    );
    
    return tables;
  };

  const roleFilteredTables = getFilteredTablesByRole(formattedTables);

  const stats = {
    available: roleFilteredTables.filter(table => table.status === 'Available').length,
    assigned: roleFilteredTables.filter(table => table.status === 'Assigned').length,
    myTables: roleFilteredTables.filter(table => table.isAssignedToCurrentWaiter).length,
    total: roleFilteredTables.length,
    ordersToday: orders.filter(order => {
      const today = new Date();
      const orderDate = new Date(order.createdAt);
      return orderDate.toDateString() === today.toDateString();
    }).length
  };

  const handleAssignWaiter = async (tableId, waiterId = currentWaiterId) => {
    try {
      await dispatch(assignWaiter({ 
        tableId, 
        data: { waiter_id: waiterId || currentWaiterId } 
      }));
      setTimeout(() => {
        dispatch(fetchTables());
        if (currentWaiterId) {
          dispatch(fetchOrderbyWaiterId(currentWaiterId));
        }
      }, 500);
    } catch (error) {
      // Handle error
    }
  };

  const handleServeOrder = async (orderId) => {
    try {
      await dispatch(markOrderAsServed(orderId));
      setTimeout(() => {
        if (currentWaiterId) {
          dispatch(fetchOrderbyWaiterId(currentWaiterId));
        }
        dispatch(fetchTables());
      }, 500);
    } catch (error) {
      console.error('Error serving order:', error);
    }
  };

  const handleOpenTakeOrderModal = (table) => {
    setIsTakeOrderModalOpen(false);
    setModalInitialized(false);

    const activeOrder = table.orders && table.orders.length > 0 
      ? table.orders.find(order => 
          ['pending', 'preparing'].includes(order.orderstatus)
        ) || table.orders[0]  
      : null;
    setTimeout(() => {
      setSelectedTable(table);
      
      if (activeOrder) {
        setOrderMode('edit');
        setExistingOrder(activeOrder);
      } else {
        setOrderMode('create');
        setExistingOrder(null);
      }
      
      setModalInitialized(true);
      setIsTakeOrderModalOpen(true);
    }, 50);
  };

  const handleCloseTakeOrderModal = () => {
    setIsTakeOrderModalOpen(false);
    setModalInitialized(false);
    setSelectedTable(null);
    setExistingOrder(null);
    setOrderMode('create');
    
    setTimeout(() => {
      if (currentWaiterId) {
        dispatch(fetchOrderbyWaiterId(currentWaiterId));
      }
      dispatch(fetchTables());
    }, 200);
  };

  const filteredTables = roleFilteredTables.filter(table => {
    const matchesFilter = filter === 'all' || 
      (filter === 'Assigned' && table.status === 'Assigned') ||
      (filter === 'Available' && table.status === 'Available') ||
      (filter === 'myTables' && table.isAssignedToCurrentWaiter) ||
      (filter === 'withOrders' && table.hasActiveOrders);
    
    const matchesSearch = searchTerm === '' || 
      table.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (table.waiterName && table.waiterName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  if (!user || !currentWaiterId) {
    return (
      <div className={cn(
        "flex items-center justify-center min-h-screen px-4",
        darkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900"
      )}>
        <div className="text-center p-6 rounded-lg shadow-lg max-w-sm w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{t('waiterDashboard.auth.required')}</h2>
          <p className="text-gray-500 text-sm">{t('waiterDashboard.auth.loginMessage')}</p>
        </div>
      </div>
    );
  }

  if (isLoading || ordersLoading) {
    return (
      <div className={cn(
        "flex items-center justify-center min-h-screen px-4",
        darkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900"
      )}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">{t('waiterDashboard.loading.dashboard')}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn(
        "flex items-center justify-center min-h-screen px-4",
        darkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900"
      )}>
        <div className="text-center p-6 rounded-lg shadow-lg max-w-sm w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-red-600">{t('waiterDashboard.error.title')}</h2>
          <p className="text-gray-500 mb-4 text-sm">{message}</p>
          <Button onClick={() => dispatch(fetchTables())} className="bg-blue-600 hover:bg-blue-700 w-full">
            {t('waiterDashboard.error.tryAgain')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-200",
      darkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900"
    )}>
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 px-4 py-3 border-b backdrop-blur-sm bg-opacity-90">
        <div className={cn(
          "bg-opacity-90 backdrop-blur-sm",
          darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('waiterDashboard.title')}
              </h1>
              <p className={cn(
                "text-xs",
                darkMode ? "text-slate-300" : "text-gray-600"
              )}>
                {currentWaiterRole === 'Waiter' 
                  ? t('waiterDashboard.welcome.waiter')
                  : t('waiterDashboard.welcome.general')
                }
              </p>
            </div>
            
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              darkMode ? "bg-slate-700 text-slate-300" : "bg-blue-100 text-blue-800"
            )}>
              {currentWaiterRole}
            </div>
          </div>

          {/* Mobile Search and Filter Bar */}
          <div className="space-y-2">
            <div className="flex gap-2">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder={t('waiterDashboard.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(
                    "w-full pl-9 pr-3 py-2 rounded-lg border text-sm",
                    darkMode 
                      ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400" 
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  )}
                />
              </div>
              
              {/* Filter Toggle Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "px-3 py-2",
                  showFilters && "bg-blue-100 border-blue-300 text-blue-700"
                )}
              >
                <Filter size={16} />
                <ChevronDown size={14} className={cn(
                  "ml-1 transition-transform",
                  showFilters && "rotate-180"
                )} />
              </Button>
            </div>

            {/* Collapsible Filter Options */}
            {showFilters && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-slate-700">
                {[
                  { key: 'all', label: t('waiterDashboard.filters.all') },
                  { key: 'Available', label: t('waiterDashboard.filters.available') },
                  { key: 'Assigned', label: t('waiterDashboard.filters.assigned') },
                  ...(currentWaiterRole === 'Waiter' ? [{ key: 'myTables', label: t('waiterDashboard.filters.myTables') }] : []),
                  { key: 'withOrders', label: t('waiterDashboard.filters.withOrders') }
                ].map(filterOption => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                      filter === filterOption.key
                        ? "bg-blue-600 text-white"
                        : darkMode
                        ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    )}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="px-4 pb-4">
        {/* Mobile Stats Grid - 2x3 layout */}
        <div className="grid grid-cols-2 gap-3 mb-4 mt-4">
          <StatsCard 
            title={t('waiterDashboard.stats.available')} 
            value={stats.available} 
            icon={CheckCircle} 
            color="bg-emerald-500" 
            darkMode={darkMode}
            compact={true}
          />
          <StatsCard 
            title={t('waiterDashboard.stats.assigned')} 
            value={stats.assigned} 
            icon={UserCheck} 
            color="bg-amber-500" 
            darkMode={darkMode}
            compact={true}
          />
          {currentWaiterRole === 'Waiter' && (
            <StatsCard 
              title={t('waiterDashboard.stats.myTables')} 
              value={stats.myTables} 
              icon={User} 
              color="bg-blue-500" 
              darkMode={darkMode}
              compact={true}
            />
          )}
          <StatsCard 
            title={t('waiterDashboard.stats.ordersToday')} 
            value={stats.ordersToday} 
            icon={ShoppingCart} 
            color="bg-purple-500" 
            darkMode={darkMode}
            compact={true}
          />
          <StatsCard 
            title={t('waiterDashboard.stats.total')} 
            value={stats.total} 
            icon={Utensils} 
            color="bg-slate-500" 
            darkMode={darkMode}
            compact={true}
          />
          {/* Empty cell for layout if needed */}
          {currentWaiterRole !== 'Waiter' && <div></div>}
        </div>
        
        {/* Mobile Table Cards - Single column layout */}
        <div className="space-y-3">
          {filteredTables.map(table => (
            <EnhancedTableCard 
              key={table.id} 
              table={table} 
              darkMode={darkMode}
              currentWaiterId={currentWaiterId}
              currentWaiterRole={currentWaiterRole}
              onTakeOrder={() => handleOpenTakeOrderModal(table)}
              onAssignWaiter={handleAssignWaiter}
              onServeOrder={handleServeOrder}
              t={t}
              isMobile={true}
            />
          ))}
        </div>
        
        {/* Empty State */}
        {filteredTables.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="mb-4 flex justify-center">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center",
                darkMode ? "bg-slate-800" : "bg-gray-100"
              )}>
                <CheckCircle size={32} className="text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('waiterDashboard.emptyState.noTables')}</h3>
            <p className={cn(
              "text-sm",
              darkMode ? "text-slate-400" : "text-gray-500"
            )}>
              {searchTerm 
                ? t('waiterDashboard.emptyState.noTablesMatch', { searchTerm })
                : t('waiterDashboard.emptyState.noTablesAvailable', { 
                    filter: filter !== 'all' ? t(`waiterDashboard.emptyState.filterContext.${filter}`, filter.replace('myTables', 'your')) : '',
                    role: currentWaiterRole === 'Waiter' ? t('waiterDashboard.emptyState.roleContext.waiter') : t('waiterDashboard.emptyState.roleContext.general')
                  })
              }
            </p>
          </div>
        )}
      </div>
      
      {selectedTable && isTakeOrderModalOpen && modalInitialized && (
        <TakeOrderModal 
          open={isTakeOrderModalOpen} 
          onClose={handleCloseTakeOrderModal}
          tableId={selectedTable.id}
          waiterId={currentWaiterId}
          darkMode={darkMode}
          mode={orderMode}
          existingOrder={existingOrder}
        />
      )}
    </div>
  );
};

const EnhancedTableCard = ({ 
  table, 
  darkMode, 
  currentWaiterId,
  currentWaiterRole,
  onTakeOrder,
  onAssignWaiter,
  onServeOrder,
  t,
  isMobile = false
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-emerald-500';
      case 'Assigned': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'order': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'preparing': return 'bg-blue-500';
      case 'prepared': return 'bg-orange-500';
      case 'served': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getOrderStatusText = (status) => {
    return t(`waiterDashboard.order.status.${status}`, status);
  };

  const getStatusText = (status) => {
    return t(`waiterDashboard.table.status.${status.toLowerCase()}`, status);
  };
  
  const getStatusImage = (status) => {
    switch (status) {
      case 'Available': return '/assets/COLOURBOX54131781.jpg';
      case 'Assigned': return '/assets/couple-people-meet-on-date-happy-loving-pair-of-man-woman-sitting-at-table-together-2F7430K.jpg';
      default: return '/assets/COLOURBOX54131781.jpg';
    }
  };

  const isDisabled = currentWaiterRole === 'Waiter' && 
    table.status === 'Assigned' && 
    !table.isAssignedToCurrentWaiter;

  const showMyTableBadge = table.isAssignedToCurrentWaiter;

  const formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const hasOrdersWithPreparedStatus = table.orders && table.orders.some(order => 
    order.orderstatus === 'prepared' || order.dishes?.some(dish => dish.status === 'prepared')
  );

  const getButtonText = () => {
    if (table.hasActiveOrders) {
      return t('waiterDashboard.buttons.manage');
    } else {
      return t('waiterDashboard.buttons.takeOrder');
    }
  };

  const getDishName = (dish) => {
    if (dish?.dish_id?.dishName?.en) {
      return dish.dish_id.dishName.en;
    }
    if (dish?.dish_id?.dishName) {
      return typeof dish.dish_id.dishName === 'string' ? dish.dish_id.dishName : dish.dish_id.dishName.en || t('waiterDashboard.order.unknownDish');
    }
    if (dish?.dishName?.en) {
      return dish.dishName.en;
    }
    if (dish?.dishName) {
      return typeof dish.dishName === 'string' ? dish.dishName : dish.dishName.en || t('waiterDashboard.order.unknownDish');
    }
    if (dish?.name) {
      return dish.name;
    }
    return t('waiterDashboard.order.unknownDish');
  };

  const getDishPrice = (dish) => {
    if (dish?.dish_id?.price) {
      return dish.dish_id.price;
    }
    if (dish?.price) {
      return dish.price;
    }
    return 0;
  };

  return (
    <div className={cn(
      "rounded-xl border transition-all duration-300 overflow-hidden",
      darkMode ? "bg-slate-800 border-slate-700 shadow-lg" : "bg-white border-gray-200 shadow-md",
      isDisabled ? "opacity-60" : "",
      showMyTableBadge ? "ring-2 ring-blue-400" : "",
      table.hasActiveOrders ? "ring-2 ring-emerald-400" : "",
      isMobile && "hover:shadow-lg active:scale-[0.98]"
    )}>
      
      {/* Mobile Header Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md",
              getStatusColor(table.status)
            )}>
              {table.tableNumber}
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {t('waiterDashboard.table.tableNumber', { number: table.tableNumber })}
              </h3>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Users size={14} className="mr-1" />
                <span>{table.capacity} {t('waiterDashboard.table.capacity')}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-1">
            <div className={cn(
              "px-2 py-1 rounded-lg text-xs font-medium text-white",
              getStatusColor(table.status)
            )}>
              {table.status === 'Available' ? t('waiterDashboard.table.status.free') : t('waiterDashboard.table.status.busy')}
            </div>
            {showMyTableBadge && (
              <div className="px-2 py-1 rounded-lg text-xs font-medium text-white bg-blue-500">
                {t('waiterDashboard.table.waiter.mine')}
              </div>
            )}
          </div>
        </div>

        {/* Waiter Information */}
        {table.isWaiterAssigned && (
          <div className="mb-3">
            <div className={cn(
              "flex items-center text-sm p-3 rounded-lg",
              showMyTableBadge 
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" 
                : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
            )}>
              <User size={16} className="mr-2" />
              <span className="font-medium">
                {table.waiterName || t('waiterDashboard.table.waiter.unknown')}
                {showMyTableBadge && <span className="ml-1 font-bold">({t('waiterDashboard.table.waiter.you')})</span>}
              </span>
            </div>
          </div>
        )}

        {/* Mobile Order Information */}
        {table.hasActiveOrders && (
          <div className={cn(
            "p-4 rounded-xl border mb-4",
            darkMode ? "bg-slate-700 border-slate-600" : "bg-gray-50 border-gray-200"
          )}>
            {/* Order Header */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {t('waiterDashboard.order.orders', { count: table.orders.length })}
                </span>
              </div>
              {table.totalOrderAmount > 0 && (
                <span className="font-bold text-green-600 text-lg">
                  ${table.totalOrderAmount.toFixed(2)}
                </span>
              )}
            </div>

            {/* Latest Order Details */}
            {table.orders.length > 0 && (
              <div className="space-y-3">
                {/* Order Status and ID */}
                <div className="flex justify-between items-center p-2 bg-white dark:bg-slate-800 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    #{table.orders[0]._id?.slice(-6) || 'N/A'}
                  </span>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    table.orders[0].orderstatus === 'prepared'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                      : table.orders[0].orderstatus === 'preparing'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
                  )}>
                    {getOrderStatusText(table.orders[0].orderstatus)}
                  </span>
                </div>

                {/* Dishes List */}
                {table.orders[0].dishes && table.orders[0].dishes.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('waiterDashboard.order.dishes', { count: table.orders[0].dishes.length })}
                    </div>

                    {/* Show all dishes on mobile */}
                    {table.orders[0].dishes.map((dish, index) => (
                      <div key={dish._id || index} className={cn(
                        "flex items-center justify-between p-3 rounded-lg border-l-4",
                        dish.status === 'prepared' 
                          ? "bg-green-50 border-green-400 dark:bg-green-900/10" 
                          : "bg-gray-50 border-gray-200 dark:bg-slate-700/50 dark:border-slate-600"
                      )}>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-white text-sm">
                              {getDishName(dish)}
                            </span>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              x{dish.quantity || 1}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ${getDishPrice(dish).toFixed(2)} {t('waiterDashboard.order.each')}
                            </span>
                            {dish.status && (
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-medium",
                                getOrderStatusColor(dish.status),
                                "text-white"
                              )}>
                                {getOrderStatusText(dish.status)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Serve Order Action */}
                {hasOrdersWithPreparedStatus && (
                  <div className="pt-2 border-t border-gray-200 dark:border-slate-600">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServeOrder(table.orders[0]._id);
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      size="sm"
                    >
                      <Truck size={16} className="mr-2" />
                      {t('waiterDashboard.buttons.markAsServed')}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile Action Buttons */}
        <div className="flex gap-2">
          {!table.isWaiterAssigned ? (
            <>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onAssignWaiter(table.id);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                disabled={isDisabled}
              >
                <UserCheck size={16} className="mr-2" />
                {t('waiterDashboard.buttons.assignToMe')}
              </Button>
            </>
          ) : (
            <>
              {(table.isAssignedToCurrentWaiter || currentWaiterRole !== 'Waiter') && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTakeOrder();
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  disabled={isDisabled}
                >
                  {table.hasActiveOrders ? (
                    <>
                      <Edit size={16} className="mr-2" />
                      {getButtonText()}
                    </>
                  ) : (
                    <>
                      <Plus size={16} className="mr-2" />
                      {getButtonText()}
                    </>
                  )}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaiterDashboard;