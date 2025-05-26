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
    name: {
      en: "",
      es: ""
    },
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
    perdaySalery: "",
    otperHourSalery: "",
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
        name: {
          en: "",
          es: ""
        },
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
        perdaySalery: "",
        otperHourSalery: "",
        gender: ""
      });
      setSelectedImage(null);
      setImagePreview(null);
      setErrors({});
      
      const timer = setTimeout(() => {
        dispatch(resetWaiterState());
      }, 3000);

      return () => clearTimeout(timer); 
    }
  }, [isSuccess, dispatch]);

  const validateForm = () => {
    const newErrors = {};
    
    // English name validation
    if (!formData.name.en) {
      newErrors.nameEn = "English name is required";
    } else if (formData.name.en.length < 2) {
      newErrors.nameEn = "English name must be at least 2 characters";
    } else if (formData.name.en.length > 50) {
      newErrors.nameEn = "English name must not exceed 50 characters";
    }
    
    // Spanish name validation
    if (!formData.name.es) {
      newErrors.nameEs = "Spanish name is required";
    } else if (formData.name.es.length < 2) {
      newErrors.nameEs = "Spanish name must be at least 2 characters";
    } else if (formData.name.es.length > 50) {
      newErrors.nameEs = "Spanish name must not exceed 50 characters";
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    // Phone validation
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits";
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Phone number must contain only digits";
    }
    
    // English address validation
    if (!formData.address.en) {
      newErrors.addressEn = "English address is required";
    } else if (formData.address.en.length < 5) {
      newErrors.addressEn = "English address must be at least 5 characters";
    } else if (formData.address.en.length > 200) {
      newErrors.addressEn = "English address must not exceed 200 characters";
    }
    
    // Spanish address validation
    if (!formData.address.es) {
      newErrors.addressEs = "Spanish address is required";
    } else if (formData.address.es.length < 5) {
      newErrors.addressEs = "Spanish address must be at least 5 characters";
    } else if (formData.address.es.length > 200) {
      newErrors.addressEs = "Spanish address must not exceed 200 characters";
    }
    
    // English city validation
    if (!formData.city.en) {
      newErrors.cityEn = "English city is required";
    } else if (formData.city.en.length < 2) {
      newErrors.cityEn = "English city must be at least 2 characters";
    } else if (formData.city.en.length > 50) {
      newErrors.cityEn = "English city must not exceed 50 characters";
    }
    
    // Spanish city validation
    if (!formData.city.es) {
      newErrors.cityEs = "Spanish city is required";
    } else if (formData.city.es.length < 2) {
      newErrors.cityEs = "Spanish city must be at least 2 characters";
    } else if (formData.city.es.length > 50) {
      newErrors.cityEs = "Spanish city must not exceed 50 characters";
    }
    
    // Date of birth validation
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const today = new Date();
      const birthDate = new Date(formData.dob);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.dob = "Waiter must be at least 18 years old";
      } else if (age > 65) {
        newErrors.dob = "Age cannot exceed 65 years";
      }
    }
    
    // Per day salary validation
    if (!formData.perdaySalery) {
      newErrors.perdaySalery = "Per day salary is required";
    } else if (isNaN(formData.perdaySalery) || parseFloat(formData.perdaySalery) <= 0) {
      newErrors.perdaySalery = "Per day salary must be a positive number";
    } else if (parseFloat(formData.perdaySalery) < 10) {
      newErrors.perdaySalery = "Per day salary must be at least $10";
    }
    
    // OT per hour salary validation
    if (!formData.otperHourSalery) {
      newErrors.otperHourSalery = "OT per hour salary is required";
    } else if (isNaN(formData.otperHourSalery) || parseFloat(formData.otperHourSalery) <= 0) {
      newErrors.otperHourSalery = "OT per hour salary must be a positive number";
    } else if (parseFloat(formData.otperHourSalery) < 5) {
      newErrors.otperHourSalery = "OT per hour salary must be at least $5";
    }
    
    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    
    // Photo validation
    if (!selectedImage) {
      newErrors.photo = "Photo is required";
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
        [child]: newValue // ← use newValue here
      }
    }));
  } else {
    setFormData(prev => ({ ...prev, [name]: newValue })); // ← use newValue here
  }
};


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, photo: "Please select a valid image file (JPEG, JPG, PNG, WEBP)" }));
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: "Image size must be less than 5MB" }));
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
    // Reset file input
    const fileInput = document.getElementById('photoInput');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const submitData = new FormData();
    submitData.append('name[en]', formData.name.en);
    submitData.append('name[es]', formData.name.es);
    submitData.append('email', formData.email);
    submitData.append('password', formData.password);
    submitData.append('phone', formData.phone);
    submitData.append('address[en]', formData.address.en);
    submitData.append('address[es]', formData.address.es);
    submitData.append('city[en]', formData.city.en);
    submitData.append('city[es]', formData.city.es);
    submitData.append('dob', formData.dob);
    submitData.append('perdaySalery', formData.perdaySalery);
    submitData.append('otperHourSalery', formData.otperHourSalery);
    submitData.append('gender', formData.gender);
    submitData.append('photo', selectedImage);
    
    dispatch(registerWaiter(submitData));
    if (isSuccess) {
      navigate("/admin/waiters");
    }
  };

  const handleClearForm = () => {
    setFormData({
      name: {
        en: "",
        es: ""
      },
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
      perdaySalery: "",
      otperHourSalery: "",
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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Register New Waiter</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 max-w-7xl w-full mx-auto">
        {isSuccess && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700">
            <AlertDescription>
              Waiter registered successfully!
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
            <h2 className="text-lg font-medium mb-1 text-gray-800 dark:text-white">Waiter Information</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the details to register a new waiter</p>
          </div>
          
          <div className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <CustomInput
                  type="text"
                  label="Name (English)"
                  id="name.en"
                  name="name.en"
                  className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.nameEn ? "border-red-500 dark:border-red-400" : ""}`}
                  value={formData.name.en}
                  onChange={handleChange}
                  placeholder="Enter name in English"
                />
                <ErrorMessage error={errors.nameEn} />
              </div>
              
              <div>
                <CustomInput
                  type="text"
                  label="Name (Spanish)"
                  id="name.es"
                  name="name.es"
                  className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.nameEs ? "border-red-500 dark:border-red-400" : ""}`}
                  value={formData.name.es}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre en español"
                />
                <ErrorMessage error={errors.nameEs} />
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <CustomInput
                  type="email"
                  label="Email"
                  id="email"
                  name="email"
                  className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.email ? "border-red-500 dark:border-red-400" : ""}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
                <ErrorMessage error={errors.email} />
              </div>
              
              <div>
               <CustomInput
  type="tel"
  label="Phone Number"
  inputMode="numeric"
  pattern="[0-9]*"
  id="phone"
  maxLength="10"
  name="phone"
  className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.phone ? "border-red-500 dark:border-red-400" : ""}`}
  value={formData.phone}
  onChange={handleChange}
  placeholder="Enter phone number"
/>
                <ErrorMessage error={errors.phone} />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Password <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
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
                  Confirm Password <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
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
                  Address (English) <span className="text-red-500 dark:text-red-400">*</span>
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
                  placeholder="Enter address in English"
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
                  Address (Spanish) <span className="text-red-500 dark:text-red-400">*</span>
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
                  placeholder="Address in Spanish"
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
                  label="City (English)"
                  id="city.en"
                  name="city.en"
                  className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.cityEn ? "border-red-500 dark:border-red-400" : ""}`}
                  value={formData.city.en}
                  onChange={handleChange}
                  placeholder="Enter city in English"
                />
                <ErrorMessage error={errors.cityEn} />
              </div>
              
              <div>
                <CustomInput
                  type="text"
                  label="City (Spanish)"
                  id="city.es"
                  name="city.es"
                  className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.cityEs ? "border-red-500 dark:border-red-400" : ""}`}
                  value={formData.city.es}
                  onChange={handleChange}
                  placeholder="Ingrese la ciudad en español"
                />
                <ErrorMessage error={errors.cityEs} />
              </div>
            </div>

            {/* Date of Birth and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Date of Birth <span className="text-red-500 dark:text-red-400">*</span>
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
                  Gender <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                    errors.gender ? "border-red-500 dark:border-red-400" : ""
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ErrorMessage error={errors.gender} />
              </div>
            </div>

            {/* Salary Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Per Day Salary ($) <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="perdaySalery"
                  value={formData.perdaySalery}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="Enter daily salary"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                    errors.perdaySalery ? "border-red-500 dark:border-red-400" : ""
                  }`}
                />
                <ErrorMessage error={errors.perdaySalery} />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  OT Per Hour Salary ($) <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="otperHourSalery"
                  value={formData.otperHourSalery}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="Enter hourly OT rate"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                    errors.otperHourSalery ? "border-red-500 dark:border-red-400" : ""
                  }`}
                />
                <ErrorMessage error={errors.otperHourSalery} />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Photo <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed rounded-lg p-6 text-center transition-colors border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-400" />
                  <div className="mt-2">
                    <label
                      htmlFor="photoInput"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Choose Photo
                    </label>
                    <input
                      id="photoInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, JPEG, WEBP up to 5MB
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <img
                   src={imagePreview}
                    alt="Waiter preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
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
              <ErrorMessage error={errors.photo} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Registering...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Register Waiter
                </>
              )}
            </Button>
            
            <Button
              type="button"
              onClick={handleClearForm}
              disabled={isLoading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white"
            >
              Clear Form
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}