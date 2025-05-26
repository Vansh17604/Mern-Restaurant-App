import React from 'react';
import { cn } from "../../lib/utils";

const FilterMenu = ({ filter, setFilter, darkMode }) => {

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
        All Tables
      </button>
      <button 
        onClick={() => setFilter('available')}
        className={filterButtonClass('available')}
      >
        Available
      </button>
      <button 
        onClick={() => setFilter('occupied')}
        className={filterButtonClass('occupied')}
      >
        Occupied
      </button>
      <button 
        onClick={() => setFilter('reserved')}
        className={filterButtonClass('reserved')}
      >
        Reserved
      </button>
    </div>
  );
};

export default FilterMenu;