import React, { useState, useEffect } from "react";
import { Users, Pencil, Trash2, Search, DollarSign, User } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useDispatch, useSelector } from "react-redux";
import { CustomModal } from "../componets/Customes";
import gif from '/assets/Animation - 1747722366024.gif';
import { useTranslation } from "react-i18next";
import { 
  fetchAllWaiters, 
  editWaiter, 
  deleteWaiter,
  resetWaiterState
} from "../../features/admin/waiter/waiterSlice";
import WaiterModal from "../componets/WaiterModal";

const ViewWaiter = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWaiter, setSelectedWaiter] = useState(null);
  
  const base_url = import.meta.env.VITE_BASE_URL;
  
  const currentLanguage = i18n.language || 'en';
  
  const dispatch = useDispatch();
  const { waiters, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.waiter
  );

 
  const waitersArray = Array.isArray(waiters) ? waiters : (waiters?.waiters || []);

 useEffect(() => {
  dispatch(fetchAllWaiters()).unwrap().catch(err => {
    console.error("Failed to fetch waiters:", err);
  });

  return () => {
    dispatch(resetWaiterState());
  };
}, [dispatch]);


  // Helper function to get waiter display name based on current language
  const getWaiterDisplayName = (waiter) => {
    if (!waiter || !waiter.name) return '';
    
    return waiter.name || '';
  };

  // Helper function to get waiter display address based on current language
  const getWaiterDisplayAddress = (waiter) => {
    if (!waiter || !waiter.address) return '';
    
    if (typeof waiter.address === 'object') {
      if (currentLanguage === 'es') {
        return waiter.address.es || waiter.address.en || '';
      } else {
        return waiter.address.en || waiter.address.es || '';
      }
    }
    return waiter.address || '';
  };

  // Helper function to get waiter display city based on current language
  const getWaiterDisplayCity = (waiter) => {
    if (!waiter || !waiter.city) return '';
    
    if (typeof waiter.city === 'object') {
      if (currentLanguage === 'es') {
        return waiter.city.es || waiter.city.en || '';
      } else {
        return waiter.city.en || waiter.city.es || '';
      }
    }
    return waiter.city || '';
  };

  // Filter waiters based on search term - use the extracted array
  const filteredWaiters = waitersArray.filter(waiter => {
    
    const matchesWaiterName = waiter.name?.includes(searchTerm.toLowerCase()); 
    
    const matchesEmail = waiter.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesPhone = waiter.phone?.includes(searchTerm) || false;
    
    const addressEn = waiter.address?.en?.toLowerCase() || "";
    const addressEs = waiter.address?.es?.toLowerCase() || "";
    const matchesAddress = addressEn.includes(searchTerm.toLowerCase()) || 
                          addressEs.includes(searchTerm.toLowerCase());

    const cityEn = waiter.city?.en?.toLowerCase() || "";
    const cityEs = waiter.city?.es?.toLowerCase() || "";
    const matchesCity = cityEn.includes(searchTerm.toLowerCase()) || 
                       cityEs.includes(searchTerm.toLowerCase());

    

    return matchesWaiterName || matchesEmail || matchesPhone || matchesAddress || matchesCity ;
  });

  const handleEdit = (waiter) => {
    setSelectedWaiter(waiter);
    setIsEditModalOpen(true);
  };

  const handleDelete = (waiter) => {
    setSelectedWaiter(waiter);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateWaiter = (formData) => {
    dispatch(editWaiter({ 
      id: selectedWaiter._id, 
      waiterData: formData 
    }));
  };

  const handleDeleteWaiter = () => {
    dispatch(deleteWaiter(selectedWaiter._id));
    setIsDeleteModalOpen(false);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedWaiter(null);
  };

  const closeDeleteModal = () => { 
    setIsDeleteModalOpen(false);
    setSelectedWaiter(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };



  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-black dark:text-white" strokeWidth={1.5} />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">{t('viewwaiter.title', 'View Waiters')}</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{t('viewwaiter.description', 'Manage and view all registered waiters')}</p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <Input
            type="text"
            placeholder={t('viewwaiter.search', 'Search waiters by name, email, phone, address, city, or salary...')}
            className="pl-10 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Waiters Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-16 bg-white dark:bg-gray-800">
            <img
              src={gif}
              alt="Loading..."
              className="h-16 w-16"
            />
            <span className="ml-3 text-gray-600 dark:text-gray-300">{t('viewwaiter.loading', 'Loading waiters...')}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('viewwaiter.photo', 'Photo')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('viewwaiter.name', 'Name')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('viewwaiter.email', 'Email')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('viewwaiter.phone', 'Phone')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('viewwaiter.address', 'Address')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('viewwaiter.city', 'City')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('viewwaiter.gender', 'Gender')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('viewwaiter.edit', 'Edit')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('viewwaiter.delete', 'Delete')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredWaiters.length > 0 ? (
                  filteredWaiters.map((waiter) => (
                    <tr key={waiter._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {waiter.photo ? (
                          <img 
                            src={`${base_url}${waiter.photo}`} 
                            alt={getWaiterDisplayName(waiter)}
                            className="w-12 h-12 object-cover rounded-full border border-gray-200 dark:border-gray-600"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-600">
                            <User className="w-6 h-6 text-gray-400 dark:text-gray-300" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200 font-medium">
                        {getWaiterDisplayName(waiter)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {waiter.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {waiter.phone}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-xs truncate">
                        {getWaiterDisplayAddress(waiter)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {getWaiterDisplayCity(waiter)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300 capitalize">
                        {waiter.gender}
                      </td>
                    
                   
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center px-2 py-1 bg-blue-600 dark:bg-blue-700 text-white border border-blue-600 dark:border-blue-700 hover:bg-blue-500 dark:hover:bg-blue-600 hover:border-blue-500 dark:hover:border-blue-600 hover:text-white transition-all duration-200 rounded-md text-xs"
                          onClick={() => handleEdit(waiter)}
                        >
                          <Pencil size={12} className="mr-1" />
                          {t('viewwaiter.edit', 'Edit')}
                        </Button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center px-2 py-1 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 hover:text-white hover:bg-red-600 dark:hover:bg-red-700 hover:border-red-600 dark:hover:border-red-700 transition-all duration-200 rounded-md text-xs"
                          onClick={() => handleDelete(waiter)}
                        >
                          <Trash2 size={12} className="mr-1" />
                          {t('viewwaiter.delete', 'Delete')}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <Users className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2" strokeWidth={1.5} />
                        <p className="text-lg font-medium">{t('viewwaiter.noWaiters', 'No waiters found')}</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t('viewwaiter.noWaitersDesc', 'Try adjusting your search or add new waiters')}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <WaiterModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleUpdateWaiter}
        selectedWaiter={selectedWaiter}
        isLoading={isLoading}
      />

      <CustomModal
        open={isDeleteModalOpen}
        hideModal={closeDeleteModal}
        performAction={handleDeleteWaiter}
        title={t('viewwaiter.deleteTitle', 'Delete Waiter')}
        description={`${t('viewwaiter.deleteConfirm', 'Are you sure you want to delete')} "${getWaiterDisplayName(selectedWaiter)}"? ${t('viewwaiter.deleteWarning', 'This action cannot be undone.')}`}
        actionButtonText={t('viewwaiter.deleteButton', 'Delete Waiter')}
        actionButtonClass="bg-red-600 hover:bg-red-700 text-white"
      />

      {/* Success/Error Messages */}
      {isError && (
        <Alert className="mt-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <AlertDescription className="text-red-800 dark:text-red-300">
            {message || t('viewwaiter.error', 'An error occurred while processing your request.')}
          </AlertDescription>
        </Alert>
      )}

      {isSuccess && (
        <Alert className="mt-4 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <AlertDescription className="text-green-800 dark:text-green-300">
            {t('viewwaiter.success', 'Operation completed successfully!')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ViewWaiter;