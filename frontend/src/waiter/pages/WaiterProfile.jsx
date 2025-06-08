import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, User, MapPin, Calendar, Phone, Mail, Building } from 'lucide-react';
import { updateWaiterProfile, fetchWaiterProfile, resetWaiterState } from '../../features/admin/waiter/waiterSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const Input = React.forwardRef(({ className = "", type, ...props }, ref) => {
  const baseStyles = "flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const modeStyles = "bg-white dark:bg-slate-800 border-teal-200 dark:border-slate-700 text-teal-900 dark:text-slate-200 placeholder:text-teal-500 dark:placeholder:text-slate-400 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-500 focus-visible:border-teal-400 dark:focus-visible:border-teal-500 ring-offset-white dark:ring-offset-slate-900 disabled:bg-teal-50 dark:disabled:bg-slate-900";
  
  return (
    <input
      type={type}
      className={`${baseStyles} ${modeStyles} ${className}`}
      ref={ref}
      {...props}
    />
  );
});

const Label = React.forwardRef(({ className = "", ...props }, ref) => {
  const modeStyles = "text-teal-900 dark:text-slate-200 peer-disabled:text-teal-400 dark:peer-disabled:text-slate-500";
    
  return (
    <label
      ref={ref}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${modeStyles} ${className}`}
      {...props}
    />
  );
});

const Button = React.forwardRef(({ className = "", variant = "default", size = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-teal-600 text-white hover:bg-teal-700 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-500 ring-offset-white dark:ring-offset-slate-900",
    outline: "border border-teal-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-900 dark:hover:text-slate-200 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-500 ring-offset-white dark:ring-offset-slate-900",
    secondary: "bg-teal-100 dark:bg-slate-700 text-teal-900 dark:text-slate-200 hover:bg-teal-200 dark:hover:bg-slate-600 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-500 ring-offset-white dark:ring-offset-slate-900",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400 dark:focus-visible:ring-red-500 ring-offset-white dark:ring-offset-slate-900"
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

const WaiterProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const waiterState = useSelector((state) => state.waiter);
  const { user } = useSelector((state) => state.auth);
  const waiter = waiterState?.profile;
  const isLoading = waiterState?.isLoading || false;
  const isError = waiterState?.isError || false;
  const isSuccess = waiterState?.isSuccess || false;
  const message = waiterState?.message || '';
  
  const waiterId = user?.id;

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
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Fetch waiter details on component mount
    if (waiterId && initialLoad) {
      dispatch(fetchWaiterProfile(waiterId));
      setInitialLoad(false);
    }
  }, [dispatch, waiterId, initialLoad]);

  useEffect(() => {
    // Populate form with waiter data when fetched
    if (waiter && Object.keys(waiter).length > 0) {
      const newFormData = {
        name: waiter.name || '',
        email: waiter.email || '',
        phone: waiter.phone || '',
        gender: waiter.gender || '',
        dob: waiter.dob ? new Date(waiter.dob).toISOString().split('T')[0] : '',
        address: {
          en: waiter.address?.en || '',
          es: waiter.address?.es || ''
        },
        city: {
          en: waiter.city?.en || '',
          es: waiter.city?.es || ''
        },
        photo: waiter.photo || ''
      };
      
      setFormData(newFormData);
    }
  }, [waiter]);

  useEffect(() => {
    // Check if data has been loaded successfully
    if (isError) {
      toast.error(message || t('waiterprofile.error.failedToUpdate'));
    }
  }, [isSuccess, isError, message, waiter, t]);

  useEffect(() => {
    // Reset state on component unmount
    return () => {
      dispatch(resetWaiterState());
    };
  }, [dispatch]);

  const handleInputChange = (e) => {
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
    
    if (formData.name !== waiter?.name && formData.name.trim()) {
      formDataToSend.append('name', formData.name.trim());
      hasChanges = true;
    }
    
    if (formData.email !== waiter?.email && formData.email.trim()) {
      formDataToSend.append('email', formData.email.trim());
      hasChanges = true;
    }
    
    if (formData.phone !== waiter?.phone && formData.phone.trim()) {
      formDataToSend.append('phone', formData.phone.trim());
      hasChanges = true;
    }
    
    if (formData.gender !== waiter?.gender && formData.gender) {
      formDataToSend.append('gender', formData.gender);
      hasChanges = true;
    }
    
    if (formData.dob !== (waiter?.dob ? new Date(waiter.dob).toISOString().split('T')[0] : '') && formData.dob) {
      formDataToSend.append('dob', formData.dob);
      hasChanges = true;
    }
    
    // Check address changes
    if (JSON.stringify(formData.address) !== JSON.stringify(waiter?.address || { en: '', es: '' })) {
      formDataToSend.append('address', JSON.stringify(formData.address));
      hasChanges = true;
    }
    
    // Check city changes
    if (JSON.stringify(formData.city) !== JSON.stringify(waiter?.city || { en: '', es: '' })) {
      formDataToSend.append('city', JSON.stringify(formData.city));
      hasChanges = true;
    }
    
    // Add photo if changed
    if (photoFile) {
      formDataToSend.append('photo', photoFile);
      hasChanges = true;
    }

    if (!hasChanges) {
      toast.info(t('waiterprofile.messages.noChanges'));
      setIsEditing(false);
      return;
    }

    try {
      await dispatch(updateWaiterProfile({
        id: waiterId,
        profileData: formDataToSend
      })).unwrap();
      
      toast.success(t('waiterprofile.messages.profileUpdated'));
      setIsEditing(false);
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (error) {
      toast.error(error.message || t('waiterprofile.error.failedToUpdate'));
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (waiter) {
      setFormData({
        name: waiter.name || '',
        email: waiter.email || '',
        phone: waiter.phone || '',
        gender: waiter.gender || '',
        dob: waiter.dob ? new Date(waiter.dob).toISOString().split('T')[0] : '',
        address: {
          en: waiter.address?.en || '',
          es: waiter.address?.es || ''
        },
        city: {
          en: waiter.city?.en || '',
          es: waiter.city?.es || ''
        },
        photo: waiter.photo || ''
      });
    }
    setIsEditing(false);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  // Show loading state
  if (isLoading || (!waiter && !isError)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-teal-600 dark:text-slate-400">
            {t('waiterprofile.loading')}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError && !waiter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <User className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">{t('waiterprofile.error.failedToLoad')}</p>
            <p className="text-sm">{message || t('waiterprofile.error.tryAgainLater')}</p>
          </div>
          <Button
            onClick={() => {
              setInitialLoad(true);
              dispatch(fetchWaiterProfile(waiterId));
            }}
          >
            {t('waiterprofile.retry')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 bg-gradient-to-br from-teal-50 to-cyan-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-lg shadow-lg border backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border-teal-200 dark:border-slate-700">
          {/* Header */}
          <div className="px-6 py-4 border-b border-teal-200 dark:border-slate-700">
            <div className="flex items-center mb-2">
              <div className="h-8 w-8 rounded-md flex items-center justify-center mr-3 bg-teal-100 dark:bg-teal-600">
                <User className="h-5 w-5 text-teal-600 dark:text-white" />
              </div>
              <h1 className="text-2xl font-bold text-teal-900 dark:text-white">
                {t('waiterprofile.title')}
              </h1>
            </div>
            <p className="text-teal-600 dark:text-slate-400 mt-1">
              {t('waiterprofile.subtitle')}
            </p>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0 relative">
                  <div className="h-24 w-24 rounded-full border-4 overflow-hidden border-teal-200 dark:border-slate-600">
                    {photoPreview || formData.photo ? (
                      <img
                        src={photoPreview || (formData.photo.startsWith('http') ? formData.photo : `http://localhost:5000${formData.photo}`)}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-teal-100 dark:bg-slate-700">
                        <User className="h-8 w-8 text-teal-600 dark:text-slate-400" />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 p-1 rounded-full cursor-pointer bg-teal-600 hover:bg-teal-700">
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
                  <h3 className="text-lg font-medium text-teal-900 dark:text-white">
                    {formData.name || 'Waiter User'}
                  </h3>
                  <p className="text-teal-600 dark:text-slate-400">
                    {formData.email}
                  </p>
                  <p className="text-sm text-teal-500 dark:text-slate-500">
                    {formData.city?.en && `${formData.city.en} • `}
                    {formData.gender && formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)}
                  </p>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    <User className="h-4 w-4 inline mr-2" />
                    {t('waiterprofile.fields.fullName')}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder={t('waiterprofile.fields.fullNamePlaceholder')}
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="h-4 w-4 inline mr-2" />
                    {t('waiterprofile.fields.emailAddress')}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder={t('waiterprofile.fields.emailPlaceholder')}
                  />
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="h-4 w-4 inline mr-2" />
                    {t('waiterprofile.fields.phoneNumber')}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder={t('waiterprofile.fields.phonePlaceholder')}
                  />
                </div>

                {/* Gender Field */}
                <div className="space-y-2">
                  <Label htmlFor="gender">
                    {t('waiterprofile.fields.gender')}
                  </Label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white dark:bg-slate-800 border-teal-200 dark:border-slate-700 text-teal-900 dark:text-slate-200 focus-visible:ring-teal-400 dark:focus-visible:ring-teal-500 focus-visible:border-teal-400 dark:focus-visible:border-teal-500 dark:ring-offset-slate-900 disabled:bg-teal-50 dark:disabled:bg-slate-900"
                  >
                    <option value="">{t('waiterprofile.fields.selectGender')}</option>
                    <option value="male">{t('waiterprofile.fields.male')}</option>
                    <option value="female">{t('waiterprofile.fields.female')}</option>
                    <option value="other">{t('waiterprofile.fields.other')}</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dob">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    {t('waiterprofile.fields.dateOfBirth')}
                  </Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Address Section */}
              <div className="rounded-lg p-4 bg-teal-50 dark:bg-slate-700/50">
                <h4 className="text-sm font-medium mb-4 flex items-center text-teal-900 dark:text-slate-200">
                  <MapPin className="h-4 w-4 mr-2" />
                  {t('waiterprofile.address.title')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address.en">
                      {t('waiterprofile.address.english')}
                    </Label>
                    <Input
                      id="address.en"
                      name="address.en"
                      type="text"
                      value={formData.address.en}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder={t('waiterprofile.address.englishPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address.es">
                      {t('waiterprofile.address.spanish')}
                    </Label>
                    <Input
                      id="address.es"
                      name="address.es"
                      type="text"
                      value={formData.address.es}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder={t('waiterprofile.address.spanishPlaceholder')}
                    />
                  </div>
                </div>
              </div>

              {/* City Section */}
              <div className="rounded-lg p-4 bg-teal-50 dark:bg-slate-700/50">
                <h4 className="text-sm font-medium mb-4 flex items-center text-teal-900 dark:text-slate-200">
                  <Building className="h-4 w-4 mr-2" />
                  {t('waiterprofile.city.title')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city.en">
                      {t('waiterprofile.city.english')}
                    </Label>
                    <Input
                      id="city.en"
                      name="city.en"
                      type="text"
                      value={formData.city.en}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder={t('waiterprofile.city.englishPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city.es">
                      {t('waiterprofile.city.spanish')}
                    </Label>
                    <Input
                      id="city.es"
                      name="city.es"
                      type="text"
                      value={formData.city.es}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder={t('waiterprofile.city.spanishPlaceholder')}
                    />
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="rounded-lg p-4 bg-teal-50 dark:bg-slate-700/50">
                <h4 className="text-sm font-medium mb-3 text-teal-900 dark:text-slate-200">
                  {t('waiterprofile.account.title')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-teal-600 dark:text-slate-400">
                      {t('waiterprofile.account.waiterId')}:
                    </span>
                    <span className="ml-2 text-teal-900 dark:text-slate-200">
                      {waiter?._id || t('waiterprofile.account.notAvailable')}
                    </span>
                  </div>
                  <div>
                    <span className="text-teal-600 dark:text-slate-400">
                      {t('waiterprofile.account.status')}:
                    </span>
                    <span className={`ml-2 font-medium ${waiter?.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                      {waiter?.status || t('waiterprofile.account.notAvailable')}
                    </span>
                  </div>
                  <div>
                    <span className="text-teal-600 dark:text-slate-400">
                      {t('waiterprofile.account.created')}:
                    </span>
                    <span className="ml-2 text-teal-900 dark:text-slate-200">
                      {waiter?.createdAt ? new Date(waiter.createdAt).toLocaleDateString() : t('waiterprofile.account.notAvailable')}
                    </span>
                  </div>
                  <div>
                    <span className="text-teal-600 dark:text-slate-400">
                      {t('waiterprofile.account.lastUpdated')}:
                    </span>
                    <span className="ml-2 text-teal-900 dark:text-slate-200">
                      {waiter?.updatedAt ? new Date(waiter.updatedAt).toLocaleDateString() : t('waiterprofile.account.notAvailable')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-teal-200 dark:border-slate-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/waiter/changepassword")}
                  className="w-full sm:w-auto"
                >
                  {t('waiterprofile.buttons.changePassword')}
                </Button>
                
                <div className="flex space-x-3">
                  {!isEditing ? (
                    <Button
                      type="button"
                      onClick={() => setIsEditing(true)}
                    >
                      {t('waiterprofile.buttons.editProfile')}
                    </Button>
                  )  : (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        darkMode={darkMode}
                      >
                         {t('waiterprofile.buttons.cancel')}
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
                            {t('waiterprofile.buttons.updating')}
                          </>
                        ) : (
                          `${t('waiterprofile.buttons.saveChanges')}`
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

export default WaiterProfile;