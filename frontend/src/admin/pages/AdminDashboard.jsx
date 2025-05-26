import { useState } from 'react';
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
      {change} <span className="text-gray-500">from last week</span>
    </div>
  </div>
);

// SalesOverviewChart Component
const SalesOverviewChart = ({ salesData }) => (
  <div className="p-6 rounded-lg shadow-sm bg-white">
    <h3 className="text-lg font-medium mb-6">Sales Overview</h3>
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
  </div>
);

// HourlyOrdersChart Component
const HourlyOrdersChart = ({ hourlyOrdersData }) => (
  <div className="p-6 rounded-lg shadow-sm bg-white">
    <h3 className="text-lg font-medium mb-6">Hourly Orders</h3>
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
  </div>
);

// PopularMenuItemsChart Component
const PopularMenuItemsChart = ({ menuItemsData }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <div className="p-6 rounded-lg shadow-sm bg-white col-span-1 lg:col-span-1">
      <h3 className="text-lg font-medium mb-6">Popular Menu Items</h3>
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
    </div>
  );
};

// RecentOrdersTable Component
const RecentOrdersTable = ({ orders }) => {
  // Status badge color mapping
  const statusColorMap = {
    'Completed': 'bg-green-100 text-green-800',
    'Preparing': 'bg-yellow-100 text-yellow-800',
    'Delivered': 'bg-blue-100 text-blue-800',
    'Processing': 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="p-6 rounded-lg shadow-sm bg-white col-span-1 lg:col-span-2">
      <h3 className="text-lg font-medium mb-6">Recent Orders</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order, i) => (
              <tr key={i}>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{order.amount}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{order.time}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorMap[order.status]}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Dashboard Component
const AdminDashboard = () => {
  // Static data for dashboard widgets
  const statsCards = [
    { title: 'Total Orders', value: '1,248', icon: Utensils, change: '+12%', color: 'bg-blue-100' },
    { title: 'Total Revenue', value: '$8,546', icon: DollarSign, change: '+18%', color: 'bg-green-100' },
    { title: 'Active Tables', value: '24', icon: Coffee, change: '+5%', color: 'bg-amber-100' },
    { title: 'Customers', value: '843', icon: Users, change: '+7%', color: 'bg-purple-100' }
  ];
  
  // Data for sales overview chart (daily sales for a week)
  const salesData = [
    { name: 'Mon', sales: 1200, orders: 145 },
    { name: 'Tue', sales: 1900, orders: 190 },
    { name: 'Wed', sales: 1500, orders: 160 },
    { name: 'Thu', sales: 2400, orders: 230 },
    { name: 'Fri', sales: 2800, orders: 280 },
    { name: 'Sat', sales: 3500, orders: 340 },
    { name: 'Sun', sales: 2700, orders: 270 }
  ];
  
  // Data for popular menu items
  const menuItemsData = [
    { name: 'Pasta', value: 35 },
    { name: 'Pizza', value: 25 },
    { name: 'Burger', value: 20 },
    { name: 'Salad', value: 15 },
    { name: 'Dessert', value: 5 }
  ];
  
  // Data for hourly orders
  const hourlyOrdersData = [
    { name: '9AM', orders: 12 },
    { name: '10AM', orders: 19 },
    { name: '11AM', orders: 25 },
    { name: '12PM', orders: 45 },
    { name: '1PM', orders: 52 },
    { name: '2PM', orders: 35 },
    { name: '3PM', orders: 20 },
    { name: '4PM', orders: 15 },
    { name: '5PM', orders: 22 },
    { name: '6PM', orders: 38 },
    { name: '7PM', orders: 50 },
    { name: '8PM', orders: 42 },
    { name: '9PM', orders: 28 },
    { name: '10PM', orders: 15 }
  ];
  
  // Recent orders data
  const recentOrders = [
    { id: '#ORD-001', customer: 'John Smith', amount: '$45.80', status: 'Completed', time: '10:45 AM' },
    { id: '#ORD-002', customer: 'Alice Johnson', amount: '$32.50', status: 'Preparing', time: '11:10 AM' },
    { id: '#ORD-003', customer: 'Robert Brown', amount: '$78.25', status: 'Delivered', time: '11:45 AM' },
    { id: '#ORD-004', customer: 'Emily Wilson', amount: '$24.99', status: 'Processing', time: '12:15 PM' },
    { id: '#ORD-005', customer: 'Michael Davis', amount: '$56.40', status: 'Completed', time: '12:30 PM' },
  ];

  return (
    <div className="p-4 md:p-6 w-full bg-gray-50 min-h-screen">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold mb-2">Restaurant Admin Dashboard</h1>
        <p className="text-sm md:text-base text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>
      
      {/* Stats Cards - Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {statsCards.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            color={stat.color}
          />
        ))}
      </div>
      
      {/* Charts Row - Stack on mobile, side by side on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <SalesOverviewChart salesData={salesData} />
        <HourlyOrdersChart hourlyOrdersData={hourlyOrdersData} />
      </div>
      
      {/* Bottom Row - Reorganized for better mobile experience */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <PopularMenuItemsChart menuItemsData={menuItemsData} />
        <RecentOrdersTable orders={recentOrders} />
      </div>
    </div>
  );
};

export default AdminDashboard;