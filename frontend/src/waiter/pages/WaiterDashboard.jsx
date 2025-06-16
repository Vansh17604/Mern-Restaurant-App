import { useState, useEffect, useCallback, useRef } from 'react';
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
  const { t } = useTranslation();
  
  // Redux state
  const { tables = [], isLoading, isError, message } = useSelector((state) => state.table);
  const { orders = [], isLoading: ordersLoading } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);
  
  // Local state
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isTakeOrderModalOpen, setIsTakeOrderModalOpen] = useState(false);
  const [orderMode, setOrderMode] = useState('create');
  const [existingOrder, setExistingOrder] = useState(null);
  const [isModalProcessing, setIsModalProcessing] = useState(false);

  // Refs for cleanup
  const modalTimeoutRef = useRef(null);
  const isComponentMountedRef = useRef(true);

  const currentWaiterId = user?.id;
  const currentWaiterRole = user?.role;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isComponentMountedRef.current = false;
      if (modalTimeoutRef.current) {
        clearTimeout(modalTimeoutRef.current);
      }
    };
  }, []);

  // Fetch data on mount
  useEffect(() => {
    if (currentWaiterId) {
      dispatch(fetchOrderbyWaiterId(currentWaiterId));
    }
    dispatch(fetchTables());

    return () => {
      dispatch(resetTableState());
      dispatch(resetOrderState());
    };
  }, [dispatch, currentWaiterId]);

  // Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      if (document?.body) {
        setDarkMode(document.body.classList.contains('dark'));
      }
    };
    
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Debug effect to monitor modal state changes
  useEffect(() => {
    console.log('Modal state changed:', {
      isTakeOrderModalOpen,
      selectedTable: selectedTable?.id,
      orderMode,
      existingOrder: existingOrder?._id
    });
  }, [isTakeOrderModalOpen, selectedTable, orderMode, existingOrder]);

  // Format table data with proper field mapping
  const formatTableData = (backendTables) => {
    return backendTables.map(table => {
      // Find orders for this table (fixed field name: tableid)
      const tableOrders = orders.filter(order => 
        order.tableid === table._id || order.tableid?._id === table._id
      );
      
      return {
        id: table._id,
        tableNumber: table.tablenumber, // Fixed field name
        status: table.tablestatus, // Use actual status from backend
        capacity: table.tablecapacity, // Fixed field name
        waiter: table.waiter_id,
        waiterName: table.waiter_id?.name || null,
        waiterId: table.waiter_id?._id || table.waiter_id,
        isWaiterAssigned: !!table.waiter_id,
        isAssignedToCurrentWaiter: table.waiter_id?._id === currentWaiterId || table.waiter_id === currentWaiterId,
        orders: tableOrders,
        hasActiveOrders: tableOrders.length > 0,
        totalOrderAmount: tableOrders.reduce((sum, order) => {
          // Calculate total from dishes
          const dishTotal = order.dishes?.reduce((dishSum, dish) => {
            const price = dish.dish_id?.price || 0;
            const quantity = dish.quantity || 1;
            return dishSum + (price * quantity);
          }, 0) || 0;
          return sum + dishTotal;
        }, 0)
      };
    });
  };

  const formattedTables = formatTableData(tables);

  // Filter tables based on role
  const getFilteredTablesByRole = (tables) => {
    if (currentWaiterRole === 'Waiter') {
      return tables.filter(table => 
        table.status === 'Available' || 
        table.isAssignedToCurrentWaiter
      );
    }
    return tables; // Admin/Manager can see all tables
  };

  const roleFilteredTables = getFilteredTablesByRole(formattedTables);

  // Calculate stats
  const stats = {
    available: roleFilteredTables.filter(table => table.status === 'Available').length,
    assigned: roleFilteredTables.filter(table => table.status === 'Assigned').length,
    myTables: roleFilteredTables.filter(table => table.isAssignedToCurrentWaiter).length,
    total: roleFilteredTables.length,
    ordersToday: orders.filter(order => {
      const today = new Date();
      const orderDate = new Date(order.orderdate || order.createdAt);
      return orderDate.toDateString() === today.toDateString();
    }).length
  };

  // Handle waiter assignment
  const handleAssignWaiter = async (tableId) => {
    try {
      await dispatch(assignWaiter({ 
        tableId, 
        data: { waiter_id: currentWaiterId } 
      }));
      // Refresh data
      setTimeout(() => {
        dispatch(fetchTables());
        if (currentWaiterId) {
          dispatch(fetchOrderbyWaiterId(currentWaiterId));
        }
      }, 500);
    } catch (error) {
      console.error('Error assigning waiter:', error);
    }
  };

  // Handle order serving
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

  // Updated handleTakeOrder function - more reliable
  const handleTakeOrder = useCallback((table) => {
    console.log('Taking order for table:', table); // Debug log
    
    setSelectedTable(table);
    
    // Check for existing orders
    const existingTableOrder = orders.find(order => 
      (order.tableid === table.id || order.tableid?._id === table.id) && 
      order.orderstatus !== 'completed'
    );
    
    if (existingTableOrder) {
      console.log('Found existing order:', existingTableOrder); // Debug log
      setOrderMode('edit');
      setExistingOrder(existingTableOrder);
    } else {
      console.log('Creating new order'); // Debug log
      setOrderMode('create');
      setExistingOrder(null);
    }
    
    // Set modal open AFTER setting all other states
    setIsTakeOrderModalOpen(true);
  }, [orders]);

  // Updated handleCloseModal function
  const handleCloseModal = useCallback(() => {
    console.log('Closing modal, isModalProcessing:', isModalProcessing); // Debug log
    
    if (isModalProcessing) return;
    
    setIsTakeOrderModalOpen(false);
    
    // Clean up states immediately, no need for timeout
    setSelectedTable(null);
    setExistingOrder(null);
    setOrderMode('create');
  }, [isModalProcessing]);

  // Auth check
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
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-gray-500">Please log in to access the waiter dashboard.</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading || ordersLoading) {
    return (
      <div className={cn(
        "flex items-center justify-center min-h-screen",
        darkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900"
      )}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
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
          <h2 className="text-xl font-semibold mb-2 text-red-600">Error Loading Dashboard</h2>
          <p className="text-gray-500 mb-4">{message}</p>
          <Button onClick={() => dispatch(fetchTables())} className="bg-blue-600 hover:bg-blue-700">
            Try Again
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
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Waiter Dashboard
            </h1>
            <p className={cn(
              "text-sm md:text-base",
              darkMode ? "text-slate-300" : "text-gray-600"
            )}>
              {currentWaiterRole === 'Waiter' 
                ? `Welcome back! Manage your assigned tables and orders.`
                : `Restaurant table and order management system.`
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
          title="Available" 
          value={stats.available} 
          icon={CheckCircle} 
          color="bg-emerald-500" 
          darkMode={darkMode}
        />
        <StatsCard 
          title="Assigned" 
          value={stats.assigned} 
          icon={UserCheck} 
          color="bg-amber-500" 
          darkMode={darkMode}
        />
        {currentWaiterRole === 'Waiter' && (
          <StatsCard 
            title="My Tables" 
            value={stats.myTables} 
            icon={User} 
            color="bg-blue-500" 
            darkMode={darkMode}
          />
        )}
        <StatsCard 
          title="Orders Today" 
          value={stats.ordersToday} 
          icon={ShoppingCart} 
          color="bg-purple-500" 
          darkMode={darkMode}
        />
        <StatsCard 
          title="Total Tables" 
          value={stats.total} 
          icon={Utensils} 
          color="bg-slate-500" 
          darkMode={darkMode}
        />
      </div>
      
      {/* Table Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {roleFilteredTables.map(table => (
          <TableCard 
            key={table.id} 
            table={table} 
            darkMode={darkMode}
            currentWaiterId={currentWaiterId}
            currentWaiterRole={currentWaiterRole}
            onTakeOrder={handleTakeOrder}
            onAssignWaiter={handleAssignWaiter}
            onServeOrder={handleServeOrder}
          />
        ))}
      </div>
      
      {/* Empty State */}
      {roleFilteredTables.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-4 flex justify-center">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              darkMode ? "bg-slate-800" : "bg-gray-100"
            )}>
              <CheckCircle size={32} className="text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">No Tables Available</h3>
          <p className={cn(
            "text-sm max-w-md mx-auto",
            darkMode ? "text-slate-400" : "text-gray-500"
          )}>
            {currentWaiterRole === 'Waiter' 
              ? "No tables are currently available or assigned to you."
              : "No tables are currently available in the system."
            }
          </p>
        </div>
      )}
      
      {/* Modal rendering - simplified and fixed */}
      {isTakeOrderModalOpen && selectedTable && (
        <TakeOrderModal
          open={isTakeOrderModalOpen}
          onClose={handleCloseModal}
          tableId={selectedTable.id}
          darkMode={darkMode}
          waiterId={currentWaiterId}
          existingOrder={existingOrder}
          mode={orderMode}
        />
      )}
    </div>
  );
};

