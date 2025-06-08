import React from "react";
import { cn } from "../../lib/utils";

const FilterMenu = ({ filter, setFilter, darkMode }) => {
  const btn = (value, label) => (
    <button
      onClick={() => setFilter(value)}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors outline-none",
        // shared base
        darkMode
          ? "text-slate-300 hover:text-amber-300 focus-visible:text-amber-300"
          : "text-gray-700 hover:text-blue-800 focus-visible:text-blue-800",
        // active “tab” styling
        filter === value
          ? darkMode
            ? "border-b-2 border-amber-400 text-amber-300"
            : "border-b-2 border-blue-600 text-blue-800"
          : "border-b-2 border-transparent"
      )}
    >
      {label}
    </button>
  );

  return (
    <nav
      className={cn(
        "flex gap-4 mb-4 border-b",
        darkMode ? "border-slate-600" : "border-gray-300"
      )}
    >
      {btn("all", "All Tables")}
      {btn("available", "Available")}
      {btn("order", "Occupied")}
      {btn("reserved", "Reserved")}
    </nav>
  );
};

export default FilterMenu;
