import React, { useState, useEffect } from "react";
import { Tag, Loader2, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useDispatch, useSelector } from "react-redux";
import { CustomInput } from "../componets/Customes";
import { createCategory, resetCategoryState } from "../../features/admin/category/categorySlice";

import ViewCategory from "./ViewCategory";

export default function AddCategory() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    categoryName: {
      en: "",
      es: ""
    }
  });
  
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.category
  );

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        categoryName: {
          en: "",
          es: ""
        }
      });
      setErrors({});
      
      const timer = setTimeout(() => {
        dispatch(resetCategoryState());
      }, 3000);

      return () => clearTimeout(timer); 
    }
  }, [isSuccess, dispatch]);

  const validateForm = () => {
    const newErrors = {};
    
    // English name validation
    if (!formData.categoryName.en) {
      newErrors.en = t("adminaddcategory.errorcategoryen");
    } else if (formData.categoryName.en.length < 3) {
      newErrors.en = t("adminaddcategory.errorcategoryen2");
    } else if (formData.categoryName.en.length > 20) {
      newErrors.en = t("adminaddcategory.errorcategoryen3");
    }
    
    // Spanish name validation
    if (!formData.categoryName.es) {
      newErrors.es = t("adminaddcategory.errorcategoryes");
    } else if (formData.categoryName.es.length < 3) {
      newErrors.es = t("adminaddcategory.errorcategoryes2");
    } else if (formData.categoryName.es.length > 20) {
      newErrors.es = t("adminaddcategory.errorcategoryen3");
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

  const handleSubmit = () => {
    if (!validateForm()) return;
    dispatch(createCategory(formData));
  };

  const handleClearForm = () => {
    setFormData({
      categoryName: {
        en: "",
        es: ""
      }
    });
    setErrors({});
    dispatch(resetCategoryState());
  };

  const ErrorMessage = ({ error }) => {
    return error ? <p className="text-red-500 text-xs mt-1">{error}</p> : null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Tag className="w-8 h-8 text-black" strokeWidth={1.5} />
              <h1 className="text-2xl font-bold text-gray-800">{t("adminaddcategory.title")}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 max-w-7xl w-full mx-auto">
        {/* {isSuccess && (
          <Alert className="bg-green-50 text-green-800 border border-green-200 mb-6">
            <AlertDescription>
              {t("adminaddcategory.alert")}
            </AlertDescription>
          </Alert>
        )} */}
        
        {isError && (
          <Alert className="bg-red-50 text-red-800 border border-red-200 mb-6">
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-1">{t("adminaddcategory.title1")}</h2>
            <p className="text-gray-500 text-sm">{t("adminaddcategory.dis")}</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <CustomInput
                type="text"
                label={t("adminaddcategory.lable1")}
                id="categoryName.en"
                name="categoryName.en"
                className={errors.en ? "border-red-500" : ""}
                value={formData.categoryName.en}
                onChange={handleChange}
                placeholder={t("adminaddcategory.placeholderen")}
              />
              <ErrorMessage error={errors.en} />
            </div>
            
            <div>
              <CustomInput
                type="text"
                label={t("adminaddcategory.lable2")}
                id="categoryName.es"
                name="categoryName.es"
                className={errors.es ? "border-red-500" : ""}
                value={formData.categoryName.es}
                onChange={handleChange}
                placeholder={t("adminaddcategory.placeholderes")}
              />
              <ErrorMessage error={errors.es} />
            </div>
          </div>
          
          <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClearForm}
              className="px-4"
            >
              {t("adminaddcategory.clear")}
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
                 {t("adminaddcategory.save")}
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("adminaddcategory.save1")}
                </>
              )}
            </Button>
          </div>
        </div>
        <ViewCategory/>
      </div>
    </div>
  );
}