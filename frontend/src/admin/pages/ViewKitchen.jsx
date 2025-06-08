import React, { useState, useEffect } from "react";
import { ChefHat, Pencil, Trash2, Search, User } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useDispatch, useSelector } from "react-redux";
import { CustomModal } from "../componets/Customes";
import gif from '/assets/Animation - 1747722366024.gif';
import { useTranslation } from "react-i18next";
import { 
  fetchAllKitchens, 
  editKitchen, 
  deleteKitchen,
  resetKitchenState
} from "../../features/admin/kitchen/kitchenSlice";
import KitchenModal from "../componets/KitchenModal";

const ViewKitchen = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedKitchen, setSelectedKitchen] = useState(null);
  
  const base_url = import.meta.env.VITE_BASE_URL;
  
  const currentLanguage = i18n.language || 'en';
  
  const dispatch = useDispatch();
  const { kitchens, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.kitchen
  );


  const kitchensArray = Array.isArray(kitchens) ? kitchens : (kitchens?.kitchens || []);

  useEffect(() => {
    dispatch(fetchAllKitchens()).unwrap().catch(err => {
      console.error("Failed to fetch kitchens:", err);
    });

    return () => {
      dispatch(resetKitchenState());
    };
  }, [dispatch]);

  // Helper function to get kitchen display name based on current language
  const getKitchenDisplayName = (kitchen) => {
    if (!kitchen || !kitchen.name) return '';
    
    
    return kitchen.name || '';
  };

  // Helper function to get kitchen display address based on current language
  const getKitchenDisplayAddress = (kitchen) => {
    if (!kitchen || !kitchen.address) return '';
    
    if (typeof kitchen.address === 'object') {
      if (currentLanguage === 'es') {
        return kitchen.address.es || kitchen.address.en || '';
      } else {
        return kitchen.address.en || kitchen.address.es || '';
      }
    }
    return kitchen.address || '';
  };

  // Helper function to get kitchen display city based on current language
  const getKitchenDisplayCity = (kitchen) => {
    if (!kitchen || !kitchen.city) return '';
    
    if (typeof kitchen.city === 'object') {
      if (currentLanguage === 'es') {
        return kitchen.city.es || kitchen.city.en || '';
      } else {
        return kitchen.city.en || kitchen.city.es || '';
      }
    }
    return kitchen.city || '';
  };

  // Filter kitchens based on search term - use the extracted array
  const filteredKitchens = kitchensArray.filter(kitchen => {

    const matchesKitchenName = kitchen.name?.includes(searchTerm.toLowerCase());
    
    const matchesEmail = kitchen.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesPhone = kitchen.phone?.includes(searchTerm) || false;
    
    const addressEn = kitchen.address?.en?.toLowerCase() || "";
    const addressEs = kitchen.address?.es?.toLowerCase() || "";
    const matchesAddress = addressEn.includes(searchTerm.toLowerCase()) || 
                          addressEs.includes(searchTerm.toLowerCase());

    const cityEn = kitchen.city?.en?.toLowerCase() || "";
    const cityEs = kitchen.city?.es?.toLowerCase() || "";
    const matchesCity = cityEn.includes(searchTerm.toLowerCase()) || 
                       cityEs.includes(searchTerm.toLowerCase());

    return matchesKitchenName || matchesEmail || matchesPhone || matchesAddress || matchesCity;
  });

  const handleEdit = (kitchen) => {
    setSelectedKitchen(kitchen);
    setIsEditModalOpen(true);
  };

  const handleDelete = (kitchen) => {
    setSelectedKitchen(kitchen);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateKitchen = (formData) => {
    dispatch(editKitchen({ 
      id: selectedKitchen._id, 
      kitchenData: formData 
    }));
  };

  const handleDeleteKitchen = () => {
    dispatch(deleteKitchen(selectedKitchen._id));
    setIsDeleteModalOpen(false);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedKitchen(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedKitchen(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <ChefHat className="w-8 h-8 text-black dark:text-white" strokeWidth={1.5} />
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{t('viewkitchen.title', 'View Kitchen Staff')}</h1>
        </div>
        <p className="text-gray-500 text-sm">{t('viewkitchen.description', 'Manage and view all registered kitchen staff')}</p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder={t('viewkitchen.search', 'Search kitchen staff by name, email, phone, address, city, or salary...')}
            className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Kitchen Staff Table */}
      <div className="border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <img
              src={gif}
              alt="Loading..."
              className="h-16 w-16"
            />
            <span className="ml-3 text-gray-600">{t('viewkitchen.loading', 'Loading kitchen staff...')}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('viewkitchen.photo', 'Photo')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('viewkitchen.name', 'Name')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('viewkitchen.email', 'Email')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('viewkitchen.phone', 'Phone')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('viewkitchen.address', 'Address')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('viewkitchen.city', 'City')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('viewkitchen.gender', 'Gender')}</th>
               
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('viewkitchen.edit', 'Edit')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('viewkitchen.delete', 'Delete')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredKitchens.length > 0 ? (
                  filteredKitchens.map((kitchen) => (
                    <tr key={kitchen._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {kitchen.photo ? (
                          <img 
                            src={`${base_url}${kitchen.photo}`} 
                            alt={getKitchenDisplayName(kitchen)}
                            className="w-12 h-12 object-cover rounded-full border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                            <User className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                        {getKitchenDisplayName(kitchen)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {kitchen.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {kitchen.phone}
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                        {getKitchenDisplayAddress(kitchen)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {getKitchenDisplayCity(kitchen)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 capitalize">
                        {kitchen.gender}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center px-2 py-1 bg-blue-600 text-white border border-blue-600 hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-all duration-200 rounded-md text-xs"
                          onClick={() => handleEdit(kitchen)}
                        >
                          <Pencil size={12} className="mr-1" />
                          {t('viewkitchen.edit', 'Edit')}
                        </Button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center px-2 py-1 text-red-600 border border-red-300 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-200 rounded-md text-xs"
                          onClick={() => handleDelete(kitchen)}
                        >
                          <Trash2 size={12} className="mr-1" />
                          {t('viewkitchen.delete', 'Delete')}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="px-6 py-10 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <ChefHat className="w-10 h-10 text-gray-400 mb-2" strokeWidth={1.5} />
                        <p className="text-lg font-medium">{t('viewkitchen.noKitchens', 'No kitchen staff found')}</p>
                        <p className="text-sm text-gray-400 mt-1">{t('viewkitchen.noKitchensDesc', 'Try adjusting your search or add new kitchen staff')}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <KitchenModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleUpdateKitchen}
        selectedKitchen={selectedKitchen}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <CustomModal
        open={isDeleteModalOpen}
        hideModal={closeDeleteModal}
        performAction={handleDeleteKitchen}
        title={t('viewkitchen.deleteTitle', 'Delete Kitchen Staff')}
        description={`${t('viewkitchen.deleteConfirm', 'Are you sure you want to delete')} "${getKitchenDisplayName(selectedKitchen)}"? ${t('viewkitchen.deleteWarning', 'This action cannot be undone.')}`}
        actionButtonText={t('viewkitchen.deleteButton', 'Delete Kitchen Staff')}
        actionButtonClass="bg-red-600 hover:bg-red-700 text-white"
      />

      {/* Success/Error Messages */}
      {isError && (
        <Alert className="mt-4 border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {message || t('viewkitchen.error', 'An error occurred while processing your request.')}
          </AlertDescription>
        </Alert>
      )}

      {isSuccess && (
        <Alert className="mt-4 border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            {t('viewkitchen.success', 'Operation completed successfully!')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ViewKitchen;