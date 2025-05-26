import React,{useState} from 'react';

import { CustomCard, CustomModal, CustomInput } from '../componets/Customes';


const AssignTableModal = ({ open, onClose, onAssign, tableId, darkMode }) => {
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  
  const handleAssign = () => {
    onAssign(tableId, {
      name: guestName,
      count: guestCount
    });
    setGuestName('');
    setGuestCount(1);
  };
  
  return (
    <CustomModal
      open={open}
      hideModal={onClose}
      performAction={handleAssign}
      title={`Assign Table #${tableId}`}
      description="Enter customer details"
    >
      <div className="space-y-4 py-4">
        <CustomInput
          label="Customer Name (Optional)"
          id="guest-name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
        />
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Number of Guests</label>
          <div className="flex items-center">
            <button 
              onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
              className="p-2 rounded-l-md border border-gray-300 bg-gray-50"
            >
              -
            </button>
            <input
              type="number"
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
              className="w-16 text-center border-t border-b border-gray-300 py-2"
              min="1"
            />
            <button 
              onClick={() => setGuestCount(guestCount + 1)}
              className="p-2 rounded-r-md border border-gray-300 bg-gray-50"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default AssignTableModal