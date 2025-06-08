import React, { useState, useEffect } from "react";
import { Tag, Loader2, Plus } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useDispatch, useSelector } from "react-redux";
import { CustomInput } from "../componets/Customes";
import { createSubcategory, resetSubcategoryState } from "../../features/admin/subcategory/subcategorySlice";
import { fetchactiveCategories } from "../../features/admin/category/categorySlice";
import ViewSubCategory from "./ViewSubCategory";

export default function AddSubcategory() {
  const [formData, setFormData] = useState({
    categoryid: "",
    subcategoryname: {
      en: "",
      es: ""
    }
  });
  
  const [errors, setErrors] = useState({});
  const {t,i18n} = useTranslation();
  
  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.subcategory 
  );
  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchactiveCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        categoryid: "",
        subcategoryname: {
          en: "",
          es: ""
        }
      });
      setErrors({});
      
      const timer = setTimeout(() => {
        dispatch(resetSubcategoryState());
      }, 3000);

      return () => clearTimeout(timer); 
    }
  }, [isSuccess, dispatch]);

  const validateForm = () => {
    const newErrors = {};
    
    // Category ID validation
    if (!formData.categoryid) {
      newErrors.categoryid = t("addsubcategory.err1");
    }
    
    if (!formData.subcategoryname.en) {
      newErrors.en = t("addsubcategory.err2");
    } else if (formData.subcategoryname.en.length < 3) {
      newErrors.en = t("addsubcategory.err3");
    } else if (formData.subcategoryname.en.length > 20) {
      newErrors.en = t("addsubcategory.err4");
    }
    
    // Spanish name validation
    if (!formData.subcategoryname.es) {
      newErrors.es = t("addsubcategory.err5");
    } else if (formData.subcategoryname.es.length < 3) {
      newErrors.es = t("addsubcategory.err6");
    } else if (formData.subcategoryname.es.length > 20) {
      newErrors.es = t("addsubcategory.err7");
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

   const getCategoryDisplayName = (category) => {
    if (typeof category.categoryName === 'object') {
      const currentLang = i18n.language;
      if (currentLang === 'es' && category.categoryName.es) {
        return category.categoryName.es;
      } else if (currentLang === 'en' && category.categoryName.en) {
        return category.categoryName.en;
      }
      
      return `${category.categoryName.en} / ${category.categoryName.es}`;
    }
    return category.categoryName || '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
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

  const handleSubmit = () => {
    if (!validateForm()) return;
    dispatch(createSubcategory(formData));
  };

  const handleClearForm = () => {
    setFormData({
      categoryid: "",
      subcategoryname: {
        en: "",
        es: ""
      }
    });
    setErrors({});
    dispatch(resetSubcategoryState());
  };

  const ErrorMessage = ({ error }) => {
    return error ? <p className="text-red-500 text-xs mt-1">{error}</p> : null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Tag className="w-8 h-8 text-black" strokeWidth={1.5} />
              <h1 className="text-2xl font-bold text-gray-800">{t("addsubcategory.tittle")}</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 px-6 py-6 max-w-7xl w-full mx-auto">
        {isSuccess && (
          <Alert className="bg-green-50 text-green-800 border border-green-200 mb-6">
            <AlertDescription>
            {t("addsubcategory.alert")}
            </AlertDescription>
          </Alert>
        )}
        
        {isError && (
          <Alert className="bg-red-50 text-red-800 border border-red-200 mb-6">
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-1">{t("addsubcategory.title1")}</h2>
            <p className="text-gray-500 text-sm">{t("addsubcategory.dis")}</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
               {t("addsubcategory.label")}
              </label>
              <select
                id="categoryid"
                name="categoryid"
                value={formData.categoryid}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.categoryid ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">{t("addsubcategory.label1")}</option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {getCategoryDisplayName(category)}
                  </option>
                ))}
              </select>
              <ErrorMessage error={errors.categoryid} />
            </div>

            <div>
              <CustomInput
                type="text"
                label={t("addsubcategory.label2")}
                id="subcategoryname.en"
                name="subcategoryname.en"
                className={errors.en ? "border-red-500" : ""}
                value={formData.subcategoryname.en}
                onChange={handleChange}
                placeholder={t("addsubcategory.placeholder")}
              />
              <ErrorMessage error={errors.en} />
            </div>
            
            <div>
              <CustomInput
                type="text"
                label={t("addsubcategory.label3")}
                id="subcategoryname.es"
                name="subcategoryname.es"
                className={errors.es ? "border-red-500" : ""}
                value={formData.subcategoryname.es}
                onChange={handleChange}
                placeholder={t("addsubcategory.placeholder1")}
              />
              <ErrorMessage error={errors.es} />
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClearForm}
              className="px-4"
            >
              {t("addsubcategory.clear")}
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
                  {t("addsubcategory.save")}
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("addsubcategory.save1")}
                </>
              )}
            </Button>
          </div>
        </div>
        <ViewSubCategory/>
      </div>
    </div>
  );
}