import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, ChefHat, MapPin, Calendar, Phone, Mail, User, Building } from 'lucide-react';
import { updateKitchenProfile, fetchKitchenProfile, resetKitchenState } from '../../features/admin/kitchen/kitchenSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Input = React.forwardRef(({ className = "", type, darkMode = false, ...props }, ref) => {
  const baseStyles = "flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const modeStyles = darkMode
    ? "bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-400 focus-visible:ring-amber-500 focus-visible:border-amber-500 ring-offset-slate-900 disabled:bg-slate-900"
    : "bg-white border-amber-200 text-amber-900 placeholder:text-amber-500 focus-visible:ring-amber-400 focus-visible:border-amber-400 ring-offset-white disabled:bg-amber-50";
  
  return (
    <input
      type={type}
      className={`${baseStyles} ${modeStyles} ${className}`}
      ref={ref}
      {...props}
    />
  );
});

const Label = React.forwardRef(({ className = "", darkMode = false, ...props }, ref) => {
  const modeStyles = darkMode
    ? "text-slate-200 peer-disabled:text-slate-500"
    : "text-amber-900 peer-disabled:text-amber-400";
    
  return (
    <label
      ref={ref}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${modeStyles} ${className}`}
      {...props}
    />
  );
});

const Button = React.forwardRef(({ className = "", variant = "default", size = "default", darkMode = false, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: darkMode 
      ? "bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-500 ring-offset-slate-900" 
      : "bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-400 ring-offset-white",
    outline: darkMode 
      ? "border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-slate-200 focus-visible:ring-amber-500 ring-offset-slate-900" 
      : "border border-amber-300 bg-white hover:bg-amber-50 hover:text-amber-900 focus-visible:ring-amber-400 ring-offset-white",
    secondary: darkMode 
      ? "bg-slate-700 text-slate-200 hover:bg-slate-600 focus-visible:ring-amber-500 ring-offset-slate-900" 
      : "bg-amber-100 text-amber-900 hover:bg-amber-200 focus-visible:ring-amber-400 ring-offset-white",
    destructive: darkMode 
      ? "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 ring-offset-slate-900" 
      : "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400 ring-offset-white"
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8"
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      ref={ref}
      {...props}
    />
  );
});

const KitchenProfile = ({ darkMode: propDarkMode = false }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Fixed selector to get the correct kitchen data
  const kitchenState = useSelector((state) => state.kitchen);
  const { user } = useSelector((state) => state.auth);
  
  // Access the correct kitchen data from kitchenProfile
  const kitchen = kitchenState?.kitchenProfile;
  const isLoading = kitchenState?.isLoading || false;
  const isError = kitchenState?.isError || false;
  const isSuccess = kitchenState?.isSuccess || false;
  const message = kitchenState?.message || '';
  
  const kitchenId = user?.id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    address: {
      en: '',
      es: ''
    },
    city: {
      en: '',
      es: ''
    },
    photo: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [darkMode, setDarkMode] = useState(propDarkMode);
  const [initialLoad, setInitialLoad] = useState(true);

  // Enhanced dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      if (typeof document !== 'undefined') {
        const isDark = document.body.classList.contains('dark') || 
                      document.documentElement.classList.contains('dark') ||
                      propDarkMode;
        setDarkMode(isDark);
      }
    };
    
    // Initial check
    checkDarkMode();
    
    // Set up observer for body class changes
    const observer = new MutationObserver(checkDarkMode);
    
    if (typeof document !== 'undefined') {
      observer.observe(document.body, { 
        attributes: true, 
        attributeFilter: ['class'] 
      });
      
      // Also observe documentElement for Tailwind dark mode
      observer.observe(document.documentElement, { 
        attributes: true, 
        attributeFilter: ['class'] 
      });
    }
    
    return () => {
      observer.disconnect();
    };
  }, [propDarkMode]);

  // Update darkMode when prop changes
  useEffect(() => {
    setDarkMode(propDarkMode);
  }, [propDarkMode]);

  useEffect(() => {
    // Fetch kitchen details on component mount
    if (kitchenId && initialLoad) {
      dispatch(fetchKitchenProfile(kitchenId));
      setInitialLoad(false);
    }
  }, [dispatch, kitchenId, initialLoad]);

  useEffect(() => {
    // Populate form with kitchen data when fetched
    if (kitchen && Object.keys(kitchen).length > 0) {
      const newFormData = {
        name: kitchen.name || '',
        email: kitchen.email || '',
        phone: kitchen.phone || '',
        gender: kitchen.gender || '',
        dob: kitchen.dob ? new Date(kitchen.dob).toISOString().split('T')[0] : '',
        address: {
          en: kitchen.address?.en || '',
          es: kitchen.address?.es || ''
        },
        city: {
          en: kitchen.city?.en || '',
          es: kitchen.city?.es || ''
        },
        photo: kitchen.photo || ''
      };
      
      setFormData(newFormData);
    }
  }, [kitchen]);

  useEffect(() => {
    // Check if data has been loaded successfully
    if (isError) {
      toast.error(message || t('kitchenProfile.error.failedToLoad'));
    }
  }, [isSuccess, isError, message, kitchen, t]);

  useEffect(() => {
    // Reset state on component unmount
    return () => {
      dispatch(resetKitchenState());
    };
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects (address.en, city.es, etc.)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create FormData for file upload
    const formDataToSend = new FormData();
    
    // Check for changes and append only changed fields
    let hasChanges = false;
    
    if (formData.name !== kitchen?.name && formData.name.trim()) {
      formDataToSend.append('name', formData.name.trim());
      hasChanges = true;
    }
    
    if (formData.email !== kitchen?.email && formData.email.trim()) {
      formDataToSend.append('email', formData.email.trim());
      hasChanges = true;
    }
    
    if (formData.phone !== kitchen?.phone && formData.phone.trim()) {
      formDataToSend.append('phone', formData.phone.trim());
      hasChanges = true;
    }
    
    if (formData.gender !== kitchen?.gender && formData.gender) {
      formDataToSend.append('gender', formData.gender);
      hasChanges = true;
    }
    
    if (formData.dob !== (kitchen?.dob ? new Date(kitchen.dob).toISOString().split('T')[0] : '') && formData.dob) {
      formDataToSend.append('dob', formData.dob);
      hasChanges = true;
    }
    
    // Check address changes
    if (JSON.stringify(formData.address) !== JSON.stringify(kitchen?.address || { en: '', es: '' })) {
      formDataToSend.append('address', JSON.stringify(formData.address));
      hasChanges = true;
    }
    
    // Check city changes
    if (JSON.stringify(formData.city) !== JSON.stringify(kitchen?.city || { en: '', es: '' })) {
      formDataToSend.append('city', JSON.stringify(formData.city));
      hasChanges = true;
    }
    
    // Add photo if changed
    if (photoFile) {
      formDataToSend.append('photo', photoFile);
      hasChanges = true;
    }

    if (!hasChanges) {
      toast.info(t('kitchenProfile.success.noChanges'));
      setIsEditing(false);
      return;
    }

    try {
      await dispatch(updateKitchenProfile({
        id: kitchenId,
        profileData: formDataToSend
      })).unwrap();
      
      toast.success(t('kitchenProfile.success.profileUpdated'));
      setIsEditing(false);
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (error) {
      toast.error(error.message || t('kitchenProfile.error.failedToUpdate'));
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (kitchen) {
      setFormData({
        name: kitchen.name || '',
        email: kitchen.email || '',
        phone: kitchen.phone || '',
        gender: kitchen.gender || '',
        dob: kitchen.dob ? new Date(kitchen.dob).toISOString().split('T')[0] : '',
        address: {
          en: kitchen.address?.en || '',
          es: kitchen.address?.es || ''
        },
        city: {
          en: kitchen.city?.en || '',
          es: kitchen.city?.es || ''
        },
        photo: kitchen.photo || ''
      });
    }
    setIsEditing(false);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  // Show loading state
  if (isLoading || (!kitchen && !isError)) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-slate-900' : 'bg-amber-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className={darkMode ? 'text-slate-400' : 'text-amber-600'}>
            {t('kitchenProfile.loading')}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError && !kitchen) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-slate-900' : 'bg-amber-50'
      }`}>
        <div className="text-center">
          <div className={`text-red-500 mb-4`}>
            <ChefHat className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">{t('kitchenProfile.error.failedToLoad')}</p>
            <p className="text-sm">{message || t('kitchenProfile.error.tryAgainLater')}</p>
          </div>
          <Button
            onClick={() => {
              setInitialLoad(true);
              dispatch(fetchKitchenProfile(kitchenId));
            }}
            darkMode={darkMode}
          >
            {t('kitchenProfile.error.retry')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
        : 'bg-gradient-to-br from-amber-50 to-orange-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-lg shadow-lg border backdrop-blur-sm ${
          darkMode 
            ? 'bg-slate-800/80 border-slate-700' 
            : 'bg-white/80 border-amber-200'
        }`}>
          {/* Header */}
          <div className={`px-6 py-4 border-b ${
            darkMode ? 'border-slate-700' : 'border-amber-200'
          }`}>
            <div className="flex items-center mb-2">
              <div className={`h-8 w-8 rounded-md flex items-center justify-center mr-3 ${
                darkMode ? 'bg-amber-600' : 'bg-amber-100'
              }`}>
                <ChefHat className={`h-5 w-5 ${darkMode ? 'text-white' : 'text-amber-600'}`} />
              </div>
              <h1 className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-amber-900'
              }`}>
                {t('kitchenProfile.title')}
              </h1>
            </div>
            <p className={`${darkMode ? 'text-slate-400' : 'text-amber-600'} mt-1`}>
              {t('kitchenProfile.subtitle')}
            </p>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0 relative">
                  <div className={`h-24 w-24 rounded-full border-4 overflow-hidden ${
                    darkMode ? 'border-slate-600' : 'border-amber-200'
                  }`}>
                    {photoPreview || formData.photo ? (
                      <img
                        src={photoPreview || (formData.photo.startsWith('http') ? formData.photo : `http://localhost:5000${formData.photo}`)}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className={`h-full w-full flex items-center justify-center ${
                        darkMode ? 'bg-slate-700' : 'bg-amber-100'
                      }`}>
                        <ChefHat className={`h-8 w-8 ${
                          darkMode ? 'text-slate-400' : 'text-amber-600'
                        }`} />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className={`absolute bottom-0 right-0 p-1 rounded-full cursor-pointer ${
                      darkMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-600 hover:bg-amber-700'
                    }`}>
                      <Camera className="h-4 w-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${
                    darkMode ? 'text-white' : 'text-amber-900'
                  }`}>
                    {formData.name || t('kitchenProfile.defaultValues.kitchenUser')}
                  </h3>
                  <p className={darkMode ? 'text-slate-400' : 'text-amber-600'}>
                    {formData.email}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-amber-500'}`}>
                    {formData.city?.en && `${formData.city.en} • `}
                    {formData.gender && formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)}
                  </p>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" darkMode={darkMode}>
                    <User className="h-4 w-4 inline mr-2" />
                    {t('kitchenProfile.form.personalInfo.fullName')}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    darkMode={darkMode}
                    placeholder={t('kitchenProfile.form.personalInfo.fullNamePlaceholder')}
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" darkMode={darkMode}>
                    <Mail className="h-4 w-4 inline mr-2" />
                    {t('kitchenProfile.form.personalInfo.emailAddress')}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    darkMode={darkMode}
                    placeholder={t('kitchenProfile.form.personalInfo.emailPlaceholder')}
                  />
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone" darkMode={darkMode}>
                    <Phone className="h-4 w-4 inline mr-2" />
                    {t('kitchenProfile.form.personalInfo.phoneNumber')}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    darkMode={darkMode}
                    placeholder={t('kitchenProfile.form.personalInfo.phonePlaceholder')}
                  />
                </div>

                {/* Gender Field */}
                <div className="space-y-2">
                  <Label htmlFor="gender" darkMode={darkMode}>
                    {t('kitchenProfile.form.personalInfo.gender')}
                  </Label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      darkMode
                        ? "bg-slate-800 border-slate-700 text-slate-200 focus-visible:ring-amber-500 focus-visible:border-amber-500 ring-offset-slate-900 disabled:bg-slate-900"
                        : "bg-white border-amber-200 text-amber-900 focus-visible:ring-amber-400 focus-visible:border-amber-400 ring-offset-white disabled:bg-amber-50"
                    }`}
                  >
                    <option value="">{t('kitchenProfile.form.personalInfo.selectGender')}</option>
                    <option value="male">{t('kitchenProfile.form.personalInfo.male')}</option>
                    <option value="female">{t('kitchenProfile.form.personalInfo.female')}</option>
                    <option value="other">{t('kitchenProfile.form.personalInfo.other')}</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dob" darkMode={darkMode}>
                    <Calendar className="h-4 w-4 inline mr-2" />
                    {t('kitchenProfile.form.personalInfo.dateOfBirth')}
                  </Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    darkMode={darkMode}
                  />
                </div>
              </div>

              {/* Address Section */}
              <div className={`rounded-lg p-4 ${
                darkMode ? 'bg-slate-700/50' : 'bg-amber-50'
              }`}>
                <h4 className={`text-sm font-medium mb-4 flex items-center ${
                  darkMode ? 'text-slate-200' : 'text-amber-900'
                }`}>
                  <MapPin className="h-4 w-4 mr-2" />
                  {t('kitchenProfile.form.address.title')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address.en" darkMode={darkMode}>
                      {t('kitchenProfile.form.address.addressEnglish')}
                    </Label>
                    <Input
                      id="address.en"
                      name="address.en"
                      type="text"
                      value={formData.address.en}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      darkMode={darkMode}
                      placeholder={t('kitchenProfile.form.address.addressEnglishPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address.es" darkMode={darkMode}>
                      {t('kitchenProfile.form.address.addressSpanish')}
                    </Label>
                    <Input
                      id="address.es"
                      name="address.es"
                      type="text"
                      value={formData.address.es}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      darkMode={darkMode}
                      placeholder={t('kitchenProfile.form.address.addressSpanishPlaceholder')}
                    />
                  </div>
                </div>
              </div>

              {/* City Section */}
              <div className={`rounded-lg p-4 ${
                darkMode ? 'bg-slate-700/50' : 'bg-amber-50'
              }`}>
                <h4 className={`text-sm font-medium mb-4 flex items-center ${
                  darkMode ? 'text-slate-200' : 'text-amber-900'
                }`}>
                  <Building className="h-4 w-4 mr-2" />
                  {t('kitchenProfile.form.city.title')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city.en" darkMode={darkMode}>
                      {t('kitchenProfile.form.city.cityEnglish')}
                    </Label>
                    <Input
                      id="city.en"
                      name="city.en"
                      type="text"
                      value={formData.city.en}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      darkMode={darkMode}
                      placeholder={t('kitchenProfile.form.city.cityEnglishPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city.es" darkMode={darkMode}>
                      {t('kitchenProfile.form.city.citySpanish')}
                    </Label>
                    <Input
                      id="city.es"
                      name="city.es"
                      type="text"
                      value={formData.city.es}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      darkMode={darkMode}
                      placeholder={t('kitchenProfile.form.city.citySpanishPlaceholder')}
                    />
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className={`rounded-lg p-4 ${
                darkMode ? 'bg-slate-700/50' : 'bg-amber-50'
              }`}>
                <h4 className={`text-sm font-medium mb-3 ${
                  darkMode ? 'text-slate-200' : 'text-amber-900'
                }`}>
                  {t('kitchenProfile.form.account.title')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className={darkMode ? 'text-slate-400' : 'text-amber-600'}>
                      {t('kitchenProfile.form.account.kitchenId')}:
                    </span>
                    <span className={`ml-2 ${darkMode ? 'text-slate-200' : 'text-amber-900'}`}>
                      {kitchen?._id || t('kitchenProfile.form.account.na')}
                    </span>
                  </div>
                  <div>
                    <span className={darkMode ? 'text-slate-400' : 'text-amber-600'}>
                      {t('kitchenProfile.form.account.accountStatus')}:
                    </span>
                    <span className={`ml-2 font-medium ${
                      kitchen?.status === 'Active' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {kitchen?.status === 'Active' 
                        ? t('kitchenProfile.form.account.active')
                        : kitchen?.status === 'Inactive'
                        ? t('kitchenProfile.form.account.inactive')
                        : t('kitchenProfile.form.account.na')
                      }
                    </span>
                  </div>
                  <div>
                    <span className={darkMode ? 'text-slate-400' : 'text-amber-600'}>
                      {t('kitchenProfile.form.account.created')}:
                    </span>
                    <span className={`ml-2 ${darkMode ? 'text-slate-200' : 'text-amber-900'}`}>
                      {kitchen?.createdAt ? new Date(kitchen.createdAt).toLocaleDateString() : t('kitchenProfile.form.account.na')}
                    </span>
                  </div>
                  <div>
                      <span className={darkMode ? 'text-slate-400' : 'text-amber-600'}>
                       {t('kitchenProfile.form.account.lastUpdated')}:
                     </span>
                    <span className={`ml-2 ${darkMode ? 'text-slate-200' : 'text-amber-900'}`}>
                       {kitchen?.updatedAt ? new Date(kitchen.updatedAt).toLocaleDateString() : t('kitchenProfile.form.account.na')}
                     </span>
                   </div>
                 </div>
               </div>

               {/* Action Buttons */}
             <div className={`flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t ${
                darkMode ? 'border-slate-700' : 'border-amber-200'
              }`}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/kitchen/changepassword")}
                  darkMode={darkMode}
                  className="w-full sm:w-auto"
                >
                  {t('kitchenProfile.form.buttons.changePassword')}
                </Button>
                
                <div className="flex space-x-3">
                  {!isEditing ? (
                    <Button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      darkMode={darkMode}
                    >
                      {t('kitchenProfile.form.buttons.editProfile')}
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        darkMode={darkMode}
                      >
                       {t('kitchenProfile.form.buttons.Cancel')}
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        darkMode={darkMode}
                        className="flex items-center"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                           {t('kitchenProfile.form.buttons.updating')}
                          </>
                        ) : (
                          ` ${t('kitchenProfile.form.buttons.saveChanges')}`
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenProfile;
