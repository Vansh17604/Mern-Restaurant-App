import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { CustomInput, CustomModal } from "../componets/Customes";
import { useTranslation } from "react-i18next";

const DishModal = ({
  isOpen,
  onClose,
  onSubmit,
  selectedDish,
  categories,
  subcategories,
  isLoading
}) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const base_url = import.meta.env.VITE_BASE_URL;
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
  const [errors, setErrors] = useState({});

  // Initialize form data when modal opens or dish changes
  useEffect(() => {
    if (isOpen && selectedDish) {
      const getCategoryId = (categoryData) => {
        if (typeof categoryData === 'object' && categoryData !== null && categoryData._id) {
          return categoryData._id;
        }
        if (typeof categoryData === 'string') {
          return categoryData;
        }
        return "";
      };

      const getSubcategoryId = (subcategoryData) => {
        if (typeof subcategoryData === 'object' && subcategoryData !== null && subcategoryData._id) {
          return subcategoryData._id;
        }
        if (typeof subcategoryData === 'string') {
          return subcategoryData;
        }
        return "";
      };

      setFormData({
        categoryid: getCategoryId(selectedDish.categoryid),
        subcategoryid: getSubcategoryId(selectedDish.subcategoryid),
        dishName: {
          en: selectedDish.dishName?.en || "",
          es: selectedDish.dishName?.es || ""
        },
        price: selectedDish.price || "",
        description: {
          en: selectedDish.description?.en || "",
          es: selectedDish.description?.es || ""
        }
      });

      // Set current image preview
      if (selectedDish.imageUrl) {
        setImagePreview(selectedDish.imageUrl);
      }
    } else if (isOpen) {
      // Reset form for new dish
      setFormData({
        categoryid: "",
        subcategoryid: "",
        dishName: { en: "", es: "" },
        price: "",
        description: { en: "", es: "" }
      });
      setImagePreview(null);
      setSelectedImage(null);
    }
  }, [isOpen, selectedDish]);

  // Filter subcategories based on selected category
  useEffect(() => {
    if (formData.categoryid && subcategories) {
      const filtered = subcategories.filter(subcategory => {
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
      newErrors.categoryid = t("dishmodal.err");
    }
    
    // Subcategory validation
    if (!formData.subcategoryid) {
      newErrors.subcategoryid = t("dishmodal.err1");
    }
    
    // English dish name validation
    if (!formData.dishName.en) {
      newErrors.dishNameEn = t("dishmodal.err2");
    } else if (formData.dishName.en.length < 3) {
      newErrors.dishNameEn = t("dishmodal.err3");
    } else if (formData.dishName.en.length > 20) {
      newErrors.dishNameEn = t("dishmodal.err4");
    }
    
    // Spanish dish name validation
    if (!formData.dishName.es) {
      newErrors.dishNameEs = t("dishmodal.err5");
    } else if (formData.dishName.es.length < 3) {
      newErrors.dishNameEs = t("dishmodal.err6");
    } else if (formData.dishName.es.length > 20) {
      newErrors.dishNameEs = t("dishmodal.err7");
    }
    
    // Price validation
    if (!formData.price) {
      newErrors.price = t("dishmodal.err8");
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = t("dishmodal.err9");
    }
    
    // English description validation
    if (!formData.description.en) {
      newErrors.descriptionEn = t("dishmodal.err10");
    } else if (formData.description.en.length < 3) {
      newErrors.descriptionEn = t("dishmodal.err11");
    } else if (formData.description.en.length > 100) {
      newErrors.descriptionEn = t("dishmodal.err12");
    }
    
    // Spanish description validation
    if (!formData.description.es) {
      newErrors.descriptionEs = t("dishmodal.err13");
    } else if (formData.description.es.length < 3) {
      newErrors.descriptionEs = t("dishmodal.err14");
    } else if (formData.description.es.length > 100) {
      newErrors.descriptionEs = t("dishmodal.err15");
    }
    
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

  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, categoryid: value }));
  };

  const handleSubcategoryChange = (value) => {
    setFormData(prev => ({ ...prev, subcategoryid: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: t("dishmodal.err16") }));
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: t("dishmodal.err17") }));
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
    
    if (selectedImage) {
      submitData.append('imageUrl', selectedImage);
      submitData.append("type", "dishes");
    }
    
    onSubmit(submitData);
    handleClose();
  };

  const handleClose = () => {
    setErrors({});
    setSelectedImage(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('imageInput');
    if (fileInput) fileInput.value = '';
    onClose();
  };

  // Helper function to get the correct image URL
  const getImageUrl = (preview) => {
    // If it's a File object (newly selected image)
    if (preview instanceof File) {
      return URL.createObjectURL(preview);
    }
    
    // If it's a data URL (from FileReader)
    if (typeof preview === 'string' && preview.startsWith('data:')) {
      return preview;
    }
    
    // If it's already a full HTTP URL
    if (typeof preview === 'string' && preview.startsWith('http')) {
      return preview;
    }
    
    // If it's a relative path, prepend base URL
    if (typeof preview === 'string') {
      return `${base_url}${preview}`;
    }
    
    return preview;
  };

  // Helper function to get category name based on current language
  const getCategoryDisplayName = (category) => {
    if (currentLanguage === 'es') {
      return category.categoryName?.es || category.categoryName?.en || 'N/A';
    }
    return category.categoryName?.en || category.categoryName?.es || 'N/A';
  };

  // Helper function to get subcategory name based on current language
  const getSubcategoryDisplayName = (subcategory) => {
    if (currentLanguage === 'es') {
      return subcategory.subcategoryname?.es || subcategory.subcategoryname?.en || 'N/A';
    }
    return subcategory.subcategoryname?.en || subcategory.subcategoryname?.es || 'N/A';
  };

  // Error message component
  const ErrorMessage = ({ error }) => {
    return error ? <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p> : null;
  };

  return (
    <CustomModal
      open={isOpen}
      hideModal={handleClose}
      performAction={handleSubmit}
      title={selectedDish ? t("dishmodal.title") : t("dishmodal.title1")}
      description={selectedDish ? t("dishmodal.dis") : t("dishmodal.dis1")}
    >
      <div className="p-5 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("dishmodal.label")}</label>
            <Select onValueChange={handleCategoryChange} value={formData.categoryid}>
              <SelectTrigger className={`w-full dark:bg-gray-800 dark:border-gray-600 dark:text-white ${errors.categoryid ? "border-red-500 dark:border-red-400" : ""}`}>
                <SelectValue placeholder={t("dishmodal.label1")} />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {getCategoryDisplayName(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ErrorMessage error={errors.categoryid} />
          </div>

          {/* Subcategory Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("dishmodal.label2")}</label>
            <Select 
              onValueChange={handleSubcategoryChange} 
              value={formData.subcategoryid}
              disabled={!formData.categoryid}
            >
              <SelectTrigger className={`w-full dark:bg-gray-800 dark:border-gray-600 dark:text-white ${errors.subcategoryid ? "border-red-500 dark:border-red-400" : ""}`}>
                <SelectValue placeholder={t("dishmodal.label3")} />
              </SelectTrigger>
              <SelectContent>
                {filteredSubcategories?.map((subcategory) => (
                  <SelectItem key={subcategory._id} value={subcategory._id}>
                    {getSubcategoryDisplayName(subcategory)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ErrorMessage error={errors.subcategoryid} />
          </div>

          {/* Dish Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <CustomInput
                type="text"
                label={t("dishmodal.label4")}
                name="dishName.en"
                className={errors.dishNameEn ? "border-red-500 dark:border-red-400" : ""}
                value={formData.dishName.en}
                onChange={handleChange}
                placeholder={t("dishmodal.placeholder")}
              />
              <ErrorMessage error={errors.dishNameEn} />
            </div>
            
            <div>
              <CustomInput
                type="text"
                label={t("dishmodal.label5")}
                name="dishName.es"
                className={errors.dishNameEs ? "border-red-500 dark:border-red-400" : ""}
                value={formData.dishName.es}
                onChange={handleChange}
                placeholder={t("dishmodal.placeholder1")}
              />
              <ErrorMessage error={errors.dishNameEs} />
            </div>
          </div>

          {/* Price */}
          <div>
            <CustomInput
              type="number"
              label={t("dishmodal.label6")}
              name="price"
              className={errors.price ? "border-red-500 dark:border-red-400" : ""}
              value={formData.price}
              onChange={handleChange}
              placeholder={t("dishmodal.placeholder2")}
              step="0.01"
              min="0"
            />
            <ErrorMessage error={errors.price} />
          </div>

          {/* Description Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("dishmodal.label7")}
              </label>
              <textarea
                name="description.en"
                value={formData.description.en}
                onChange={handleChange}
                rows={2}
                maxLength={100}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 resize-vertical ${
                  errors.descriptionEn ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder={t("dishmodal.placeholder3")}
              />
              <div className="flex justify-between items-center mt-1">
                <ErrorMessage error={errors.descriptionEn} />
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formData.description.en.length}/100
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("dishmodal.label8")}
              </label>
              <textarea
                name="description.es"
                value={formData.description.es}
                onChange={handleChange}
                rows={2}
                maxLength={100}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 resize-vertical ${
                  errors.descriptionEs ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder={t("dishmodal.placeholder4")}
              />
              <div className="flex justify-between items-center mt-1">
                <ErrorMessage error={errors.descriptionEs} />
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formData.description.es.length}/100
                </span>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("dishmodal.label9")}
            </label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <Upload className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
                <div className="mt-2">
                  <label
                    htmlFor="imageInput"
                    className="cursor-pointer inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800 transition-colors"
                  >
                    {t("dishmodal.choose")}
                  </label>
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t("dishmodal.img")}
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={getImageUrl(imagePreview)}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
                <label
                  htmlFor="imageInput"
                  className="absolute bottom-2 left-2 cursor-pointer inline-flex items-center px-2 py-1 text-xs bg-black bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70 text-white rounded hover:bg-opacity-70 dark:hover:bg-opacity-80 transition-all"
                >
                  {t("dishmodal.change")}
                </label>
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            )}
            <ErrorMessage error={errors.image} />
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default DishModal;