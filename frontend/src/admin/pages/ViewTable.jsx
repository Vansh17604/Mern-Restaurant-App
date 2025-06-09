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
  Table,
  Edit
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useDispatch, useSelector } from "react-redux";
import { 
  resetTableState, 
  fetchTables, 
  deleteTable,
  updateTable 
} from "../../features/admin/table/tableSlice";

const TableCard = ({ table, onDelete, onView, onEdit, isDeleting }) => {
  const { t } = useTranslation();
  
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'available':
        return {
          border: 'border-green-200 dark:border-green-700',
          bg: 'bg-green-50 dark:bg-green-900/30',
          text: 'text-green-800 dark:text-green-300',
          icon: 'text-green-600 dark:text-green-400'
        };
      case 'occupied':
        return {
          border: 'border-amber-200 dark:border-amber-700',
          bg: 'bg-amber-50 dark:bg-amber-900/30',
          text: 'text-amber-800 dark:text-amber-300',
          icon: 'text-amber-600 dark:text-amber-400'
        };
      case 'reserved':
        return {
          border: 'border-blue-200 dark:border-blue-700',
          bg: 'bg-blue-50 dark:bg-blue-900/30',
          text: 'text-blue-800 dark:text-blue-300',
          icon: 'text-blue-600 dark:text-blue-400'
        };
      case 'maintenance':
        return {
          border: 'border-red-200 dark:border-red-700',
          bg: 'bg-red-50 dark:bg-red-900/30',
          text: 'text-red-800 dark:text-red-300',
          icon: 'text-red-600 dark:text-red-400'
        };
      default:
        return {
          border: 'border-gray-200 dark:border-gray-700',
          bg: 'bg-gray-50 dark:bg-gray-800/30',
          text: 'text-gray-800 dark:text-gray-300',
          icon: 'text-gray-600 dark:text-gray-400'
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
    <div className={`bg-white dark:bg-gray-800 rounded-lg border-2 ${colors.border} overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 group`}>
      {/* Table Image */}
      <div className="relative h-32 bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <img 
          src="/assets/—Pngtree—round daining table top view_8929444.png" 
          alt="Table"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-800 dark:to-amber-900 items-center justify-center hidden">
          <svg width="80" height="80" viewBox="0 0 100 100" className="text-amber-700 dark:text-amber-300">
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
          <h3 className="font-semibold text-gray-900 dark:text-white">{table.tablenumber}</h3>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Users className="w-4 h-4 mr-2" />
            <span>{t("tablemanagement.capacity")}: {table.tablecapacity} {t("tablemanagement.people")}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {t("tablemanagement.created")}: {new Date(table.createdAt).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onView(table)}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 text-sm group-hover:scale-105 transition-transform"
          >
            <Eye className="w-4 h-4 mr-1" />
            {t("tablemanagement.view")}
          </button>
          <button
            onClick={() => onEdit(table)}
            className="flex items-center justify-center px-3 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-sm"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(table._id)}
            disabled={isDeleting}
            className="flex items-center justify-center px-3 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("tablemanagement.modal.title")}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Table Image */}
          <div className="mb-6 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <img 
              src="/assets/—Pngtree—round daining table top view_8929444.png" 
              alt="Table"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="h-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-800 dark:to-amber-900 items-center justify-center hidden">
              <svg width="80" height="80" viewBox="0 0 100 100" className="text-amber-700 dark:text-amber-300">
                <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.3" />
                <circle cx="50" cy="50" r="35" fill="currentColor" opacity="0.5" />
                <circle cx="50" cy="50" r="25" fill="currentColor" opacity="0.7" />
              </svg>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("tablemanagement.modal.tablenumber")}</label>
                <p className="text-gray-900 dark:text-white font-semibold">{table.tablenumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("tablemanagement.modal.status")}</label>
                <p className="text-gray-900 dark:text-white capitalize">{t(`tablemanagement.status.${table.tablestatus.toLowerCase()}`)}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("tablemanagement.modal.capacity")}</label>
              <p className="text-gray-900 dark:text-white">{table.tablecapacity} {t("tablemanagement.people")}</p>
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            {t("tablemanagement.modal.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

const EditTableModal = ({ isOpen, onClose, table, onSave, isUpdating }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    tablenumber: '',
    tablecapacity: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (table) {
      setFormData({
        tablenumber: table.tablenumber || '',
        tablecapacity: table.tablecapacity || ''
      });
      setErrors({});
    }
  }, [table]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tablenumber.trim()) {
      newErrors.tablenumber = 'Table number is required';
    }
    
    if (!formData.tablecapacity.trim()) {
      newErrors.tablecapacity = 'Table capacity is required';
    } else if (isNaN(formData.tablecapacity) || parseInt(formData.tablecapacity) <= 0) {
      newErrors.tablecapacity = 'Table capacity must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(table._id, {
        tablenumber: formData.tablenumber.trim(),
        tablecapacity: parseInt(formData.tablecapacity)
      });
    }
  };

  if (!isOpen || !table) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-4">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("tablemanagement.edit.title") || "Edit Table"}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
              disabled={isUpdating}
            >
              ×
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("tablemanagement.edit.tablenumber") || "Table Number"}
              </label>
              <input
                type="text"
                name="tablenumber"
                value={formData.tablenumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.tablenumber ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter table number"
                disabled={isUpdating}
              />
              {errors.tablenumber && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.tablenumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("tablemanagement.edit.capacity") || "Table Capacity"}
              </label>
              <input
                type="number"
                name="tablecapacity"
                value={formData.tablecapacity}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.tablecapacity ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter table capacity"
                min="1"
                disabled={isUpdating}
              />
              {errors.tablecapacity && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.tablecapacity}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              disabled={isUpdating}
            >
              {t("tablemanagement.edit.cancel") || "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {t("tablemanagement.edit.updating") || "Updating..."}
                </>
              ) : (
                t("tablemanagement.edit.save") || "Save Changes"
              )}
            </button>
          </div>
        </form>
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
    message 
  } = useSelector((state) => state.table);

  const [selectedTable, setSelectedTable] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [deletingTableId, setDeletingTableId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

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

  // Edit table
  const handleEditTable = (table) => {
    setEditingTable(table);
    setIsEditModalOpen(true);
  };

  // Save edited table
  const handleSaveTable = async (id, data) => {
    setIsUpdating(true);
    try {
      await dispatch(updateTable({ id, data })).unwrap();
      setIsEditModalOpen(false);
      setEditingTable(null);
    } catch (error) {
      // Error is handled by Redux and toast
      console.error('Update failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3">           
          <Table className="w-8 h-8 text-black dark:text-white" strokeWidth={1.5} />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t("tablemanagement.title")}</h1>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {t("tablemanagement.totaltables")}: {tables?.length || 0}
        </div>
      </div>

      <div className="flex-1 px-6 py-6 max-w-7xl w-full mx-auto">
        {/* Error Alert */}
        {isError && (
          <Alert className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700 mb-6">
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">{t("tablemanagement.loadingtables")}</span>
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
                onEdit={handleEditTable}
                isDeleting={deletingTableId === table._id && isLoading}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!tables || tables.length === 0) && (
          <div className="text-center py-12">
            <Utensils className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t("tablemanagement.notablesfound")}</h3>
            <p className="text-gray-500 dark:text-gray-400">{t("tablemanagement.notablescreated")}</p>
          </div>
        )}
      </div>

      {/* View Table Modal */}
      <ViewTableModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        table={selectedTable}
      />

      {/* Edit Table Modal */}
      <EditTableModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTable(null);
        }}
        table={editingTable}
        onSave={handleSaveTable}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default ViewTable;