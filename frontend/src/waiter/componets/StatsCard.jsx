import React from "react";
import { cn } from "../../lib/utils";


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

export default StatsCard