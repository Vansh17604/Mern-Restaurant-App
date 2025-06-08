import React, { useState, useEffect } from "react";
import { ChefHat, Loader2, Plus, Upload, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useDispatch, useSelector } from "react-redux";
import { CustomInput } from "../componets/Customes";
import { createDish, resetDishState } from "../../features/admin/dish/dishSlice";
import { fetchactiveCategories } from "../../features/admin/category/categorySlice";
import { fetchActiveSubcategory } from "../../features/admin/subcategory/subcategorySlice";
import{ useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function AddDish() {
  const [formData, setFormData] = useState({
    categoryid: "",
    subcategoryid: "",
    dishName: {
      en: "",
      es: ""
    },
    price: "",
    description: {
      en: "",
      es: ""
    }
  });
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const navigate = useNavigate();
  const {t,i18n} = useTranslation();
      
  const currentLanguage = i18n.language;

  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.dish
  );
  const { categories } = useSelector((state) => state.category);
  const { subcategories } = useSelector((state) => state.subcategory);

  useEffect(() => {
    dispatch(fetchactiveCategories());
    dispatch(fetchActiveSubcategory());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        categoryid: "",
        subcategoryid: "",
        dishName: {
          en: "",
          es: ""
        },
        price: "",
        description: {
          en: "",
          es: ""
        }
      });
      setSelectedImage(null);
      setImagePreview(null);
      setErrors({});
       
      const navigationTimer = setTimeout(() => {
             navigate("/admin/viewdish");
           }, 2000);
           
       
           const resetTimer = setTimeout(() => {
             dispatch(resetDishState());
           }, 2500);
     
           return () => {
             clearTimeout(navigationTimer);
             clearTimeout(resetTimer);
           };
    }
  }, [isSuccess, dispatch,navigate]);
   useEffect(() => {
      dispatch(resetDishState());
    }, [dispatch]);

  // Filter subcategories based on selected category - FIXED
  useEffect(() => {
    if (formData.categoryid && subcategories) {
      const filtered = subcategories.filter(subcategory => {
        // Handle both cases: when categoryid is a string or an object
        const subcategoryCategoryId = typeof subcategory.categoryid === 'object' 
          ? subcategory.categoryid._id 
          : subcategory.categoryid;
        
        return subcategoryCategoryId === formData.categoryid;
      });
      
      setFilteredSubcategories(filtered);
      
      // Reset subcategory selection if current selection is not in filtered list
      if (formData.subcategoryid) {
        const isValidSubcategory = filtered.some(sub => sub._id === formData.subcategoryid);
        if (!isValidSubcategory) {
          setFormData(prev => ({ ...prev, subcategoryid: "" }));
        }
      }
    } else {
      setFilteredSubcategories([]);
      setFormData(prev => ({ ...prev, subcategoryid: "" }));
    }
  }, [formData.categoryid, subcategories]);

  const validateForm = () => {
    const newErrors = {};
    
    // Category validation
    if (!formData.categoryid) {
      newErrors.categoryid = t("adddish.err");
    }
    
    // Subcategory validation
    if (!formData.subcategoryid) {
      newErrors.subcategoryid = t("adddish.err1");
    }
    
    // English dish name validation
    if (!formData.dishName.en) {
      newErrors.dishNameEn = t("adddish.err2");
    } else if (formData.dishName.en.length < 3) {
      newErrors.dishNameEn = t("adddish.err3");
    } else if (formData.dishName.en.length > 20) {
      newErrors.dishNameEn = t("adddish.err4");
    }
    
    // Spanish dish name validation
    if (!formData.dishName.es) {
      newErrors.dishNameEs = t("adddish.err5");
    } else if (formData.dishName.es.length < 3) {
      newErrors.dishNameEs = t("adddish.err6");
    } else if (formData.dishName.es.length > 20) {
      newErrors.dishNameEs = t("adddish.err7");
    }
    
    // Price validation
    if (!formData.price) {
      newErrors.price = t("adddish.err8");
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = t("adddish.err9");
    }
    
    // English description validation
    if (!formData.description.en) {
      newErrors.descriptionEn = t("adddish.err10");
    } else if (formData.description.en.length < 3) {
      newErrors.descriptionEn = t("adddish.err11");
    } else if (formData.description.en.length > 100) {
      newErrors.descriptionEn = t("adddish.err12");
    }
    
    // Spanish description validation
    if (!formData.description.es) {
      newErrors.descriptionEs = t("adddish.err13");
    } else if (formData.description.es.length < 3) {
      newErrors.descriptionEs = t("adddish.err14");
    } else if (formData.description.es.length > 100) {
      newErrors.descriptionEs = t("adddish.err15");
    }
    
    // Image validation
    if (!selectedImage) {
      newErrors.image = t("adddish.err16");
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

   // Helper function to display category name based on current language
  const getCategoryDisplayName = (category) => {
    
    
    if (!category || !category.categoryName) return 'N/A';

    if (currentLanguage === 'es') {
      return category.categoryName.es || category.categoryName.en || 'N/A';
    } else {
      return category.categoryName.en || category.categoryName.es || 'N/A';
    }
  };

 
  const getSubcategoryDisplayName = (subcategory) => {
    
    
    if (!subcategory || !subcategory.subcategoryname) return 'N/A';

    if (currentLanguage === 'es') {
      return subcategory.subcategoryname.es || subcategory.subcategoryname.en || 'N/A';
    } else {
      return subcategory.subcategoryname.en || subcategory.subcategoryname.es || 'N/A';
    }
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: t("adddish.err17") }));
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: t("adddish.err18") }));
        return;
      }
      
      setSelectedImage(file);
      setErrors(prev => ({ ...prev, image: "" }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('imageInput');
    if (fileInput) fileInput.value = '';
  };

  const type = "dishes";
  const handleSubmit = () => {
    if (!validateForm()) return;
    const submitData = new FormData();
    submitData.append('categoryid', formData.categoryid);
    submitData.append('subcategoryid', formData.subcategoryid);
    submitData.append('dishName[en]', formData.dishName.en);
    submitData.append('dishName[es]', formData.dishName.es);
    submitData.append('price', formData.price);
    submitData.append('description[en]', formData.description.en);
    submitData.append('description[es]', formData.description.es);
    submitData.append('imageUrl', selectedImage);
    submitData.append("type", type);
    
    dispatch(createDish(submitData));
    isSuccess && navigate("/admin/viewdish");
  };

  const handleClearForm = () => {
    setFormData({
      categoryid: "",
      subcategoryid: "",
      dishName: {
        en: "",
        es: ""
      },
      price: "",
      description: {
        en: "",
        es: ""
      }
    });
    setSelectedImage(null);
    setImagePreview(null);
    setErrors({});
    dispatch(resetDishState());
    
    // Reset file input
    const fileInput = document.getElementById('imageInput');
    if (fileInput) fileInput.value = '';
  };

  // Render error message component
  const ErrorMessage = ({ error }) => {
    return error ? <p className="text-xs mt-1 text-red-500 dark:text-red-400">{error}</p> : null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <ChefHat className="w-8 h-8 text-black dark:text-white" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t("adddish.title")}</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 max-w-7xl w-full mx-auto">
        {isSuccess && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700">
            <AlertDescription>
              {t("adddish.alert")}
            </AlertDescription>
          </Alert>
        )}
        
        {isError && (
          <Alert className="mb-6 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700">
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="rounded-lg border shadow-sm p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-1 text-gray-800 dark:text-white">{t("adddish.title1")}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("adddish.dis")}</p>
          </div>
          
          <div className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {t('adddish.label')} <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <select
                name="categoryid"
                value={formData.categoryid}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                  errors.categoryid ? "border-red-500 dark:border-red-400" : ""
                }`}
              >
                <option value="">{t('adddish.label1')}</option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {getCategoryDisplayName(category)}
                  </option>
                ))}
              </select>
              <ErrorMessage error={errors.categoryid} />
            </div>

            {/* Subcategory Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {t('adddish.label2')} <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <select
                name="subcategoryid"
                value={formData.subcategoryid}
                onChange={handleChange}
                disabled={!formData.categoryid}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                  errors.subcategoryid ? "border-red-500 dark:border-red-400" : ""
                } ${!formData.categoryid ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed" : ""}`}
              >
                <option value="">{t('adddish.label3')}</option>
                {filteredSubcategories?.map((subcategory) => (
                  <option key={subcategory._id} value={subcategory._id}>
                    {getSubcategoryDisplayName(subcategory)}
                  </option>
                ))}
              </select>
              <ErrorMessage error={errors.subcategoryid} />
            </div>

            {/* Dish Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <CustomInput
                  type="text"
                  label={t('adddish.label4')}
                  id="dishName.en"
                  name="dishName.en"
                  className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dishNameEn ? "border-red-500 dark:border-red-400" : ""}`}
                  value={formData.dishName.en}
                  onChange={handleChange}
                  placeholder={t('adddish.placeholder')}
                />
                <ErrorMessage error={errors.dishNameEn} />
              </div>
              
              <div>
                <CustomInput
                  type="text"
                  label={t('adddish.label5')}
                  id="dishName.es"
                  name="dishName.es"
                  className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.dishNameEs ? "border-red-500 dark:border-red-400" : ""}`}
                  value={formData.dishName.es}
                  onChange={handleChange}
                  placeholder={t('adddish.placeholder1')}
                />
                <ErrorMessage error={errors.dishNameEs} />
              </div>
            </div>

            {/* Price Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {t('adddish.label6')} <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder={t('adddish.placeholder2')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                  errors.price ? "border-red-500 dark:border-red-400" : ""
                }`}
              />
              <ErrorMessage error={errors.price} />
            </div>

            {/* Description Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('adddish.label7')} <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <textarea
                  name="description.en"
                  value={formData.description.en}
                  onChange={handleChange}
                  rows={3}
                  maxLength={100}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                    errors.descriptionEn ? "border-red-500 dark:border-red-400" : ""
                  }`}
                  placeholder={t('adddish.placeholder3')}
                />
                <div className="flex justify-between items-center mt-1">
                  <ErrorMessage error={errors.descriptionEn} />
                  <span className="text-xs text-gray-400 dark:text-gray-400">
                    {formData.description.en.length}/100
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('adddish.label8')} <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <textarea
                  name="description.es"
                  value={formData.description.es}
                  onChange={handleChange}
                  rows={3}
                  maxLength={100}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                    errors.descriptionEs ? "border-red-500 dark:border-red-400" : ""
                  }`}
                  placeholder={t('adddish.placeholder4')}
                />
                <div className="flex justify-between items-center mt-1">
                  <ErrorMessage error={errors.descriptionEs} />
                  <span className="text-xs text-gray-400 dark:text-gray-400">
                    {formData.description.es.length}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {t('adddish.label9')} <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed rounded-lg p-6 text-center transition-colors border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-400" />
                  <div className="mt-2">
                    <label
                      htmlFor="imageInput"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {t('adddish.choose')}
                    </label>
                    <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {t('adddish.image')}
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Dish preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <ErrorMessage error={errors.image} />
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="mt-8 pt-5 border-t flex justify-end space-x-4 border-gray-200 dark:border-gray-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClearForm}
              className="px-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {t('adddish.clear')}
            </Button>
            
            <Button 
              type="button" 
              className="bg-green-700 hover:bg-green-500 text-white px-4"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('adddish.save')}
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('adddish.save1')}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}