// Table Card Component
const TableCard = ({ 
  table, 
  darkMode, 
  currentWaiterId,
  currentWaiterRole,
  onTakeOrder,
  onAssignWaiter,
  onServeOrder
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-emerald-500';
      case 'Assigned': return 'bg-amber-500';
      case 'Occupied': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusImage = (status) => {
    switch (status) {
      case 'Available': return '/assets/COLOURBOX54131781.jpg';
      case 'Assigned': 
      case 'Occupied': return '/assets/couple-people-meet-on-date-happy-loving-pair-of-man-woman-sitting-at-table-together-2F7430K.jpg';
      default: return '/assets/COLOURBOX54131781.jpg';
    }
  };

  const isDisabled = currentWaiterRole === 'Waiter' && 
    table.status === 'Assigned' && 
    !table.isAssignedToCurrentWaiter;

  const showMyTableBadge = table.isAssignedToCurrentWaiter;

 // Updated getDishName function with better fallback logic
const getDishName = (dish) => {
  
  if (dish?.dish_id?.dishName) {
    // Handle both object and string formats
    if (typeof dish.dish_id.dishName === 'object') {
      return dish.dish_id.dishName.en || 
             dish.dish_id.dishName.default || 
             Object.values(dish.dish_id.dishName)[0] || 
             'Unknown Dish';
    }
    return dish.dish_id.dishName;
  }
  

  
  // Try direct properties on the dish object
  if (dish?.dishName) {
    if (typeof dish.dishName === 'object') {
      return dish.dishName.en || 
             dish.dishName.default || 
             Object.values(dish.dishName)[0] || 
             'Unknown Dish';
    }
    return dish.dishName;
  }

  
  // If all else fails, return Unknown Dish
  return 'Unknown Dish';
};

  const getDishPrice = (dish) => {
    return dish?.dish_id?.price || dish?.price || 0;
  };

  const hasReadyOrders = table.orders.some(order => 
    order.orderstatus === 'prepared' || 
    order.dishes?.some(dish => dish.status === 'prepared')
  );

  return (
    <div className={cn(
      "rounded-lg border transition-all duration-300 overflow-hidden hover:scale-[1.01] hover:shadow-lg",
      darkMode ? "bg-slate-800 border-slate-700 shadow-md" : "bg-white border-gray-200 shadow-sm",
      isDisabled ? "opacity-60" : "",
      showMyTableBadge ? "ring-2 ring-blue-400" : "",
      table.hasActiveOrders ? "ring-2 ring-emerald-400" : ""
    )}>
      
      {/* Image Header */}
      <div className="relative h-20 w-full overflow-hidden">
        <img 
          src={getStatusImage(table.status)} 
          alt={`Table ${table.tableNumber}`}
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
            {table.status}
          </div>
          {showMyTableBadge && (
            <div className="px-1.5 py-0.5 rounded-full text-xs font-medium text-white shadow-sm bg-blue-500">
              Mine
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            Table {table.tableNumber}
          </h3>
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
            <Users size={12} className="mr-1" />
            <span className="font-medium">{table.capacity}</span>
          </div>
        </div>

        {/* Waiter Info */}
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
                {table.waiterName || 'Unknown Waiter'}
                {showMyTableBadge && <span className="ml-1 font-bold">(You)</span>}
              </span>
            </div>
          </div>
        )}

        {/* Order Information */}
        {table.hasActiveOrders && table.orders.length > 0 && (
          <div className="mb-3 p-2 bg-gray-50 dark:bg-slate-700 rounded-lg text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {table.orders.length} Order{table.orders.length > 1 ? 's' : ''}
              </span>
              {table.totalOrderAmount > 0 && (
                <span className="font-bold text-green-600">
                  ${table.totalOrderAmount.toFixed(2)}
                </span>
              )}
            </div>

            {/* First Order Details */}
            {table.orders[0] && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">
                    Order #{table.orders[0]._id?.slice(-4) || 'N/A'}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                    table.orders[0].orderstatus === 'prepared'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {table.orders[0].orderstatus}
                  </span>
                </div>

                {/* Dishes */}
                {table.orders[0].dishes && table.orders[0].dishes.length > 0 && (
                  <div className="space-y-1">
                    {table.orders[0].dishes.slice(0, 2).map((dish, index) => (
                      <div key={index} className="flex justify-between items-center py-1 px-2 bg-white dark:bg-slate-600 rounded">
                        <span className="font-medium text-gray-800 dark:text-gray-200 text-xs truncate">
                          {getDishName(dish)} x{dish.quantity}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="text-green-600 font-semibold text-xs">
                            ${getDishPrice(dish).toFixed(2)}
                          </span>
                          {dish.status && (
                            <span className={`px-1 py-0.5 rounded text-xs text-white ${
                              dish.status === 'prepared' 
                                ? 'bg-green-500' 
                                : 'bg-yellow-500'
                            }`}>
                              {dish.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {table.orders[0].dishes.length > 2 && (
                      <div className="text-center text-gray-500 text-xs">
                        +{table.orders[0].dishes.length - 2} more dishes
                      </div>
                    )}
                  </div>
                )}

                {/* Ready to Serve Alert */}
                {hasReadyOrders && (
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 font-medium text-xs animate-pulse">
                        🔔 Ready to Serve
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
                        Serve
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Assign Button */}
          {!table.isWaiterAssigned && table.status === 'Available' && (
            <Button
              onClick={() => onAssignWaiter(table.id)}
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <UserCheck size={14} className="mr-1" />
              Assign to Me
            </Button>
          )}

          {/* Take/Manage Order Button */}
          {(table.isAssignedToCurrentWaiter || currentWaiterRole !== 'Waiter') && (
            <Button
              onClick={() => onTakeOrder(table)}
              disabled={isDisabled}
              size="sm"
              variant={table.hasActiveOrders ? "default" : "outline"}
              className={cn(
                "w-full transition-all duration-200",
                table.hasActiveOrders 
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                  : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {table.hasActiveOrders ? (
                <>
                  <Edit size={14} className="mr-1" />
                  Manage Order
                </>
              ) : (
                <>
                  <Plus size={14} className="mr-1" />
                  Take Order
                </>
              )}
            </Button>
          )}
        </div>

        {/* Order Timestamp */}
        {table.orders.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Clock size={12} className="mr-1" />
                <span>
                  {new Date(table.orders[0].orderdate || table.orders[0].createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaiterDashboard;