import React from 'react';

import { CustomCard, CustomModal, CustomInput } from '../componets/Customes';

const OrderDetailsModal = ({ open, onClose, order, table, onUpdateStatus, darkMode }) => {

  if (!order) return null;

  
  const getStatusBadge = (status) => {
    const statusColors = {
      pending: darkMode 
        ? 'bg-amber-900/30 text-amber-300' 
        : 'bg-yellow-100 text-yellow-800',
      ready: darkMode 
        ? 'bg-blue-900/30 text-blue-300' 
        : 'bg-blue-100 text-blue-800',
      delivered: darkMode 
        ? 'bg-green-900/30 text-green-300' 
        : 'bg-green-100 text-green-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
        {status}
      </span>
    );
  };

  const getNextStatus = (currentStatus) => {
    if (currentStatus === 'pending') return 'ready';
    if (currentStatus === 'ready') return 'delivered';
    return null;
  };

  return (
    <CustomModal
      open={open}
      hideModal={onClose}
      performAction={() => {}}
      title={`Order #${order.id} - Table #${table.id}`}
      description="Order details and status"
    >
      <div className="mt-4">
        <div className="border-b pb-2 mb-4">
          <div className="text-sm text-gray-500">Order Time: {order.time}</div>
        </div>
        
        <div className="space-y-3">
          {order.dishes.map((dish, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">{dish.name}</span>
                  <span>${dish.price.toFixed(2)} × {dish.quantity}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="text-sm text-gray-500">
                    ${(dish.price * dish.quantity).toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(dish.status)}
                    {dish.status !== 'delivered' && (
                      <button 
                        onClick={() => onUpdateStatus(table.id, order.id, index, getNextStatus(dish.status))}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Mark {getNextStatus(dish.status)}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t mt-4 pt-3">
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default OrderDetailsModal