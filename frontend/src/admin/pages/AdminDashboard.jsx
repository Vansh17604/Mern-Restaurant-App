import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Utensils, Coffee, DollarSign, Menu, X } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  getDashboardStats, 
  getHourlyOrders, 
  getWeeklySales, 
  getMenuPopularity, 
  getRecentOrders,
  resetCountState 
} from '../../features/admin/count/countSlice';

// StatsCard Component - Enhanced for mobile
const StatsCard = ({ title, value, icon: Icon, change, color }) => (
  <div className="p-4 sm:p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <div className="flex justify-between items-start mb-3 sm:mb-4">
      <div className="flex-1 min-w-0">
        <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</h3>
        <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
      </div>
      <div className={`p-2 sm:p-3 rounded-full flex-shrink-0 ml-2 ${color}`}>
        <Icon size={16} className="sm:w-5 sm:h-5" />
      </div>
    </div>
    <div className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">
      {change} <span className="text-gray-500 dark:text-gray-400">from last month</span>
    </div>
  </div>
);

// SalesOverviewChart Component - Mobile optimized
const SalesOverviewChart = ({ salesData, isLoading }) => (
  <div className="p-4 sm:p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6 text-gray-900 dark:text-white">Sales Overview</h3>
    {isLoading ? (
      <div className="flex items-center justify-center h-[200px] sm:h-[300px]">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 200 : 300}>
        <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF" 
            fontSize={12}
            tick={{ fontSize: 10 }}
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={12}
            tick={{ fontSize: 10 }}
            width={40}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgb(255, 255, 255)', 
              border: '1px solid rgb(75, 85, 99)',
              borderRadius: '8px',
              color: 'black',
              fontSize: '12px'
            }} 
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Area 
            type="monotone" 
            dataKey="sales" 
            stroke="#4f46e5" 
            fill="#4f46e5" 
            fillOpacity={0.2} 
            name="Sales ($)" 
          />
          <Area 
            type="monotone" 
            dataKey="orders" 
            stroke="#10b981" 
            fill="#10b981" 
            fillOpacity={0.2} 
            name="Orders" 
          />
        </AreaChart>
      </ResponsiveContainer>
    )}
  </div>
);

// HourlyOrdersChart Component - Mobile optimized
const HourlyOrdersChart = ({ hourlyOrdersData, isLoading }) => (
  <div className="p-4 sm:p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6 text-gray-900 dark:text-white">Hourly Orders</h3>
    {isLoading ? (
      <div className="flex items-center justify-center h-[200px] sm:h-[300px]">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 200 : 300}>
        <BarChart data={hourlyOrdersData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF" 
            fontSize={12}
            tick={{ fontSize: 10 }}
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={12}
            tick={{ fontSize: 10 }}
            width={40}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgb(255, 255, 255)', 
              border: '1px solid rgb(75, 85, 99)',
              borderRadius: '8px',
              color: 'black',
              fontSize: '12px'
            }} 
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="orders" fill="#8884d8" name="Orders" />
        </BarChart>
      </ResponsiveContainer>
    )}
  </div>
);

