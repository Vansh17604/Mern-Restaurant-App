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
  Truck
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
        "flex items-center justify-center min-h-screen",
        darkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900"
      )}>
        <div className="text-center p-8 rounded-lg shadow-lg max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{t('waiterDashboard.auth.required')}</h2>
          <p className="text-gray-500">{t('waiterDashboard.auth.loginMessage')}</p>
        </div>
      </div>
    );
  }

  if (isLoading || ordersLoading) {
    return (
      <div className={cn(
        "flex items-center justify-center min-h-screen",
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
        "flex items-center justify-center min-h-screen",
        darkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900"
      )}>
        <div className="text-center p-8 rounded-lg shadow-lg max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-red-600">{t('waiterDashboard.error.title')}</h2>
          <p className="text-gray-500 mb-4">{message}</p>
          <Button onClick={() => dispatch(fetchTables())} className="bg-blue-600 hover:bg-blue-700">
            {t('waiterDashboard.error.tryAgain')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-3 md:p-6 w-full min-h-screen transition-colors duration-200",
      darkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900"
    )}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={cn(
              "text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            )}>
              {t('waiterDashboard.title')}
            </h1>
            
            <p className={cn(
              "text-sm md:text-base",
              darkMode ? "text-slate-300" : "text-gray-600"
            )}>
              {currentWaiterRole === 'Waiter' 
                ? t('waiterDashboard.welcome.waiter')
                : t('waiterDashboard.welcome.general')
              }
            </p>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <div className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              darkMode ? "bg-slate-700 text-slate-300" : "bg-blue-100 text-blue-800"
            )}>
              {currentWaiterRole}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
        <StatsCard 
          title={t('waiterDashboard.stats.available')} 
          value={stats.available} 
          icon={CheckCircle} 
          color="bg-emerald-500" 
          darkMode={darkMode}
        />
        <StatsCard 
          title={t('waiterDashboard.stats.assigned')} 
          value={stats.assigned} 
          icon={UserCheck} 
          color="bg-amber-500" 
          darkMode={darkMode}
        />
        {currentWaiterRole === 'Waiter' && (
          <StatsCard 
            title={t('waiterDashboard.stats.myTables')} 
            value={stats.myTables} 
            icon={User} 
            color="bg-blue-500" 
            darkMode={darkMode}
          />
        )}
        <StatsCard 
          title={t('waiterDashboard.stats.ordersToday')} 
          value={stats.ordersToday} 
          icon={ShoppingCart} 
          color="bg-purple-500" 
          darkMode={darkMode}
        />
        <StatsCard 
          title={t('waiterDashboard.stats.total')} 
          value={stats.total} 
          icon={Utensils} 
          color="bg-slate-500" 
          darkMode={darkMode}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
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
          />
        ))}
      </div>
      
      {/* Empty State */}
      {filteredTables.length === 0 && (
        <div className="text-center py-12">
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
            "text-sm max-w-md mx-auto",
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
  t
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
      "rounded-lg border transition-all duration-300 overflow-hidden hover:scale-[1.01] hover:shadow-lg",
      darkMode ? "bg-slate-800 border-slate-700 shadow-md" : "bg-white border-gray-200 shadow-sm",
      isDisabled ? "opacity-60" : "",
      showMyTableBadge ? "ring-2 ring-blue-400" : "",
      table.hasActiveOrders ? "ring-2 ring-emerald-400" : ""
    )}>
      
      {/* Compact Image Section */}
      <div className="relative h-20 w-full overflow-hidden">
        <img 
          src={getStatusImage(table.status)} 
          alt={t('waiterDashboard.table.tableNumber', { number: table.tableNumber })}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/assets/default-table.jpg'; 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-1 right-1 flex gap-1">
          <div className={cn(
            "px-1.5 py-0.5 rounded-full text-xs font-medium text-white shadow-sm",
            getStatusColor(table.status)
          )}>
            {table.status === 'Available' ? t('waiterDashboard.table.status.free') : t('waiterDashboard.table.status.busy')}
          </div>
          {showMyTableBadge && (
            <div className="px-1.5 py-0.5 rounded-full text-xs font-medium text-white shadow-sm bg-blue-500">
              {t('waiterDashboard.table.waiter.mine')}
            </div>
          )}
        </div>
      </div>
      
      {/* Compact Content Section */}
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            {t('waiterDashboard.table.tableNumber', { number: table.tableNumber })}
          </h3>
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
            <Users size={12} className="mr-1" />
            <span className="font-medium">{table.capacity}</span>
          </div>
        </div>

        {/* Compact Waiter Info */}
        {table.isWaiterAssigned && (
          <div className="mb-2">
            <div className={cn(
              "flex items-center text-xs p-2 rounded",
              showMyTableBadge 
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" 
                : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
            )}>
              <User size={12} className="mr-1" />
              <span className="truncate font-medium">
                {table.waiterName || t('waiterDashboard.table.waiter.unknown')}
                {showMyTableBadge && <span className="ml-1 font-bold">{t('waiterDashboard.table.waiter.you')}</span>}
              </span>
            </div>
          </div>
        )}

        {/* Compact Order Information */}
        {table.hasActiveOrders && (
          <div className="order-container p-2 bg-white rounded-lg shadow-sm border text-xs">
            {/* Compact Header */}
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-gray-700">
                {t('waiterDashboard.order.orders', { count: table.orders.length })}
              </span>
              {table.totalOrderAmount > 0 && (
                <span className="font-bold text-green-600">
                  ${table.totalOrderAmount.toFixed(2)}
                </span>
              )}
            </div>

            {/* First Order Summary */}
            {table.orders.length > 0 && (
              <div className="space-y-1">
                {/* Order ID & Status */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">
                    {t('waiterDashboard.order.orderNumber', { id: table.orders[0]._id?.slice(-4) || 'N/A' })}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                    table.orders[0].orderstatus === 'prepared'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {getOrderStatusText(table.orders[0].orderstatus)}
                  </span>
                </div>

                {/* Dishes Summary */}
                {table.orders[0].dishes && table.orders[0].dishes.length > 0 && (
                  <div className="bg-gray-50 rounded p-1.5">
                    <div className="text-gray-600 mb-1">
                      {t('waiterDashboard.order.dishes', { count: table.orders[0].dishes.length })}
                    </div>

                    {/* Top 2 Dishes */}
                    <div className="space-y-1">
                      {table.orders[0].dishes.slice(0, 2).map((dish, index) => (
                        <div key={dish._id || index} className="flex items-center justify-between py-1 px-2 bg-white rounded border-l-2 border-blue-200">
                          <div className="flex items-center space-x-2 flex-1">
                            <span className="font-medium text-gray-800 text-xs">
                              {getDishName(dish).length > 10 
                                ? `${getDishName(dish).substring(0, 10)}...` 
                                : getDishName(dish)}
                            </span>
                            <span className="text-blue-600 font-bold text-xs">
                              x{dish.quantity}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600 font-semibold text-xs">
                              ${getDishPrice(dish).toFixed(2)}
                            </span>
                            {/* Dish Status */}
                           {dish.status && (
                              <span className={`px-1.5 py-0.5 rounded text-xs font-medium text-white ${
                                dish.status === 'prepared' 
                                  ? 'bg-green-500' 
                                  : dish.status === 'preparing'
                                  ? 'bg-blue-500'
                                  : 'bg-yellow-500'
                              }`}>
                                {getOrderStatusText(dish.status)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      {table.orders[0].dishes.length > 2 && (
                        <div className="text-center text-gray-500 text-xs py-1">
                          {t('waiterDashboard.order.moreDishes', { count: table.orders[0].dishes.length - 2 })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Serve Button for Ready Orders */}
                {hasOrdersWithPreparedStatus && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 font-medium text-xs animate-pulse">
                        🔔 {t('waiterDashboard.order.readyToServe')}
                      </span>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onServeOrder(table.orders[0]._id);
                        }}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 text-xs"
                      >
                        <Truck size={12} className="mr-1" />
                        {t('waiterDashboard.buttons.serve')}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Multiple Orders Indicator */}
                {table.orders.length > 1 && (
                  <div className="mt-1 text-center">
                    <span className="text-blue-600 font-medium text-xs">
                      {t('waiterDashboard.order.moreOrders', { count: table.orders.length - 1 })}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-3 space-y-2">
          {/* Assign Button (for unassigned tables) */}
          {!table.isWaiterAssigned && table.status === 'Available' && (
            <Button
              onClick={() => onAssignWaiter(table.id)}
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <UserCheck size={14} className="mr-1" />
              {t('waiterDashboard.buttons.assignToMe')}
            </Button>
          )}

          {/* Take Order / Manage Order Button */}
          {(table.isAssignedToCurrentWaiter || currentWaiterRole !== 'Waiter') && (
            <Button
              onClick={() => onTakeOrder(table)}
              disabled={isDisabled}
              size="sm"
              variant={table.hasActiveOrders ? "default" : "outline"}
              className={cn(
                "w-full transition-all duration-200",
                table.hasActiveOrders 
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600" 
                  : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {table.hasActiveOrders ? (
                <>
                  <Edit size={14} className="mr-1" />
                  {getButtonText()}
                </>
              ) : (
                <>
                  <Plus size={14} className="mr-1" />
                  {getButtonText()}
                </>
              )}
            </Button>
          )}
        </div>

        {/* Last Order Time */}
        {table.orders.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Clock size={12} className="mr-1" />
                <span>
                  {new Date(table.orders[0].createdAt).toLocaleTimeString([], {
                    hour: t('waiterDashboard.time.format.hour'),
                    minute: t('waiterDashboard.time.format.minute')
                  })}
                </span>
              </div>
              {table.orders[0].totalAmount && (
                <span className="font-medium text-green-600">
                  {formatPrice(table.orders[0].totalAmount, t('waiterDashboard.currency.format'))}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaiterDashboard;