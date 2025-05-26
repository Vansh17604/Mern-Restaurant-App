
import { useState, useEffect } from 'react';
import { cn } from "../../lib/utils";
import { 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Bell, 
  User,
  ChevronDown,
  Search,
  Check,
  ExternalLink
} from 'lucide-react';

// Mock data for orders
const initialOrders = [
  {
    id: 'ORD-001',
    dish: 'Margherita Pizza',
    image: '/assets/Pizza-3007395.jpg',
    waiter: 'John Smith',
    table: 4,
    time: '10:15 AM',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 'ORD-002',
    dish: 'Mushroom Risotto',
    image: '/assets/Resioto.jpeg',
    waiter: 'Emily Davis',
    table: 7,
    time: '10:22 AM',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: 'ORD-003',
    dish: 'Grilled Dorade',
    image: '/assets/grilled-dorade-vernick-fish.png',
    waiter: 'Michael Brown',
    table: 2,
    time: '10:30 AM',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: 'ORD-004',
    dish: 'Spaghetti with Anchovies',
    image: '/assets/EG8_EP74_Spaghetti-w-Anchovies-Tomatoes-and-white-wine-sauce.jpg',
    waiter: 'Lisa Johnson',
    table: 9,
    time: '10:35 AM',
    status: 'pending',
    priority: 'low'
  },
  {
    id: 'ORD-005',
    dish: 'Margherita Pizza',
    image: '/assets/Pizza-3007395.jpg',
    waiter: 'Robert Wilson',
    table: 5,
    time: '10:40 AM',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 'ORD-006',
    dish: 'Mushroom Risotto',
    image: '/assets/Resioto.jpeg',
    waiter: 'Sarah Taylor',
    table: 3,
    time: '10:45 AM',
    status: 'pending',
    priority: 'medium'
  }
];

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

// Order Card Component
const OrderCard = ({ order, onReady, onDeliver, darkMode }) => {
  const priorityColors = {
    high: darkMode 
      ? 'bg-red-900/30 text-red-300' 
      : 'bg-red-100 text-red-800',
    medium: darkMode 
      ? 'bg-amber-900/30 text-amber-300' 
      : 'bg-yellow-100 text-yellow-800',
    low: darkMode 
      ? 'bg-blue-900/30 text-blue-300' 
      : 'bg-blue-100 text-blue-800'
  };

  const statusColors = {
    pending: darkMode 
      ? 'bg-slate-700 text-slate-300' 
      : 'bg-gray-100 text-gray-800',
    ready: darkMode 
      ? 'bg-green-900/30 text-green-300' 
      : 'bg-green-100 text-green-800',
    delivered: darkMode 
      ? 'bg-purple-900/30 text-purple-300' 
      : 'bg-purple-100 text-purple-800'
  };

  const buttonColors = {
    ready: darkMode 
      ? 'bg-blue-900/30 hover:bg-blue-800/50 text-blue-300' 
      : 'bg-blue-100 hover:bg-blue-200 text-blue-800',
    deliver: darkMode 
      ? 'bg-green-900/30 hover:bg-green-800/50 text-green-300' 
      : 'bg-green-100 hover:bg-green-200 text-green-800',
    completed: darkMode 
      ? 'bg-slate-700 text-slate-400' 
      : 'bg-gray-100 text-gray-500'
  };

  return (
    <div className={cn(
      "p-4 rounded-lg shadow-sm", 
      darkMode ? "bg-slate-800 text-white" : "bg-white"
    )}>
      <div className="flex mb-3">
        <div className="h-16 w-16 rounded-md overflow-hidden mr-3 flex-shrink-0">
          <img 
            src={order.image} 
            alt={order.dish} 
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className={cn(
              "font-medium", 
              darkMode ? "text-white" : "text-gray-900"
            )}>{order.dish}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[order.priority]}`}>
              {order.priority}
            </span>
          </div>
          <div className={cn(
            "text-sm mt-1", 
            darkMode ? "text-slate-300" : "text-gray-500"
          )}>Order #{order.id}</div>
          <div className="flex justify-between items-center mt-1">
            <div className={cn(
              "text-xs", 
              darkMode ? "text-slate-400" : "text-gray-500"
            )}>
              {order.time}
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
              {order.status}
            </span>
          </div>
        </div>
      </div>
      
      <div className={cn(
        "flex justify-between items-center border-t pt-3",
        darkMode ? "border-slate-700" : "border-gray-200"
      )}>
        <div className="flex items-center text-sm">
          <User size={14} className={cn(
            "mr-1", 
            darkMode ? "text-slate-400" : "text-gray-400"
          )} />
          <span>{`Waiter: ${order.waiter}`}</span>
        </div>
        <div className="text-sm">{`Table #${order.table}`}</div>
      </div>
      
      <div className="flex justify-between mt-3 gap-2">
        {order.status === 'pending' && (
          <button 
            onClick={() => onReady(order.id)}
            className={cn(
              "flex-1 py-2 rounded-md font-medium transition-colors",
              buttonColors.ready
            )}
          >
            Ready
          </button>
        )}
        {order.status === 'ready' && (
          <button 
            onClick={() => onDeliver(order.id)}
            className={cn(
              "flex-1 py-2 rounded-md font-medium transition-colors",
              buttonColors.deliver
            )}
          >
            Deliver
          </button>
        )}
        {order.status === 'delivered' && (
          <div className={cn(
            "flex-1 py-2 rounded-md font-medium text-center",
            buttonColors.completed
          )}>
            Completed
          </div>
        )}
      </div>
    </div>
  );
};