// PopularMenuItemsChart Component - Mobile optimized
const PopularMenuItemsChart = ({ menuItemsData, isLoading }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <div className="p-4 sm:p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6 text-gray-900 dark:text-white">Popular Menu Items</h3>
      {isLoading ? (
        <div className="flex items-center justify-center h-[200px] sm:h-[300px]">
          <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 200 : 300}>
          <PieChart>
            <Pie
              data={menuItemsData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={window.innerWidth < 640 ? 60 : 80}
              fill="#8884d8"
              label={window.innerWidth >= 640 ? ({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%` : false}
              labelStyle={{ fontSize: '10px' }}
            >
              {menuItemsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgb(255, 255, 255)', 
                border: '1px solid rgb(75, 85, 99)',
                borderRadius: '8px',
                color: 'black',
                fontSize: '12px'
              }} 
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

// RecentOrdersTable Component - Mobile optimized
const RecentOrdersTable = ({ orders, isLoading }) => {
  const [showAll, setShowAll] = useState(false);
  
  // Status badge color mapping
  const statusColorMap = {
    'Completed': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
    'Preparing': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
    'Delivered': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
    'Processing': 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200',
    'Pending': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  };

  // Show only first 3 orders on mobile unless "Show All" is clicked
  const displayOrders = window.innerWidth < 640 && !showAll ? orders.slice(0, 3) : orders;

  return (
    <div className="p-4 sm:p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">Recent Orders</h3>
        {window.innerWidth < 640 && orders.length > 3 && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            {showAll ? 'Show Less' : `Show All (${orders.length})`}
          </button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-[150px] sm:h-[200px]">
          <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">Time</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {displayOrders.map((order, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{order.id}</td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">{order.amount}</td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300 hidden sm:table-cell">{order.time}</td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorMap[order.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Loading Skeleton for Stats Cards
const StatsCardSkeleton = () => (
  <div className="p-4 sm:p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 animate-pulse border border-gray-200 dark:border-gray-700">
    <div className="flex justify-between items-start mb-3 sm:mb-4">
      <div className="flex-1">
        <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-600 rounded w-16 sm:w-20 mb-2"></div>
        <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-600 rounded w-12 sm:w-16"></div>
      </div>
      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
    </div>
    <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-600 rounded w-20 sm:w-24"></div>
  </div>
);

// Icon mapping for stats cards
const iconMap = {
  'Utensils': Utensils,
  'DollarSign': DollarSign,
  'Coffee': Coffee,
  'Users': Users
};

// Main Dashboard Component - Enhanced for mobile
const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { 
    dashboardStats, 
    hourlyOrders, 
    weeklySales, 
    menuPopularity, 
    recentOrders, 
    isLoading, 
    isError, 
    message 
  } = useSelector((state) => state.count);

  useEffect(() => {
    // Fetch all dashboard data when component mounts
    dispatch(getDashboardStats());
    dispatch(getHourlyOrders());
    dispatch(getWeeklySales());
    dispatch(getMenuPopularity());
    dispatch(getRecentOrders());

    // Cleanup function to reset state when component unmounts
    return () => {
      dispatch(resetCountState());
    };
  }, [dispatch]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getDashboardStats());
      dispatch(getHourlyOrders());
      dispatch(getWeeklySales());
      dispatch(getMenuPopularity());
      dispatch(getRecentOrders());
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [dispatch]);

  // Handle error state
  if (isError) {
    return (
      <div className="p-4 md:p-6 w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-md mx-auto">
            <div className="text-red-500 dark:text-red-400 text-lg sm:text-xl mb-2">Error loading dashboard</div>
            <div className="text-gray-500 dark:text-gray-400 mb-4 text-sm sm:text-base px-4">{message}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 text-sm sm:text-base"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header - Mobile optimized */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 text-gray-500 dark:text-gray-400"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Stats Cards - Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {isLoading && dashboardStats.length === 0 ? (
            // Show skeleton loading for stats cards
            Array(4).fill(0).map((_, index) => (
              <StatsCardSkeleton key={index} />
            ))
          ) : (
            // Show actual stats cards
            (Array.isArray(dashboardStats) ? dashboardStats : []).map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={iconMap[stat.icon] || Utensils}
                change={stat.change}
                color={stat.color}
              />
            ))
          )}
        </div>
        
        {/* Charts Row - Stack on mobile, side by side on larger screens */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <SalesOverviewChart 
            salesData={Array.isArray(weeklySales) ? weeklySales : []} 
            isLoading={isLoading} 
          />
          <HourlyOrdersChart 
            hourlyOrdersData={Array.isArray(hourlyOrders) ? hourlyOrders : []} 
            isLoading={isLoading} 
          />
        </div>
        
        {/* Bottom Row - Reorganized for better mobile experience */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <PopularMenuItemsChart 
              menuItemsData={Array.isArray(menuPopularity) ? menuPopularity : []} 
              isLoading={isLoading} 
            />
          </div>
          <div className="lg:col-span-3">
            <RecentOrdersTable 
              orders={Array.isArray(recentOrders) ? recentOrders : []} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;