import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Utensils, Coffee, DollarSign } from 'lucide-react';
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
} from '../../features/admin/count/countSlice'; // Adjust import path as needed

// StatsCard Component
const StatsCard = ({ title, value, icon: Icon, change, color }) => (
  <div className="p-6 rounded-lg shadow-sm bg-white">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="text-sm font-medium text-green-600">
      {change} <span className="text-gray-500">from last month</span>
    </div>
  </div>
);

// SalesOverviewChart Component
const SalesOverviewChart = ({ salesData, isLoading }) => (
  <div className="p-6 rounded-lg shadow-sm bg-white">
    <h3 className="text-lg font-medium mb-6">Sales Overview</h3>
    {isLoading ? (
      <div className="flex items-center justify-center h-[300px]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
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

// HourlyOrdersChart Component
const HourlyOrdersChart = ({ hourlyOrdersData, isLoading }) => (
  <div className="p-6 rounded-lg shadow-sm bg-white">
    <h3 className="text-lg font-medium mb-6">Hourly Orders</h3>
    {isLoading ? (
      <div className="flex items-center justify-center h-[300px]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={hourlyOrdersData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="orders" fill="#8884d8" name="Orders" />
        </BarChart>
      </ResponsiveContainer>
    )}
  </div>
);

// PopularMenuItemsChart Component
const PopularMenuItemsChart = ({ menuItemsData, isLoading }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <div className="p-6 rounded-lg shadow-sm bg-white col-span-1 lg:col-span-1">
      <h3 className="text-lg font-medium mb-6">Popular Menu Items</h3>
      {isLoading ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={menuItemsData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {menuItemsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

// RecentOrdersTable Component
const RecentOrdersTable = ({ orders, isLoading }) => {
  // Status badge color mapping
  const statusColorMap = {
    'Completed': 'bg-green-100 text-green-800',
    'Preparing': 'bg-yellow-100 text-yellow-800',
    'Delivered': 'bg-blue-100 text-blue-800',
    'Processing': 'bg-purple-100 text-purple-800',
    'Pending': 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="p-6 rounded-lg shadow-sm bg-white col-span-1 lg:col-span-2">
      <h3 className="text-lg font-medium mb-6">Recent Orders</h3>
      {isLoading ? (
        <div className="flex items-center justify-center h-[200px]">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order, i) => (
                <tr key={i}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{order.amount}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{order.time}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorMap[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Loading Skeleton for Stats Cards
const StatsCardSkeleton = () => (
  <div className="p-6 rounded-lg shadow-sm bg-white animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-24"></div>
  </div>
);

// Icon mapping for stats cards
const iconMap = {
  'Utensils': Utensils,
  'DollarSign': DollarSign,
  'Coffee': Coffee,
  'Users': Users
};

// Main Dashboard Component
const AdminDashboard = () => {
  const dispatch = useDispatch();
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
      <div className="p-4 md:p-6 w-full bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-2">Error loading dashboard</div>
            <div className="text-gray-500 mb-4">{message}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 w-full bg-gray-50 min-h-screen">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold mb-2">Restaurant Admin Dashboard</h1>
        <p className="text-sm md:text-base text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>
      
      {/* Stats Cards - Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <PopularMenuItemsChart 
          menuItemsData={Array.isArray(menuPopularity) ? menuPopularity : []} 
          isLoading={isLoading} 
        />
        <RecentOrdersTable 
          orders={Array.isArray(recentOrders) ? recentOrders : []} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default AdminDashboard;