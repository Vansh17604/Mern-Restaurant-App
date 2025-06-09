import React, { useState, useEffect } from "react";
import { ChefHat, Pencil, Trash2, Search, DollarSign, Settings } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useDispatch, useSelector } from "react-redux";
import { CustomModal } from "../componets/Customes";
import gif from '/assets/Animation - 1747722366024.gif';
import { useTranslation } from "react-i18next";
import { 
  fetchDishes, 
  updateDish, 
  deleteDish,
  updateDishPriceAndCurrency,
  resetDishState
} from "../../features/admin/dish/dishSlice";
import { fetchactiveCategories } from "../../features/admin/category/categorySlice";
import { fetchActiveSubcategory } from "../../features/admin/subcategory/subcategorySlice";
import DishModal from "../componets/DishModal";

const ViewDish = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCurrencyConvertModalOpen, setIsCurrencyConvertModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [currencyConvertFormData, setCurrencyConvertFormData] = useState({
    currency: 'USD'
  });
  
  const base_url = import.meta.env.VITE_BASE_URL;
  
  // Get current language from i18next
  const currentLanguage = i18n.language || 'en';
  
  const dispatch = useDispatch();
  const { dishes, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.dish
  );
  const { categories } = useSelector((state) => state.category);
  const { subcategories } = useSelector((state) => state.subcategory);

  const getCurrencySymbol = (currencyCode) => {
    const currencies = t('viewdish.currencies', { returnObjects: true });
    const currency = currencies[currencyCode];
    return currency ? currency.symbol : currencyCode;
  };

  const getCurrentCurrency = () => {
    if (dishes.length > 0) {
      return dishes[0].currency || 'USD';
    }
    return 'USD';
  };

  useEffect(() => {
    dispatch(fetchDishes());
    dispatch(fetchactiveCategories());
    dispatch(fetchActiveSubcategory());
    
    return () => {
      dispatch(resetDishState());
    };
  }, [dispatch]);

  // Helper functions to handle different data structures
  const findCategoryById = (categoryData) => {
    if (typeof categoryData === 'object' && categoryData !== null && categoryData.categoryName) {
      return categoryData;
    }
    
    if (typeof categoryData === 'string') {
      return categories?.find(cat => cat._id === categoryData) || null;
    }
    
    return null;
  };

  const findSubcategoryById = (subcategoryData) => {
    if (typeof subcategoryData === 'object' && subcategoryData !== null && subcategoryData.subcategoryname) {
      return subcategoryData;
    }
    
    if (typeof subcategoryData === 'string') {
      return subcategories?.find(sub => sub._id === subcategoryData) || null;
    }
    
    return null;
  };

  // Filter dishes based on search term
  const filteredDishes = dishes.filter(dish => {
    const dishNameEn = dish.dishName?.en?.toLowerCase() || "";
    const dishNameEs = dish.dishName?.es?.toLowerCase() || "";
    const matchesDishName = dishNameEn.includes(searchTerm.toLowerCase()) || 
                           dishNameEs.includes(searchTerm.toLowerCase());
    
    const category = findCategoryById(dish.categoryid);
    const matchesCategoryName = category ? (
      (category.categoryName?.en?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (category.categoryName?.es?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    ) : false;

    const subcategory = findSubcategoryById(dish.subcategoryid);
    const matchesSubcategoryName = subcategory ? (
      (subcategory.subcategoryname?.en?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (subcategory.subcategoryname?.es?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    ) : false;

    const matchesPrice = dish.price?.toString().includes(searchTerm);

    return matchesDishName || matchesCategoryName || matchesSubcategoryName || matchesPrice;
  });

  const handleEdit = (dish) => {
    setSelectedDish(dish);
    setIsEditModalOpen(true);
  };

  const handleDelete = (dish) => {
    setSelectedDish(dish);
    setIsDeleteModalOpen(true);
  };

  const handleCurrencyConvert = () => {
    const currentCurrency = getCurrentCurrency();
    setCurrencyConvertFormData({
      currency: currentCurrency === 'USD' ? 'EUR' : 'USD'
    });
    setIsCurrencyConvertModalOpen(true);
  };

  const handleUpdateDish = (formData) => {
    dispatch(updateDish({ 
      id: selectedDish._id, 
      data: formData 
    }));
  };

  const handleConvertAllCurrency = async () => {
    try {
      const dataToSend = {
        currency: currencyConvertFormData.currency
      };

      await dispatch(updateDishPriceAndCurrency(dataToSend));
      
      setIsCurrencyConvertModalOpen(false);
      setCurrencyConvertFormData({
        currency: 'USD'
      });
      
      await dispatch(fetchDishes());
    } catch (error) {
      console.error(t('viewdish.err'), error);
    }
  };

  const handleDeleteDish = () => {
    dispatch(deleteDish(selectedDish._id));
    setIsDeleteModalOpen(false);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedDish(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedDish(null);
  };

  const closeCurrencyConvertModal = () => {
    setIsCurrencyConvertModalOpen(false);
    setCurrencyConvertFormData({
      currency: 'USD'
    });
  };

 const getDishDisplayName = (dish) => {
  if (!dish) return '';
  
  if (typeof dish.dishName === 'object') {
    if (currentLanguage === 'es') {
      return dish.dishName.es || dish.dishName.en || '';
    } else {
      return dish.dishName.en || dish.dishName.es || '';
    }
  }
  return dish.dishName || '';
};

  // Helper function to display category name based on current language
  const getCategoryDisplayName = (categoryData) => {
    const category = findCategoryById(categoryData);
    
    if (!category || !category.categoryName) return 'N/A';

    if (currentLanguage === 'es') {
      return category.categoryName.es || category.categoryName.en || 'N/A';
    } else {
      return category.categoryName.en || category.categoryName.es || 'N/A';
    }
  };

  // Helper function to display subcategory name based on current language
  const getSubcategoryDisplayName = (subcategoryData) => {
    const subcategory = findSubcategoryById(subcategoryData);
    
    if (!subcategory || !subcategory.subcategoryname) return 'N/A';

    if (currentLanguage === 'es') {
      return subcategory.subcategoryname.es || subcategory.subcategoryname.en || 'N/A';
    } else {
      return subcategory.subcategoryname.en || subcategory.subcategoryname.es || 'N/A';
    }
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
         <ChefHat className="w-8 h-8 text-black dark:text-white" strokeWidth={1.5} />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">{t('viewdish.title')}</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{t('viewdish.dis')}</p>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={handleCurrencyConvert}
            className="flex items-center px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white border border-purple-600 dark:border-purple-700 hover:bg-purple-700 dark:hover:bg-purple-800 hover:border-purple-700 dark:hover:border-purple-800 transition-all duration-200 rounded-md"
          >
            <Settings size={16} className="mr-2" />
            {t('viewdish.convert')}
          </Button>
          
          {dishes.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {t('viewdish.current')} <span className="font-medium">{getCurrentCurrency()}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <Input
            type="text"
            placeholder={t('viewdish.search')}
            className="pl-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Dishes Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-16 bg-white dark:bg-gray-800">
            <img
              src={gif}
              alt="Loading..."
              className="h-16 w-16"
            />
            <span className="ml-3 text-gray-600 dark:text-gray-300">{t('viewdish.load')}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('viewdish.label')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('viewdish.label1')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('viewdish.label2')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('viewdish.label3')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('viewdish.label4')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('viewdish.label5')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('viewdish.label6')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
                {filteredDishes.length > 0 ? (
                  filteredDishes.map((dish) => (
                    <tr key={dish._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {dish.imageUrl ? (
                          <img 
                            src={`${base_url}${dish.imageUrl}`} 
                            alt={getDishDisplayName(dish)}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
                            <ChefHat className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200 font-medium">
                        {getDishDisplayName(dish)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {getCategoryDisplayName(dish.categoryid)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {getSubcategoryDisplayName(dish.subcategoryid)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-800 dark:text-gray-200 font-medium">
                          {getCurrencySymbol(dish.currency || 'USD')}{dish.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center px-2 py-1 bg-blue-600 dark:bg-blue-700 text-white border border-blue-600 dark:border-blue-700 hover:bg-blue-500 dark:hover:bg-blue-600 hover:border-blue-500 dark:hover:border-blue-600 hover:text-white transition-all duration-200 rounded-md text-xs"
                          onClick={() => handleEdit(dish)}
                        >
                          <Pencil size={12} className="mr-1" />
                          {t('viewdish.label5')}
                        </Button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center px-2 py-1 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 hover:text-white hover:bg-red-600 dark:hover:bg-red-700 hover:border-red-600 dark:hover:border-red-700 transition-all duration-200 rounded-md text-xs"
                            onClick={() => handleDelete(dish)}
                          >
                            <Trash2 size={12} className="mr-1" />
                            {t('viewdish.label6')}
                          </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <ChefHat className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2" strokeWidth={1.5} />
                        <p className="text-lg font-medium">{t('viewdish.dis1')}</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t('viewdish.dis2')}</p>
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
      <DishModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleUpdateDish}
        selectedDish={selectedDish}
        categories={categories}
        subcategories={subcategories}
        isLoading={isLoading}
      />

      {/* Currency Conversion Modal */}
      <CustomModal
        open={isCurrencyConvertModalOpen}
        hideModal={closeCurrencyConvertModal}
        performAction={handleConvertAllCurrency}
        title={t('viewdish.convert1')}
        actionButtonText={t('viewdish.convert2')}
        actionButtonClass="bg-purple-600 hover:bg-purple-700 text-white"
      >
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <strong>{t('viewdish.convert3')}</strong> {t('viewdish.convert4')}
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <strong>{t('viewdish.convert5')}</strong> <span className="font-medium">{getCurrentCurrency()}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('viewdish.convert6')}
            </label>
            <select
              value={currencyConvertFormData.currency}
              onChange={(e) => setCurrencyConvertFormData(prev => ({
                ...prev,
                currency: e.target.value
              }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400"
              required
            >
              {Object.entries(t('viewdish.currencies', { returnObjects: true }))
                .filter(([code]) => code !== getCurrentCurrency())
                .map(([code, currency]) => (
                <option key={code} value={code}>
                  {currency.symbol} {code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          {currencyConvertFormData.currency !== getCurrentCurrency() && (
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
              <div className="text-sm text-green-700 dark:text-green-200">
                <strong>{t('viewdish.convert7')}</strong> {getCurrentCurrency()} → {currencyConvertFormData.currency}
                <br />
                <span className="text-xs">{t('viewdish.convert8')}</span>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 dark:text-gray-400">
            <strong>{t('viewdish.convert9')}</strong> {t('viewdish.convert10')} <span className="font-medium">{dishes.length}</span>
          </div>
        </div>
      </CustomModal>

      {/* Delete Confirmation Modal */}
      <CustomModal
        open={isDeleteModalOpen}
        hideModal={closeDeleteModal}
        performAction={handleDeleteDish}
        title={t('viewdish.delete')}
        description={`${t('viewdish.delete1')} "${getDishDisplayName(selectedDish)}"? ${t('viewdish.delete2')}`}
        actionButtonText={t('viewdish.delete3')}
        actionButtonClass="bg-red-600 hover:bg-red-700 text-white"
      />

      {/* Success/Error Messages */}
      {isError && (
        <Alert className="mt-4 border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/30">
          <AlertDescription className="text-red-800 dark:text-red-200">
            {message || "An error occurred while processing your request."}
          </AlertDescription>
        </Alert>
      )}

      {isSuccess && (
        <Alert className="mt-4 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/30">
          <AlertDescription className="text-green-800 dark:text-green-200">
            {t('viewdish.alert')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ViewDish;