// Filter menu
const FilterMenu = ({ filter, setFilter, darkMode }) => {
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
        All
      </button>
      <button 
        onClick={() => setFilter('pending')}
        className={filterButtonClass('pending')}
      >
        Pending
      </button>
      <button 
        onClick={() => setFilter('ready')}
        className={filterButtonClass('ready')}
      >
        Ready
      </button>
      <button 
        onClick={() => setFilter('delivered')}
        className={filterButtonClass('delivered')}
      >
        Delivered
      </button>
    </div>
  );
};

// Main Kitchen Dashboard Component
const KitchenDashboard = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    const checkDarkMode = () => {
      if (document) {
        setDarkMode(document.body.classList.contains('dark'));
      }
    };
    
    // Initial check
    checkDarkMode();
    
    // Create a mutation observer to watch for changes to the body's class list
    const observer = new MutationObserver(checkDarkMode);
    
    if (document) {
      observer.observe(document.body, { 
        attributes: true, 
        attributeFilter: ['class'] 
      });
    }
    
    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  // Stats for dashboard
  const stats = {
    pending: orders.filter(order => order.status === 'pending').length,
    ready: orders.filter(order => order.status === 'ready').length,
    delivered: orders.filter(order => order.status === 'delivered').length,
    total: orders.length
  };

  // Handle order status changes
  const handleReady = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'ready' } : order
    ));
  };

  const handleDeliver = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'delivered' } : order
    ));
  };

  // Filter orders based on current filter
  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  return (
    <div className={cn(
      "p-4 md:p-6 w-full min-h-screen",
      darkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900"
    )}>
      <div className="mb-6">
        <h1 className={cn(
          "text-xl md:text-2xl font-bold mb-2",
          darkMode ? "text-white" : ""
        )}>Kitchen Dashboard</h1>
        <p className={cn(
          "text-sm md:text-base",
          darkMode ? "text-slate-300" : "text-gray-500"
        )}>Manage kitchen ordersefficiently</p>
       </div>
      
       {/* Stats Cards */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          title="Pending Orders" 
          value={stats.pending} 
          icon={Clock} 
          color="bg-amber-100" 
        />
        <StatsCard 
          title="Ready to Serve" 
          value={stats.ready} 
          icon={CheckCircle} 
          color="bg-green-100" 
        />
        <StatsCard 
          title="Delivered Today" 
          value={stats.delivered} 
          icon={TrendingUp} 
          color="bg-blue-100" 
        />
        <StatsCard 
          title="Total Orders" 
          value={stats.total} 
          icon={Bell} 
          color="bg-purple-100" 
        />
      </div>
      
      {/* Search & Filter */}
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <FilterMenu filter={filter} setFilter={setFilter} />
      </div>
      
      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map(order => (
          <OrderCard 
            key={order.id} 
            order={order} 
            onReady={handleReady} 
            onDeliver={handleDeliver} 
          />
        ))}
      </div>
      
      {/* Empty state */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-4 flex justify-center">
            <CheckCircle size={48} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-medium mb-2">No orders found</h3>
          <p className="text-gray-500">
            There are no {filter !== 'all' ? filter : ''} orders at the moment
          </p>
        </div>
      )}
    </div>
  );
};

export default KitchenDashboard;