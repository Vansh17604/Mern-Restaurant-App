import React, { useState, useEffect } from "react";
import { Table, Loader2, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useDispatch, useSelector } from "react-redux";
import { CustomInput } from "../componets/Customes";
import { createTable, resetTableState } from "../../features/admin/table/tableSlice";
import ViewTable from "./ViewTable";

export default function AddTable() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    tablenumber: "",
    tablecapacity: ""
  });
  
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.table
  );

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        tablenumber: "",
        tablecapacity: ""
      });
      setErrors({});
      
      const timer = setTimeout(() => {
        dispatch(resetTableState());
      }, 3000);

      return () => clearTimeout(timer); 
    }
  }, [isSuccess, dispatch]);

  const validateForm = () => {
    const newErrors = {};
    
    // Table number validation
    if (!formData.tablenumber) {
      newErrors.tablenumber = t("adminaddtable.errortablenumber");
    } else if (formData.tablenumber.trim().length === 0) {
      newErrors.tablenumber = t("adminaddtable.errortablenumber2");
    }
    
    // Table capacity validation
    if (!formData.tablecapacity) {
      newErrors.tablecapacity = t("adminaddtable.errortablecapacity");
    } else if (isNaN(formData.tablecapacity) || parseInt(formData.tablecapacity) <= 0) {
      newErrors.tablecapacity = t("adminaddtable.errortablecapacity2");
    } else if (parseInt(formData.tablecapacity) > 20) {
      newErrors.tablecapacity = t("adminaddtable.errortablecapacity3");
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    // Dispatch the createTable action with formData
    dispatch(createTable(formData));
  };

  const handleClearForm = () => {
    setFormData({
      tablenumber: "",
      tablecapacity: ""
    });
    setErrors({});
    dispatch(resetTableState());
  };

  // Render error message component
  const ErrorMessage = ({ error }) => {
    return error ? <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p> : null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Table className="w-8 h-8 text-black dark:text-white" strokeWidth={1.5} />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t("adminaddtable.title")}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 max-w-7xl w-full mx-auto">
        {isSuccess && (
          <Alert className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800 mb-6">
            <AlertDescription>
              {t("adminaddtable.alert")}
            </AlertDescription>
          </Alert>
        )}
        
        {isError && (
          <Alert className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800 mb-6">
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-1">{t("adminaddtable.title1")}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t("adminaddtable.dis")}</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <CustomInput
                type="text"
                label={t("adminaddtable.lable1")}
                id="tablenumber"
                name="tablenumber"
                className={errors.tablenumber ? "border-red-500 dark:border-red-400" : ""}
                value={formData.tablenumber}
                onChange={handleChange}
                placeholder={t("adminaddtable.placeholdertablenumber")}
              />
              <ErrorMessage error={errors.tablenumber} />
            </div>
            
            <div>
              <CustomInput
                type="number"
                label={t("adminaddtable.lable2")}
                id="tablecapacity"
                name="tablecapacity"
                className={errors.tablecapacity ? "border-red-500 dark:border-red-400" : ""}
                value={formData.tablecapacity}
                onChange={handleChange}
                placeholder={t("adminaddtable.placeholdertablecapacity")}
                min="1"
                max="20"
              />
              <ErrorMessage error={errors.tablecapacity} />
            </div>
          </div>
          
          <div className="mt-8 pt-5 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClearForm}
              className="px-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {t("adminaddtable.clear")}
            </Button>
            
            <Button 
              type="button" 
              className="bg-green-700 hover:bg-green-500 dark:bg-green-600 dark:hover:bg-green-500 text-white px-4"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                 {t("adminaddtable.save")}
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("adminaddtable.save1")}
                </>
              )}
            </Button>
            
          </div>
         
        </div>
       <ViewTable/> 
        
      </div>
       
       
    </div>
  );
}