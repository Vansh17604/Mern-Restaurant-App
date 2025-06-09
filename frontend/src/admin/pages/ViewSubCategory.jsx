import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Tag, Loader2, Pencil, Trash2, Search, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useDispatch, useSelector } from "react-redux";
import { CustomInput, CustomModal } from "../componets/Customes";
import gif from '/assets/Animation - 1747722366024.gif';
import { 
  fetchSubcategory, 
  updateSubcategory, 
  deleteSubcategory, 
  resetSubcategoryState,
  updateSubcategoryStatus
} from "../../features/admin/subcategory/subcategorySlice";
import { fetchactiveCategories } from "../../features/admin/category/categorySlice";

export default function ViewSubCategory() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language; // Get current language (en or es)
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [formData, setFormData] = useState({
    subcategoryname: {
      en: "",
      es: ""
    },
    categoryid: "",
    status: ""
  });
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const { subcategories, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.subcategory
  );
  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchSubcategory());
    dispatch(fetchactiveCategories());
    
    return () => {
      dispatch(resetSubcategoryState());
    };
  }, [dispatch]);

  const findCategoryById = (categoryData) => {
    // If categoryData is already a populated object with categoryName
    if (typeof categoryData === 'object' && categoryData !== null && categoryData.categoryName) {
      return categoryData;
    }
    
    // If categoryData is just an ID string, find it in the categories array
    if (typeof categoryData === 'string') {
      return categories?.find(cat => cat._id === categoryData) || null;
    }
    
    return null;
  };

  // Helper function to get category ID - handles both cases
  const getCategoryId = (categoryData) => {
    if (typeof categoryData === 'object' && categoryData !== null && categoryData._id) {
      return categoryData._id;
    }
    if (typeof categoryData === 'string') {
      return categoryData;
    }
    return null;
  };

  // Updated filtering to work with both data structures
  const filteredSubcategories = subcategories.filter(subcategory => {
    const matchesSubcategoryName = 
      (subcategory.subcategoryname?.en?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
      (subcategory.subcategoryname?.es?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    // Find the category using the improved helper function
    const category = findCategoryById(subcategory.categoryid);
    const matchesCategoryName = category ? (
      (category.categoryName?.en?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (category.categoryName?.es?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    ) : false;

    return matchesSubcategoryName || matchesCategoryName;
  });

  const validateForm = () => {
    const newErrors = {};
    
    // English name validation
    if (!formData.subcategoryname.en) {
      newErrors.en = t("viewsubcategory.err1");
    } else if (formData.subcategoryname.en.length < 3) {
      newErrors.en = t("viewsubcategory.err2");
    } else if (formData.subcategoryname.en.length > 20) {
      newErrors.en = t("viewsubcategory.err3");
    }
    
    // Spanish name validation
    if (!formData.subcategoryname.es) {
      newErrors.es = t("viewsubcategory.err4");
    } else if (formData.subcategoryname.es.length < 3) {
      newErrors.es = t("viewsubcategory.err5");
    } else if (formData.subcategoryname.es.length > 20) {
      newErrors.es = t("viewsubcategory.err6");
    }
    
    if (!formData.categoryid) newErrors.categoryid = t("viewsubcategory.err7");
    
    if (!formData.status) newErrors.status = t("viewsubcategory.err8");
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested object structure for language fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, categoryid: value }));
  };

  const handleEdit = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setFormData({
      subcategoryname: {
        en: subcategory.subcategoryname?.en || "",
        es: subcategory.subcategoryname?.es || ""
      },
      categoryid: getCategoryId(subcategory.categoryid) || "", // Use helper function
      status: subcategory.status
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setIsDeleteModalOpen(true);
  };

  const handleToggleStatus = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setIsStatusModalOpen(true);
  };

  const handleUpdateSubcategory = () => {
    if (!validateForm()) return;
    
    dispatch(updateSubcategory({ 
      id: selectedSubcategory._id, 
      data: formData 
    }));
    setIsEditModalOpen(false);
  };

  const handleDeleteSubcategory = () => {
    dispatch(deleteSubcategory(selectedSubcategory._id));
    setIsDeleteModalOpen(false);
  };

  const handleUpdateStatus = () => {
    const newStatus = selectedSubcategory.status === "Active" ? "Deactive" : "Active";
    dispatch(updateSubcategoryStatus({
      id: selectedSubcategory._id,
      data: { status: newStatus }
    }));
    setIsStatusModalOpen(false);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setErrors({});
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
  };

  // Render error message component
  const ErrorMessage = ({ error }) => {
    return error ? <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p> : null;
  };

  // Helper function to display subcategory name based on current language
  const getSubcategoryDisplayName = (subcategory) => {
    if (typeof subcategory.subcategoryname === 'object') {
      return subcategory.subcategoryname[currentLanguage] || subcategory.subcategoryname.en || subcategory.subcategoryname.es || '';
    }
    return subcategory.subcategoryname || '';
  };

  // Helper function to display category name based on current language
  const getCategoryDisplayName = (categoryData) => {
    const category = findCategoryById(categoryData);
    
    if (!category || !category.categoryName) return 'N/A';

    // Return name based on current language
    return category.categoryName[currentLanguage] || category.categoryName.en || category.categoryName.es || 'N/A';
  };

  // Helper function to get selected subcategory name for modals
  const getSelectedSubcategoryName = () => {
    if (!selectedSubcategory) return '';
    if (typeof selectedSubcategory.subcategoryname === 'object') {
      return selectedSubcategory.subcategoryname[currentLanguage] || 
             selectedSubcategory.subcategoryname.en || 
             selectedSubcategory.subcategoryname.es || '';
    }
    return selectedSubcategory.subcategoryname || '';
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">{t("viewsubcategory.title")}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{t("viewsubcategory.dis")}</p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <Input
            type="text"
            placeholder={t("viewsubcategory.search")}
            className="pl-10 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Subcategory Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-16 bg-white dark:bg-gray-800">
            <img
              src={gif}
              alt="Loading..."
              className="h-16 w-16"
            />
            <span className="ml-3 text-gray-600 dark:text-gray-400">{t("viewsubcategory.load")}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("viewsubcategory.table")}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("viewsubcategory.table1")}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("viewsubcategory.table2")}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("viewsubcategory.table3")}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("viewsubcategory.table4")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {filteredSubcategories.length > 0 ? (
                  filteredSubcategories.map((subcategory) => (
                    <tr key={subcategory._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200 font-medium">
                        {getSubcategoryDisplayName(subcategory)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {getCategoryDisplayName(subcategory.categoryid)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`flex items-center px-3 py-1.5 border transition-all duration-200 rounded-md ${
                            subcategory.status === "Active" 
                              ? "text-green-600 dark:text-green-400 border-green-300 dark:border-green-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400" 
                              : "text-red-600 dark:text-red-400 border-red-300 dark:border-red-500 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400"
                          }`}
                          onClick={() => handleToggleStatus(subcategory)}
                        >
                          {subcategory.status === "Active" ? (
                            <>
                              <ToggleRight size={16} className="mr-1.5" />
                              {t("viewsubcategory.button")}
                            </>
                          ) : (
                            <>
                              <ToggleLeft size={16} className="mr-1.5" />
                              {t("viewsubcategory.button1")}
                            </>
                          )}
                        </Button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center px-3 py-1.5 bg-blue-600 dark:bg-blue-700 text-white border border-blue-600 dark:border-blue-700 hover:bg-blue-500 dark:hover:bg-blue-600 hover:border-blue-500 dark:hover:border-blue-600 hover:text-white transition-all duration-200 rounded-md"
                          onClick={() => handleEdit(subcategory)}
                        >
                          <Pencil size={16} className="mr-1.5" />
                          {t("viewsubcategory.button2")}
                        </Button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center px-3 py-1.5 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500 hover:text-white hover:bg-red-600 dark:hover:bg-red-700 hover:border-red-600 dark:hover:border-red-700 transition-all duration-200 rounded-md"
                          onClick={() => handleDelete(subcategory)}
                        >
                          <Trash2 size={16} className="mr-1.5" />
                          {t("viewsubcategory.button3")}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
                      <div className="flex flex-col items-center">
                        <Tag className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2" strokeWidth={1.5} />
                        <p className="text-lg font-medium">{t("viewsubcategory.label")}</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t("viewsubcategory.dis1")}</p>
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
      <CustomModal
        open={isEditModalOpen}
        hideModal={closeEditModal}
        performAction={handleUpdateSubcategory}
        title={`${t("viewsubcategory.title1")} "${getSelectedSubcategoryName()}"`}
        description={t("viewsubcategory.dis2")}
      >
        <div className="p-5 bg-white dark:bg-gray-800">
          <div className="mb-5">
            <CustomInput
              type="text"
              label={t("viewsubcategory.label2")}
              id="subcategoryname.en"
              name="subcategoryname.en"
              className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${errors.en ? "border-red-500 dark:border-red-400" : ""}`}
              value={formData.subcategoryname.en}
              onChange={handleChange}
              placeholder={t("viewsubcategory.placeholder")}
            />
            <ErrorMessage error={errors.en} />
          </div>
          
          <div className="mb-5">
            <CustomInput
              type="text"
              label={t("viewsubcategory.label3")}
              id="subcategoryname.es"
              name="subcategoryname.es"
              className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${errors.es ? "border-red-500 dark:border-red-400" : ""}`}
              value={formData.subcategoryname.es}
              onChange={handleChange}
              placeholder={t("viewsubcategory.placeholder1")}
            />
            <ErrorMessage error={errors.es} />
          </div>

          <div className="mb-5">
            <label htmlFor="categoryid" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("viewsubcategory.label4")}</label>
            <Select 
              onValueChange={handleCategoryChange}
              value={formData.categoryid}
            >
              <SelectTrigger 
                id="categoryid"
                className={`w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${errors.categoryid ? "border-red-500 dark:border-red-400" : ""}`}
              >
                <SelectValue placeholder={t("viewsubcategory.placeholder2")} />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                {categories?.map((category) => (
                  <SelectItem key={category._id} value={category._id} className="dark:text-gray-200 dark:hover:bg-gray-600">
                    {category.categoryName?.[currentLanguage] || 
                     category.categoryName?.en || 
                     category.categoryName?.es || 
                     'N/A'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ErrorMessage error={errors.categoryid} />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("viewsubcategory.label5")}</label>
            <Select 
              onValueChange={handleStatusChange}
              value={formData.status}
            >
              <SelectTrigger 
                id="status"
                className={`w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${errors.status ? "border-red-500 dark:border-red-400" : ""}`}
              >
                <SelectValue placeholder={t("viewsubcategory.placeholder2")} />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectItem value="Active" className="dark:text-gray-200 dark:hover:bg-gray-600">{t("viewsubcategory.button")}</SelectItem>
                <SelectItem value="Deactive" className="dark:text-gray-200 dark:hover:bg-gray-600">{t("viewsubcategory.button1")}</SelectItem>
              </SelectContent>
            </Select>
            <ErrorMessage error={errors.status} />
          </div>
        </div>
      </CustomModal>

      {/* Delete Confirmation Modal */}
      <CustomModal
        open={isDeleteModalOpen}
        hideModal={closeDeleteModal}
        performAction={handleDeleteSubcategory}
        title={`${t("viewsubcategory.title2")} "${getSelectedSubcategoryName()}"?`}
        description={t("viewsubcategory.dis3")}
      />

      {/* Status Change Modal */}
      <CustomModal
        open={isStatusModalOpen}
        hideModal={closeStatusModal}
        performAction={handleUpdateStatus}
        title={`${t("viewsubcategory.title3")} "${getSelectedSubcategoryName()}"?`}
        description={`${t("viewsubcategory.dis4")} ${selectedSubcategory?.status === "Active" ? "deactivate" : "activate"} ${t("viewsubcategory.dis5")}`}
      >
        <div className="p-5">
          <Alert className={`${selectedSubcategory?.status === "Active" ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"}`}>
            <AlertDescription className="dark:text-gray-200">
              {selectedSubcategory?.status === "Active" 
                ? t("viewsubcategory.dis6")
                : t("viewsubcategory.dis7")
              }
            </AlertDescription>
          </Alert>
        </div>
      </CustomModal>
    </div>
  );
}