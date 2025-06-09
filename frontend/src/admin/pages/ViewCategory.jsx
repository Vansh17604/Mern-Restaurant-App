import React, { useState, useEffect } from "react";
import { Tag, Loader2, Pencil, Trash2, Search, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CustomInput, CustomModal } from "../componets/Customes";
import gif from '/assets/Animation - 1747722366024.gif';
import { 
  fetchCategories, 
  updateCategory, 
  deleteCategory, 
  resetCategoryState,
  updateCategoryStatus
} from "../../features/admin/category/categorySlice";

export default function ViewCategory() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: {
      en: "",
      es: ""
    },
    status: ""
  });
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const { categories, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.category
  );

  useEffect(() => {
    dispatch(fetchCategories());
       
    
          
    
    return () => {
      dispatch(resetCategoryState());
      
    };
  }, [dispatch]);

  
  const filteredCategories = categories.filter(category => 
    (category.categoryName?.en?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
    (category.categoryName?.es?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const newErrors = {};
    
    // English name validation
    if (!formData.categoryName.en) {
      newErrors.en = t("viewcategory.err1");
    } else if (formData.categoryName.en.length < 3) {
      newErrors.en = t("viewcategory.err2");
    } else if (formData.categoryName.en.length > 20) {
      newErrors.en = t("viewcategory.err3");
    }
    
    // Spanish name validation
    if (!formData.categoryName.es) {
      newErrors.es = t("viewcategory.err4");
    } else if (formData.categoryName.es.length < 3) {
      newErrors.es = t("viewcategory.err5");
    } else if (formData.categoryName.es.length > 20) {
      newErrors.es = t("viewcategory.err6");
    }
    
    // Status validation
    if (!formData.status) newErrors.status = t("viewcategory.err7");
    
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

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      categoryName: {
        en: category.categoryName?.en || "",
        es: category.categoryName?.es || ""
      },
      status: category.status
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleToggleStatus = (category) => {
    setSelectedCategory(category);
    setIsStatusModalOpen(true);
  };

  const handleUpdateCategory = () => {
    if (!validateForm()) return;
    
    dispatch(updateCategory({ 
      id: selectedCategory._id, 
      data: formData 
    }));
    setIsEditModalOpen(false);
  };

  const handleDeleteCategory = () => {
    dispatch(deleteCategory(selectedCategory._id));
    setIsDeleteModalOpen(false);
  };

  const handleUpdateStatus = () => {
    const newStatus = selectedCategory.status === "Active" ? "Deactive" : "Active";
    dispatch(updateCategoryStatus({
      id: selectedCategory._id,
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

  // Helper function to display category name in the table based on current language
  const getCategoryDisplayName = (category) => {
    if (typeof category.categoryName === 'object') {
      const currentLang = i18n.language;
      if (currentLang === 'es' && category.categoryName.es) {
        return category.categoryName.es;
      } else if (currentLang === 'en' && category.categoryName.en) {
        return category.categoryName.en;
      }
      // Fallback to showing both languages if current language not available
      return `${category.categoryName.en} / ${category.categoryName.es}`;
    }
    return category.categoryName || '';
  };

  // Helper function to get category name for modal titles
  const getCategoryNameForModal = (category) => {
    if (typeof category?.categoryName === 'object') {
      const currentLang = i18n.language;
      if (currentLang === 'es' && category.categoryName.es) {
        return category.categoryName.es;
      } else if (currentLang === 'en' && category.categoryName.en) {
        return category.categoryName.en;
      }
      // Fallback to English if current language not available
      return category.categoryName.en || category.categoryName.es || '';
    }
    return category?.categoryName || '';
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">{t("viewcategory.title")}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{t("viewcategory.dis")}</p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <Input
            type="text"
            placeholder={t("viewcategory.serchlab")}
            className="pl-10 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Category Table */}
      <div className="border rounded-lg overflow-hidden border-gray-200 dark:border-gray-700">
        {isLoading ? (
          <div className="flex justify-center items-center py-16 bg-white dark:bg-gray-800">
            <img
              src={gif}
              alt="Loading..."
              className="h-16 w-16"
            />
            <span className="ml-3 text-gray-600 dark:text-gray-300">{t("viewcategory.load")}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("viewcategory.table1")}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("viewcategory.table2")}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("viewcategory.table3")}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("viewcategory.table4")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200 font-medium">
                        {getCategoryDisplayName(category)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`flex items-center px-3 py-1.5 border transition-all duration-200 rounded-md ${
                            category.status === "Active" 
                              ? "text-green-600 dark:text-green-400 border-green-300 dark:border-green-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400" 
                              : "text-red-600 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400"
                          }`}
                          onClick={() => handleToggleStatus(category)}
                        >
                          {category.status === "Active" ? (
                            <>
                              <ToggleRight size={16} className="mr-1.5" />
                              {t("viewcategory.button")}
                            </>
                          ) : (
                            <>
                              <ToggleLeft size={16} className="mr-1.5" />
                              {t("viewcategory.button1")}
                            </>
                          )}
                        </Button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center px-3 py-1.5 bg-blue-600 dark:bg-blue-600 text-white border border-blue-600 dark:border-blue-600 hover:bg-blue-500 dark:hover:bg-blue-500 hover:border-blue-500 dark:hover:border-blue-500 hover:text-white transition-all duration-200 rounded-md"
                          onClick={() => handleEdit(category)}
                        >
                          <Pencil size={16} className="mr-1.5" />
                          {t("viewcategory.button2")}
                        </Button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center px-3 py-1.5 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 hover:text-white hover:bg-red-600 dark:hover:bg-red-600 hover:border-red-600 dark:hover:border-red-600 transition-all duration-200 rounded-md"
                          onClick={() => handleDelete(category)}
                        >
                          <Trash2 size={16} className="mr-1.5" />
                          {t("viewcategory.button3")}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <Tag className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2" strokeWidth={1.5} />
                        <p className="text-lg font-medium">{t("viewcategory.dis1")}</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t("viewcategory.dis2")}</p>
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
        performAction={handleUpdateCategory}
        title={`${t("viewcategory.modeltitle")} "${getCategoryNameForModal(selectedCategory)}"`}
        description={t("viewcategory.dis3")}
      >
        <div className="p-5">
          <div className="mb-5">
            <CustomInput
              type="text"
              label={t("viewcategory.lable1")}
              id="categoryName.en"
              name="categoryName.en"
              className={errors.en ? "border-red-500 dark:border-red-400" : ""}
              value={formData.categoryName.en}
              onChange={handleChange}
              placeholder={t("viewcategory.placeholderen")}
            />
            <ErrorMessage error={errors.en} />
          </div>
          
          <div className="mb-5">
            <CustomInput
              type="text"
              label={t("viewcategory.lable2")}
              id="categoryName.es"
              name="categoryName.es"
              className={errors.es ? "border-red-500 dark:border-red-400" : ""}
              value={formData.categoryName.es}
              onChange={handleChange}
              placeholder={t("viewcategory.placeholderes")}
            />
            <ErrorMessage error={errors.es} />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("viewcategory.lable3")}</label>
            <Select 
              onValueChange={handleStatusChange}
              value={formData.status}
            >
              <SelectTrigger 
                id="status"
                className={`w-full ${errors.status ? "border-red-500 dark:border-red-400" : ""}`}
              >
                <SelectValue placeholder={t("viewcategory.placeholderstatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">{t("viewcategory.button")}</SelectItem>
                <SelectItem value="Deactive">{t("viewcategory.button1")}</SelectItem>
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
        performAction={handleDeleteCategory}
        title={`${t("viewcategory.modeltitle2")} "${getCategoryNameForModal(selectedCategory)}"?`}
        description={t("viewcategory.dis4")}
      />

      {/* Status Change Modal */}
      <CustomModal
        open={isStatusModalOpen}
        hideModal={closeStatusModal}
        performAction={handleUpdateStatus}
        title={`${t("viewcategory.modeltitle3")} "${getCategoryNameForModal(selectedCategory)}"?`}
        description={`${t("viewcategory.dis5")} ${selectedCategory?.status === "Active" ? t("viewcategory.button1").toLowerCase() : t("viewcategory.button").toLowerCase()} ${t("viewcategory.dis6")}`}
      >
        <div className="p-5">
          <Alert className={selectedCategory?.status === "Active" ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"}>
            <AlertDescription className="text-gray-800 dark:text-gray-200">
              {selectedCategory?.status === "Active" 
                ? t("viewcategory.dis7")
                : t("viewcategory.dis8")
              }
            </AlertDescription>
          </Alert>
        </div>
      </CustomModal>
    </div>
  );
}