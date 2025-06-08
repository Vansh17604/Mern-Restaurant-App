import React, { useState, useEffect } from "react";
import { Users, Loader2, Plus, Upload, X, Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useDispatch, useSelector } from "react-redux";
import { CustomInput } from "../componets/Customes";
import { registerWaiter, resetWaiterState } from "../../features/admin/waiter/waiterSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function WaiterRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: {
      en: "",
      es: ""
    },
    city: {
      en: "",
      es: ""
    },
    dob: "",
    gender: ""
  });
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.waiter
  );

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: {
          en: "",
          es: ""
        },
        city: {
          en: "",
          es: ""
        },
        dob: "",
        gender: ""
      });
      setSelectedImage(null);
      setImagePreview(null);
      setErrors({});
 
      const navigationTimer = setTimeout(() => {
        navigate("/admin/viewwaiter");
      }, 2000);
      
  
      const resetTimer = setTimeout(() => {
        dispatch(resetWaiterState());
      }, 2500);

      return () => {
        clearTimeout(navigationTimer);
        clearTimeout(resetTimer);
      };
     

     
    }
  }, [isSuccess, dispatch,navigate]);
    useEffect(() => {
    dispatch(resetWaiterState());
  }, [dispatch]);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name) {
      newErrors.name = t("waiterregistration.err");
    } else if (formData.name.length < 2) {
      newErrors.name = t("waiterregistration.err1");
    } else if (formData.name.length > 50) {
      newErrors.name = t("waiterregistration.err2");
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = t("waiterregistration.err6");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("waiterregistration.err7");
    }
    
    if (!formData.password) {
      newErrors.password = t("waiterregistration.err8");
    } else if (formData.password.length < 8) {
      newErrors.password = t("waiterregistration.err9");
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = t("waiterregistration.err10");
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("waiterregistration.err11");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("waiterregistration.err12");
    }
    
    // Phone validation
    if (!formData.phone) {
      newErrors.phone = t("waiterregistration.err13");
    } else if (formData.phone.length < 10) {
      newErrors.phone = t("waiterregistration.err40");
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = t("waiterregistration.err14");
    }
    
    // English address validation
    if (!formData.address.en) {
      newErrors.addressEn = t("waiterregistration.err15");
    } else if (formData.address.en.length < 5) {
      newErrors.addressEn = t("waiterregistration.err16");
    } else if (formData.address.en.length > 200) {
      newErrors.addressEn = t("waiterregistration.err17");
    }
    
    // Spanish address validation
    if (!formData.address.es) {
      newErrors.addressEs = t("waiterregistration.err18");
    } else if (formData.address.es.length < 5) {
      newErrors.addressEs = t("waiterregistration.err19");
    } else if (formData.address.es.length > 200) {
      newErrors.addressEs = t("waiterregistration.err20");
    }
    
    // English city validation
    if (!formData.city.en) {
      newErrors.cityEn = t("waiterregistration.err21");
    } else if (formData.city.en.length < 2) {
      newErrors.cityEn = t("waiterregistration.err22");
    } else if (formData.city.en.length > 50) {
      newErrors.cityEn = t("waiterregistration.err23");
    }
    
    // Spanish city validation
    if (!formData.city.es) {
      newErrors.cityEs = t("waiterregistration.err24");
    } else if (formData.city.es.length < 2) {
      newErrors.cityEs = t("waiterregistration.err25");
    } else if (formData.city.es.length > 50) {
      newErrors.cityEs = t("waiterregistration.err26");
    }
    
    // Date of birth validation
    if (!formData.dob) {
      newErrors.dob = t("waiterregistration.err27");
    } else {
      const today = new Date();
      const birthDate = new Date(formData.dob);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.dob = t("waiterregistration.err28");
      } else if (age > 65) {
        newErrors.dob = t("waiterregistration.err29");
      }
    }
    
    // Gender validation
    if (!formData.gender) {
      newErrors.gender = t("waiterregistration.err36");
    }
    
    // Photo validation
    if (!selectedImage) {
      newErrors.photo = t("waiterregistration.err37");
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleChange = (e) => {
  const { name, value } = e.target;
  let newValue = value;

  if (name === "phone") {
    newValue = value.replace(/\D/g, ""); // Only digits
  }

  if (name.includes('.')) {
    const [parent, child] = name.split('.');
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: newValue
      }
    }));
  } else {
    setFormData(prev => ({ ...prev, [name]: newValue }));
  }
};

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, photo: t("waiterregistration.err38") }));
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: t("waiterregistration.err39") }));
        return;
      }
      
      setSelectedImage(file);
      setErrors(prev => ({ ...prev, photo: "" }));
      
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
    
    const fileInput = document.getElementById('photoInput');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('password', formData.password);
    submitData.append('phone', formData.phone);
    submitData.append('address[en]', formData.address.en);
    submitData.append('address[es]', formData.address.es);
    submitData.append('city[en]', formData.city.en);
    submitData.append('city[es]', formData.city.es);
    submitData.append('dob', formData.dob);
    submitData.append('gender', formData.gender);
    submitData.append('photo', selectedImage);
    
    dispatch(registerWaiter(submitData));
 
  };

  const handleClearForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: {
        en: "",
        es: ""
      },
      city: {
        en: "",
        es: ""
      },
      dob: "",
      gender: ""
    });
    setSelectedImage(null);
    setImagePreview(null);
    setErrors({});
    dispatch(resetWaiterState());
    
    // Reset file input
    const fileInput = document.getElementById('photoInput');
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
            <Users className="w-8 h-8 text-black dark:text-white" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t("waiterregistration.title")}</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 max-w-7xl w-full mx-auto">
        {isSuccess && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700">
            <AlertDescription>
              {t("waiterregistration.message")}
            </AlertDescription>
          </Alert>
        )}
        
        {isError && (
          <Alert className="mb-6 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700">
            <AlertDescription>
              {message || t("waiterregistration.message1")}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="rounded-lg border shadow-sm p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-1 text-gray-800 dark:text-white">{t("waiterregistration.title1")}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("waiterregistration.dis")}</p>
          </div>
          
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <CustomInput
                type="text"
                label={t("waiterregistration.label") || "Name"}
                id="name"
                name="name"
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.name ? "border-red-500 dark:border-red-400" : ""}`}
                value={formData.name}
                onChange={handleChange}
                placeholder={t("waiterregistration.placeholder") || "Enter waiter name"}
              />
              <ErrorMessage error={errors.name} />
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <CustomInput
                  type="email"
                  label={t("waiterregistration.label2") || "Email"}
                  id="email"
                  name="email"
                  className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.email ? "border-red-500 dark:border-red-400" : ""}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("waiterregistration.placeholder2") || "Enter email address"}
                />
                <ErrorMessage error={errors.email} />
              </div>
              
              <div>
                <CustomInput
                  type="tel"
                  label={t("waiterregistration.label3") || "Phone"}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="phone"
                  maxLength="10"
                  name="phone"
                  className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.phone ? "border-red-500 dark:border-red-400" : ""}`}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("waiterregistration.placeholder3") || "Enter phone number"}
                />
                <ErrorMessage error={errors.phone} />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t("waiterregistration.label4") || "Password"} <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t("waiterregistration.placeholder4") || "Enter password"}
                    className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                      errors.password ? "border-red-500 dark:border-red-400" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <ErrorMessage error={errors.password} />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t("waiterregistration.label5") || "Confirm Password"} <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t("waiterregistration.placeholder5") || "Confirm password"}
                    className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                      errors.confirmPassword ? "border-red-500 dark:border-red-400" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <ErrorMessage error={errors.confirmPassword} />
              </div>
            </div>

            {/* Address Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t("waiterregistration.label6") || "Address (English)"} <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <textarea
                  name="address.en"
                  value={formData.address.en}
                  onChange={handleChange}
                  rows={3}
                  maxLength={200}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                    errors.addressEn ? "border-red-500 dark:border-red-400" : ""
                  }`}
                  placeholder={t("waiterregistration.placeholder6") || "Enter address in English"}
                />
                <div className="flex justify-between items-center mt-1">
                  <ErrorMessage error={errors.addressEn} />
                  <span className="text-xs text-gray-400 dark:text-gray-400">
                    {formData.address.en.length}/200
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t("waiterregistration.label7") || "Address (Spanish)"} <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <textarea
                  name="address.es"
                  value={formData.address.es}
                  onChange={handleChange}
                  rows={3}
                  maxLength={200}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                    errors.addressEs ? "border-red-500 dark:border-red-400" : ""
                  }`}
                  placeholder={t("waiterregistration.placeholder7") || "Enter address in Spanish"}
                />
                <div className="flex justify-between items-center mt-1">
                  <ErrorMessage error={errors.addressEs} />
                  <span className="text-xs text-gray-400 dark:text-gray-400">
                    {formData.address.es.length}/200
                  </span>
                </div>
              </div>
            </div>

            {/* City Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <CustomInput
                  type="text"
                  label={t("waiterregistration.label8") || "City (English)"}
                  id="city.en"
                  name="city.en"
                  className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.cityEn ? "border-red-500 dark:border-red-400" : ""}`}
                  value={formData.city.en}
                  onChange={handleChange}
                  placeholder={t("waiterregistration.placeholder8") || "Enter city in English"}
                />
                <ErrorMessage error={errors.cityEn} />
              </div>
              
              <div>
                <CustomInput
                  type="text"
                  label={t("waiterregistration.label9") || "City (Spanish)"}
                  id="city.es"
                  name="city.es"
                  className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.cityEs ? "border-red-500 dark:border-red-400" : ""}`}
                  value={formData.city.es}
                  onChange={handleChange}
                  placeholder={t("waiterregistration.placeholder9") || "Enter city in Spanish"}
                />
                <ErrorMessage error={errors.cityEs} />
              </div>
            </div>

            {/* Date of Birth and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t("waiterregistration.label10") || "Date of Birth"} <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                    errors.dob ? "border-red-500 dark:border-red-400" : ""
                  }`}
                />
                <ErrorMessage error={errors.dob} />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t("waiterregistration.label11") || "Gender"} <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                    errors.gender ? "border-red-500 dark:border-red-400" : ""
                  }`}
                >
                  <option value="">{t("waiterregistration.option") || "Select gender"}</option>
                  <option value="Male">{t("waiterregistration.option1") || "Male"}</option>
                  <option value="Female">{t("waiterregistration.option2") || "Female"}</option>
                  <option value="Other">{t("waiterregistration.option3") || "Other"}</option>
                </select>
                <ErrorMessage error={errors.gender} />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {t("waiterregistration.label14") || "Photo"} <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed rounded-lg p-6 text-center transition-colors border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {t("waiterregistration.img") || "Click to upload photo"}
                  </p>
                  <input
                    id="photoInput"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('photoInput').click()}
                    className="mt-4 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {t("waiterregistration.choose") || "Choose File"}
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedImage?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(selectedImage?.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeImage}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-red-200 hover:border-red-300 dark:border-red-600 dark:hover:border-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <ErrorMessage error={errors.photo} />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("waiterregistration.register") || "Registering..."}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("waiterregistration.register1") || "Register Waiter"}
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleClearForm}
              disabled={isLoading}
              className="flex-1 sm:flex-none dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {t("waiterregistration.clear") || "Clear Form"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}