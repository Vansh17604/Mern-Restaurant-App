import React,{useState} from 'react'
import { Search,Plus } from 'lucide-react';

import { CustomCard, CustomModal, CustomInput } from '../componets/Customes';


const TakeOrderModal = ({ open, onClose, onSubmitOrder, tableId, darkMode }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [orderItems, setOrderItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
    const menuItems = [
  { id: 1, name: 'Margherita Pizza', category: 'Main', price: 12.99 },
  { id: 2, name: 'Mushroom Risotto', category: 'Main', price: 14.99 },
  { id: 3, name: 'Caesar Salad', category: 'Starter', price: 8.99 },
  { id: 4, name: 'Tiramisu', category: 'Dessert', price: 6.99 },
  { id: 5, name: 'Spaghetti Carbonara', category: 'Main', price: 13.99 },
  { id: 6, name: 'Bruschetta', category: 'Starter', price: 7.99 },
  { id: 7, name: 'Grilled Salmon', category: 'Main', price: 18.99 },
  { id: 8, name: 'Chocolate Cake', category: 'Dessert', price: 6.99 }
];
  
  const categories = ['All', ...new Set(menuItems.map(item => item.category))];

  
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const addToOrder = (item) => {
    const existingItem = orderItems.find(orderItem => orderItem.id === item.id);
    
    if (existingItem) {
      setOrderItems(orderItems.map(orderItem => 
        orderItem.id === item.id 
          ? { ...orderItem, quantity: orderItem.quantity + 1 } 
          : orderItem
      ));
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1, status: 'pending' }]);
    }
  };
  
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      setOrderItems(orderItems.filter(item => item.id !== itemId));
    } else {
      setOrderItems(orderItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };
  
  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const handleSubmitOrder = () => {
    if (orderItems.length === 0) return;
    
    const total = calculateTotal();
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    onSubmitOrder(tableId, {
      dishes: orderItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        status: 'pending'
      })),
      time,
      total
    });
    
    setOrderItems([]);
  };
  
  return (
    <CustomModal
      open={open}
      hideModal={onClose}
      performAction={handleSubmitOrder}
      title={`Take Order - Table #${tableId}`}
      description="Select menu items to add to the order"
    >
      <div className="py-4">
        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search menu..." 
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Category tabs */}
        <div className="flex overflow-x-auto space-x-2 pb-2 mb-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Menu items */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="flex justify-between items-center border rounded-md p-2 hover:bg-gray-50"
            >
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">${item.price.toFixed(2)}</div>
              </div>
              <button
                onClick={() => addToOrder(item)}
                className="p-1 bg-blue-100 text-blue-800 rounded-full"
              >
                <Plus size={16} />
              </button>
            </div>
          ))}
        </div>
        
        {/* Order summary */}
        {orderItems.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h4 className="font-medium mb-2">Order Summary</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {orderItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => updateQuantity(item.id, 0)}
                      className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-3">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomModal>
  );
};

export default TakeOrderModal