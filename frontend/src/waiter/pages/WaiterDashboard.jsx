import { useState, useEffect } from 'react';
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
  Search
} from 'lucide-react';
import { CustomCard, CustomModal, CustomInput } from '../componets/Customes';
import { Button } from "../../components/ui/button";

import OrderDetailsModal from "../modals/OrderDetailModal";
import StatsCard from '../componets/StatsCard';
import FilterMenu from '../componets/FilterMenu';
import TableCard from '../componets/TableCard';
import AssignTableModal from '../modals/AssignTableModal';
import TakeOrderModal from '../modals/TakeOrderModal';

// Mock data for tables
const initialTables = [
  {
    id: 1,
    status: 'available', // available, occupied, reserved
    capacity: 4,
    orders: []
  },
  {
    id: 2,
    status: 'occupied',
    capacity: 2,
    orders: [
      {
        id: 'ORD-101',
        dishes: [
          { name: 'Margherita Pizza', quantity: 1, status: 'pending', price: 12.99 },
          { name: 'Caesar Salad', quantity: 1, status: 'ready', price: 8.99 }
        ],
        time: '11:30 AM',
        total: 21.98
      }
    ]
  },
  {
    id: 3,
    status: 'reserved',
    capacity: 6,
    reservationName: 'Johnson Family',
    reservationTime: '12:30 PM',
    orders: []
  },
  {
    id: 4,
    status: 'occupied',
    capacity: 4,
    orders: [
      {
        id: 'ORD-102',
        dishes: [
          { name: 'Mushroom Risotto', quantity: 2, status: 'delivered', price: 14.99 },
          { name: 'Tiramisu', quantity: 2, status: 'pending', price: 6.99 }
        ],
        time: '11:15 AM',
        total: 43.96
      }
    ]
  },
  {
    id: 5,
    status: 'available',
    capacity: 2,
    orders: []
  },
  {
    id: 6,
    status: 'available',
    capacity: 8,
    orders: []
  }
];

// Mock data for menu items



const WaiterDashboard = () => {
  const [tables, setTables] = useState(initialTables);
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isTakeOrderModalOpen, setIsTakeOrderModalOpen] = useState(false);
  
  useEffect(() => {
    const checkDarkMode = () => {
      if (document) {
        setDarkMode(document.body.classList.contains('dark'));
      }
    };
    
    // Initial check
    checkDarkMode();

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
    available: tables.filter(table => table.status === 'available').length,
    occupied: tables.filter(table => table.status === 'occupied').length,
    reserved: tables.filter(table => table.status === 'reserved').length,
    total: tables.length
  };

  // Handle table assignment
  const handleAssignTable = (tableId, guestInfo) => {
    setTables(tables.map(table => 
      table.id === tableId 
        ? { ...table, status: 'occupied', guestInfo } 
        : table
    ));
    setIsAssignModalOpen(false);
  };

  // Handle submitting a new order
  const handleSubmitOrder = (tableId, orderData) => {
    const orderId = `ORD-${Math.floor(Math.random() * 900) + 100}`;
    
    setTables(tables.map(table => {
      if (table.id === tableId) {
        const updatedOrders = [...(table.orders || []), {
          id: orderId,
          ...orderData
        }];
        
        return { ...table, orders: updatedOrders };
      }
      return table;
    }));
    
    setIsTakeOrderModalOpen(false);
  };

  // Handle updating dish status
  const handleUpdateDishStatus = (tableId, orderId, dishIndex, newStatus) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        const updatedOrders = table.orders.map(order => {
          if (order.id === orderId) {
            const updatedDishes = order.dishes.map((dish, index) => 
              index === dishIndex ? { ...dish, status: newStatus } : dish
            );
            
            return { ...order, dishes: updatedDishes };
          }
          return order;
        });
        
        return { ...table, orders: updatedOrders };
      }
      return table;
    }));
    
    // Update the selected order to reflect the changes in the modal
    if (selectedOrder && selectedOrder.id === orderId) {
      const updatedOrder = tables
        .find(t => t.id === tableId)
        .orders.find(o => o.id === orderId);
      
      setSelectedOrder(updatedOrder);
    }
  };

  // Filter tables based on current filter
  const filteredTables = filter === 'all' 
    ? tables 
    : tables.filter(table => table.status === filter);

  return (
    <div className={cn(
      "p-4 md:p-6 w-full min-h-screen",
      darkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900"
    )}>
      <div className="mb-6">
        <h1 className={cn(
          "text-xl md:text-2xl font-bold mb-2",
          darkMode ? "text-white" : ""
        )}>Waiter Dashboard</h1>
        <p className={cn(
          "text-sm md:text-base",
          darkMode ? "text-slate-300" : "text-gray-500"
        )}>Manage tables and orders efficiently</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          title="Available Tables" 
          value={stats.available} 
          icon={CheckCircle} 
          color="bg-green-100" 
          darkMode={darkMode}
        />
        <StatsCard 
          title="Occupied Tables" 
          value={stats.occupied} 
          icon={Users} 
          color="bg-amber-100" 
          darkMode={darkMode}
        />
        <StatsCard 
          title="Reserved Tables" 
          value={stats.reserved} 
          icon={Clock} 
          color="bg-blue-100" 
          darkMode={darkMode}
        />
        <StatsCard 
          title="Total Tables" 
          value={stats.total} 
          icon={Utensils} 
          color="bg-purple-100" 
          darkMode={darkMode}
        />
      </div>
      
      {/* Search & Filter */}
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search tables..." 
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <FilterMenu filter={filter} setFilter={setFilter} darkMode={darkMode} />
      </div>
      
      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTables.map(table => (
          <TableCard 
            key={table.id} 
            table={table} 
            darkMode={darkMode}
            onAssign={(tableId) => {
              setSelectedTable(table);
              setIsAssignModalOpen(true);
            }}
            onTakeOrder={(tableId) => {
              setSelectedTable(table);
              setIsTakeOrderModalOpen(true);
            }}
            onViewOrder={(tableId) => {
              const table = tables.find(t => t.id === tableId);
              if (table && table.orders.length > 0) {
                setSelectedTable(table);
                setSelectedOrder(table.orders[0]); // Show the first order by default
                setIsOrderModalOpen(true);
              }
            }}
          />
        ))}
      </div>
      
      {/* Empty state */}
      {filteredTables.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-4 flex justify-center">
            <CheckCircle size={48} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-medium mb-2">No tables found</h3>
          <p className="text-gray-500">
            There are no {filter !== 'all' ? filter : ''} tables at the moment
          </p>
        </div>
      )}
      
      {/* Modals */}
      {selectedTable && (
        <>
          <OrderDetailsModal 
            open={isOrderModalOpen} 
            onClose={() => setIsOrderModalOpen(false)}
            order={selectedOrder}
            table={selectedTable}
            darkMode={darkMode}
            onUpdateStatus={handleUpdateDishStatus}
          />
          
          <AssignTableModal 
            open={isAssignModalOpen}
            onClose={() => setIsAssignModalOpen(false)}
            onAssign={handleAssignTable}
            tableId={selectedTable.id}
            darkMode={darkMode}
          />
          
          <TakeOrderModal 
            open={isTakeOrderModalOpen}
            onClose={() => setIsTakeOrderModalOpen(false)}
            onSubmitOrder={handleSubmitOrder}
            tableId={selectedTable.id}
            darkMode={darkMode}
          />
        </>
      )}
    </div>
  );
};

export default WaiterDashboard;