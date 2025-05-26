import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Users,
  CheckCircle,
  Clock,
  Utensils,
  AlertCircle,
  Eye,
  Loader2,
  Table
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useDispatch, useSelector } from "react-redux";
import { 
  resetTableState, 
  fetchTables, 
  deleteTable 
} from "../../features/admin/table/tableSlice";

const TableCard = ({ table, onDelete, onView, isDeleting }) => {
  const { t } = useTranslation();
  
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'available':
        return {
          border: 'border-green-200',
          bg: 'bg-green-50',
          text: 'text-green-800',
          icon: 'text-green-600'
        };
      case 'occupied':
        return {
          border: 'border-amber-200',
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          icon: 'text-amber-600'
        };
      case 'reserved':
        return {
          border: 'border-blue-200',
          bg: 'bg-blue-50',
          text: 'text-blue-800',
          icon: 'text-blue-600'
        };
      case 'maintenance':
        return {
          border: 'border-red-200',
          bg: 'bg-red-50',
          text: 'text-red-800',
          icon: 'text-red-600'
        };
      default:
        return {
          border: 'border-gray-200',
          bg: 'bg-gray-50',
          text: 'text-gray-800',
          icon: 'text-gray-600'
        };
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'available':
        return CheckCircle;
      case 'occupied':
        return Users;
      case 'reserved':
        return Clock;
      case 'maintenance':
        return AlertCircle;
      default:
        return Utensils;
    }
  };

  const colors = getStatusColor(table.tablestatus);
  const StatusIcon = getStatusIcon(table.tablestatus);

  return (
    <div className={`bg-white rounded-lg border-2 ${colors.border} overflow-hidden hover:shadow-lg transition-all duration-300 group`}>
      {/* Table Image */}
      <div className="relative h-32 bg-gray-100 overflow-hidden">
        <img 
          src="/assets/—Pngtree—round daining table top view_8929444.png" 
          alt="Table"
          className="w-full h-full object-cover"
          onError={(e) => {
          
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-200 items-center justify-center hidden">
          <svg width="80" height="80" viewBox="0 0 100 100" className="text-amber-700">
            <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.3" />
            <circle cx="50" cy="50" r="35" fill="currentColor" opacity="0.5" />
            <circle cx="50" cy="50" r="25" fill="currentColor" opacity="0.7" />
          </svg>
        </div>
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${colors.text} ${colors.bg} border ${colors.border}`}>
          {t(`tablemanagement.status.${table.tablestatus.toLowerCase()}`)}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <StatusIcon className={`w-5 h-5 ${colors.icon}`} />
          <h3 className="font-semibold text-gray-900">{table.tablenumber}</h3>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span>{t("tablemanagement.capacity")}: {table.tablecapacity} {t("tablemanagement.people")}</span>
          </div>
          <div className="text-xs text-gray-500">
            {t("tablemanagement.created")}: {new Date(table.createdAt).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onView(table)}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700  text-sm group-hover:scale-105 transition-transform"
          >
            <Eye className="w-4 h-4 mr-1" />
            {t("tablemanagement.view")}
          </button>
          <button
            onClick={() => onDelete(table._id)}
            disabled={isDeleting}
            className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewTableModal = ({ isOpen, onClose, table }) => {
  const { t } = useTranslation();
  
  if (!isOpen || !table) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">{t("tablemanagement.modal.title")}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Table Image */}
          <div className="mb-6 h-32 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src="/assets/—Pngtree—round daining table top view_8929444.png" 
              alt="Table"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="h-full bg-gradient-to-br from-amber-100 to-amber-200 items-center justify-center hidden">
              <svg width="80" height="80" viewBox="0 0 100 100" className="text-amber-700">
                <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.3" />
                <circle cx="50" cy="50" r="35" fill="currentColor" opacity="0.5" />
                <circle cx="50" cy="50" r="25" fill="currentColor" opacity="0.7" />
              </svg>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("tablemanagement.modal.tablenumber")}</label>
                <p className="text-gray-900 font-semibold">{table.tablenumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("tablemanagement.modal.status")}</label>
                <p className="text-gray-900 capitalize">{t(`tablemanagement.status.${table.tablestatus.toLowerCase()}`)}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("tablemanagement.modal.capacity")}</label>
              <p className="text-gray-900">{table.tablecapacity} {t("tablemanagement.people")}</p>
            </div>
            
          
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            {t("tablemanagement.modal.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  // Redux state
  const { 
    tables, 
    isLoading, 
    isError, 
    message,
    isDeleting 
  } = useSelector((state) => state.table);

  const [selectedTable, setSelectedTable] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [deletingTableId, setDeletingTableId] = useState(null);

  // Fetch tables on component mount
  useEffect(() => {
    dispatch(resetTableState());  
    dispatch(fetchTables());
  }, [dispatch]);

  // Delete table
  const handleDeleteTable = async (id) => {
    setDeletingTableId(id);
    dispatch(deleteTable(id));
  };

  // View table details
  const handleViewTable = (table) => {
    setSelectedTable(table);
    setIsViewModalOpen(true);
  };

  return (
    <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3">           
          <Table className="w-8 h-8 text-black" strokeWidth={1.5} />
              <h1 className="text-2xl font-bold text-gray-800">{t("tablemanagement.title")}</h1>
            </div>
            <div className="text-sm text-gray-600">
              {t("tablemanagement.totaltables")}: {tables?.length || 0}
            </div>
          </div>
        
     

      <div className="flex-1 px-6 py-6 max-w-7xl w-full mx-auto">
        {/* Error Alert */}
        {isError && (
          <Alert className="bg-red-50 text-red-800 border border-red-200 mb-6">
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">{t("tablemanagement.loadingtables")}</span>
          </div>
        )}

        {/* Tables Grid */}
        {!isLoading && tables && tables.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tables.map(table => (
              <TableCard
                key={table._id}
                table={table}
                onDelete={handleDeleteTable}
                onView={handleViewTable}
                isDeleting={deletingTableId === table._id && isDeleting}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!tables || tables.length === 0) && (
          <div className="text-center py-12">
            <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t("tablemanagement.notablesfound")}</h3>
            <p className="text-gray-500">{t("tablemanagement.notablescreated")}</p>
          </div>
        )}
      </div>

      {/* View Table Modal */}
      <ViewTableModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        table={selectedTable}
      />
    </div>
  );
};

export default ViewTable;