import React from "react";
import { cn } from "../../lib/utils";
import {Users} from 'lucide-react';

const TableCard = ({ table, onAssign, onTakeOrder, onViewOrder, darkMode }) => {
  const statusColors = {
    available: darkMode 
      ? 'bg-green-900/30 text-green-300' 
      : 'bg-green-100 text-green-800',
    occupied: darkMode 
      ? 'bg-amber-900/30 text-amber-300' 
      : 'bg-yellow-100 text-yellow-800',
    reserved: darkMode 
      ? 'bg-blue-900/30 text-blue-300' 
      : 'bg-blue-100 text-blue-800'
  };

  const hasActiveOrders = table.orders && table.orders.length > 0;
  
  return (
    <div className={cn(
      "p-4 rounded-lg shadow-sm", 
      darkMode ? "bg-slate-800 text-white" : "bg-white"
    )}>
      <div className="flex mb-3">
        <div className="h-20 w-20 rounded-md overflow-hidden mr-3 flex-shrink-0">
          <img 
            src="/assets/—Pngtree—round daining table top view_8929444.png" 
            alt="Table" 
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className={cn(
              "font-medium", 
              darkMode ? "text-white" : "text-gray-900"
            )}>Table #{table.id}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[table.status]}`}>
              {table.status}
            </span>
          </div>
          <div className={cn(
            "text-sm mt-1 flex items-center", 
            darkMode ? "text-slate-300" : "text-gray-500"
          )}>
            <Users size={14} className="mr-1" />
            <span>Capacity: {table.capacity}</span>
          </div>
          {table.status === 'reserved' && (
            <div className={cn(
              "text-sm mt-1", 
              darkMode ? "text-slate-300" : "text-gray-500"
            )}>
              Reserved: {table.reservationName} ({table.reservationTime})
            </div>
          )}
          {hasActiveOrders && (
            <div className={cn(
              "text-sm mt-1", 
              darkMode ? "text-slate-400" : "text-gray-500"
            )}>
              {table.orders.length} active {table.orders.length === 1 ? 'order' : 'orders'}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between mt-3 gap-2">
        {table.status === 'available' && (
          <button 
            onClick={() => onAssign(table.id)}
            className={cn(
              "flex-1 py-2 rounded-md font-medium transition-colors",
              darkMode 
                ? "bg-blue-900/30 hover:bg-blue-800/50 text-blue-300" 
                : "bg-blue-100 hover:bg-blue-200 text-blue-800"
            )}
          >
            Assign Table
          </button>
        )}
        {table.status === 'occupied' && !hasActiveOrders && (
          <button 
            onClick={() => onTakeOrder(table.id)}
            className={cn(
              "flex-1 py-2 rounded-md font-medium transition-colors",
              darkMode 
                ? "bg-amber-900/30 hover:bg-amber-800/50 text-amber-300" 
                : "bg-amber-100 hover:bg-amber-200 text-amber-800"
            )}
          >
            Take Order
          </button>
        )}
        {hasActiveOrders && (
          <button 
            onClick={() => onViewOrder(table.id)}
            className={cn(
              "flex-1 py-2 rounded-md font-medium transition-colors",
              darkMode 
                ? "bg-purple-900/30 hover:bg-purple-800/50 text-purple-300" 
                : "bg-purple-100 hover:bg-purple-200 text-purple-800"
            )}
          >
            View Orders
          </button>
        )}
      </div>
    </div>
  );
};

export default TableCard