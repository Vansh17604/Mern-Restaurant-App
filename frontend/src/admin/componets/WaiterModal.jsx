import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { CustomInput, CustomModal } from "../componets/Customes";
import { useTranslation } from "react-i18next";

const WaiterModal = ({
  isOpen,
  onClose,
  onSubmit,
  selectedWaiter,
  isLoading
}) => {
  const { t, i18n } = useTranslation();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const base_url = import.meta.env.VITE_BASE_URL;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
    gender: "",
    password: ""
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (isOpen && selectedWaiter) {
      setFormData({
        name: selectedWaiter.name || "",
        email: selectedWaiter.email || "",
        phone: selectedWaiter.phone || "",
        address: {
          en: selectedWaiter.address?.en || "",
          es: selectedWaiter.address?.es || ""
        },
        city: {
          en: selectedWaiter.city?.en || "",
          es: selectedWaiter.city?.es || ""
        },
        dob: selectedWaiter.dob ? selectedWaiter.dob.split('T')[0] : "",
        gender: selectedWaiter.gender || "",
        password: "" 
      });

      if (selectedWaiter.photo) {
        setImagePreview(selectedWaiter.photo);
      }
    } else if (isOpen) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: { en: "", es: "" },
        city: { en: "", es: "" },
        dob: "",
        gender: "",
        password: ""
      });
      setImagePreview(null);
      setSelectedImage(null);
    }
  }, [isOpen, selectedWaiter]);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name) {
      newErrors.name = t("waitermodal.validation.nameRequired");
    }
    
    if (!formData.email) {
      newErrors.email = t("waitermodal.validation.emailRequired");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = t("waitermodal.validation.emailInvalid");
      }
    }
    
    if (!formData.phone) {
      newErrors.phone = t("waitermodal.validation.phoneRequired");
    } else if (formData.phone.length < 10) {
      newErrors.phone = t("waitermodal.validation.phoneMinLength");
    }
    
    if (!formData.address.en) {
      newErrors.addressEn = t("waitermodal.validation.addressEnRequired");
    }
    
    if (!formData.address.es) {
      newErrors.addressEs = t("waitermodal.validation.addressEsRequired");
    }
    
    if (!formData.city.en) {
      newErrors.cityEn = t("waitermodal.validation.cityEnRequired");
    }
    
    if (!formData.city.es) {
      newErrors.cityEs = t("waitermodal.validation.cityEsRequired");
    }
    
    // Date of birth validation
    if (!formData.dob) {
      newErrors.dob = t("waitermodal.validation.dobRequired");
    }
    
    // Gender validation
    if (!formData.gender) {
      newErrors.gender = t("waitermodal.validation.genderRequired");
    }
    
    // Password validation (only for new waiters)
    if (!selectedWaiter && !formData.password) {
      newErrors.password = t("waitermodal.validation.passwordRequired");
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

  const handleGenderChange = (value) => {
    setFormData(prev => ({ ...prev, gender: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: t("waitermodal.validation.imageInvalidType") }));
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: t("waitermodal.validation.imageSize") }));
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
    const fileInput = document.getElementById('waiterImageInput');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    submitData.append('address[en]', formData.address.en);
    submitData.append('address[es]', formData.address.es);
    submitData.append('city[en]', formData.city.en);
    submitData.append('city[es]', formData.city.es);
    submitData.append('dob', formData.dob);
    submitData.append('gender', formData.gender);
    
    // Only append password if it's provided
    if (formData.password) {
      submitData.append('password', formData.password);
    }
    
    if (selectedImage) {
      submitData.append('photo', selectedImage);
      submitData.append("type", "profilewaiter");
    }
    
    onSubmit(submitData);
    handleClose();
  };

  const handleClose = () => {
    setErrors({});
    setSelectedImage(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('waiterImageInput');
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

  // Error message component
  const ErrorMessage = ({ error }) => {
    return error ? <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p> : null;
  };

  return (
    <CustomModal
      open={isOpen}
      hideModal={handleClose}
      performAction={handleSubmit}
      title={selectedWaiter ? t("waitermodal.title.edit") : t("waitermodal.title.add")}
      description={selectedWaiter ? t("waitermodal.description.edit") : t("waitermodal.description.add")}
    >
      <div className="p-5 max-h-96 overflow-y-auto bg-white dark:bg-gray-800">
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <CustomInput
              type="text"
              label={t("waitermodal.labels.name")}
              name="name"
              className={`${errors.name ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              value={formData.name}
              onChange={handleChange}
              placeholder={t("waitermodal.placeholders.name")}
            />
            <ErrorMessage error={errors.name} />
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <CustomInput
                type="email"
                label={t("waitermodal.labels.email")}
                name="email"
                className={`${errors.email ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                value={formData.email}
                onChange={handleChange}
                placeholder={t("waitermodal.placeholders.email")}
              />
              <ErrorMessage error={errors.email} />
            </div>
            
            <div>
              <CustomInput
                type="tel"
                label={t("waitermodal.labels.phone")}
                name="phone"
                className={`${errors.phone ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                value={formData.phone}
                onChange={handleChange}
                placeholder={t("waitermodal.placeholders.phone")}
              />
              <ErrorMessage error={errors.phone} />
            </div>
          </div>

          {/* Address Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <CustomInput
                type="text"
                label={t("waitermodal.labels.addressEn")}
                name="address.en"
                className={`${errors.addressEn ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                value={formData.address.en}
                onChange={handleChange}
                placeholder={t("waitermodal.placeholders.addressEn")}
              />
              <ErrorMessage error={errors.addressEn} />
            </div>
            
            <div>
              <CustomInput
                type="text"
                label={t("waitermodal.labels.addressEs")}
                name="address.es"
                className={`${errors.addressEs ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                value={formData.address.es}
                onChange={handleChange}
                placeholder={t("waitermodal.placeholders.addressEs")}
              />
              <ErrorMessage error={errors.addressEs} />
            </div>
          </div>

          {/* City Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <CustomInput
                type="text"
                label={t("waitermodal.labels.cityEn")}
                name="city.en"
                className={`${errors.cityEn ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                value={formData.city.en}
                onChange={handleChange}
                placeholder={t("waitermodal.placeholders.cityEn")}
              />
              <ErrorMessage error={errors.cityEn} />
            </div>
            
            <div>
              <CustomInput
                type="text"
                label={t("waitermodal.labels.cityEs")}
                name="city.es"
                className={`${errors.cityEs ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                value={formData.city.es}
                onChange={handleChange}
                placeholder={t("waitermodal.placeholders.cityEs")}
              />
              <ErrorMessage error={errors.cityEs} />
            </div>
          </div>

          {/* Date of Birth and Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <CustomInput
                type="date"
                label={t("waitermodal.labels.dob")}
                name="dob"
                className={`${errors.dob ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                value={formData.dob}
                onChange={handleChange}
              />
              <ErrorMessage error={errors.dob} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("waitermodal.labels.gender")}
              </label>
              <Select onValueChange={handleGenderChange} value={formData.gender}>
                <SelectTrigger className={`w-full ${errors.gender ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}>
                  <SelectValue placeholder={t("waitermodal.placeholders.gender")} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectItem value="male" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">{t("waitermodal.genderOptions.male")}</SelectItem>
                  <SelectItem value="female" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">{t("waitermodal.genderOptions.female")}</SelectItem>
                  <SelectItem value="other" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">{t("waitermodal.genderOptions.other")}</SelectItem>
                </SelectContent>
              </Select>
              <ErrorMessage error={errors.gender} />
            </div>
          </div>

          {/* Password */}
          <div>
            <CustomInput
              type="password"
              label={selectedWaiter ? t("waitermodal.labels.passwordEdit") : t("waitermodal.labels.password")}
              name="password"
              className={`${errors.password ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              value={formData.password}
              onChange={handleChange}
              placeholder={selectedWaiter ? t("waitermodal.placeholders.passwordOptional") : t("waitermodal.placeholders.password")}
            />
            <ErrorMessage error={errors.password} />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("waitermodal.labels.profilePhoto")}
            </label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors bg-gray-50 dark:bg-gray-700">
                <Upload className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
                <div className="mt-2">
                  <label
                    htmlFor="waiterImageInput"
                    className="cursor-pointer inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
                  >
                    {t("waitermodal.imageUpload.choosePhoto")}
                  </label>
                  <input
                    id="waiterImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t("waitermodal.imageUpload.fileTypes")}
                </p>
              </div>
            ) : (
              <div className="relative">
                 <img
                  src={getImageUrl(imagePreview)}
                   alt={t("waitermodal.imageUpload.preview")}
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
                   htmlFor="waiterImageInput"
                   className="absolute bottom-2 left-2 cursor-pointer inline-flex items-center px-2 py-1 text-xs bg-black bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70 text-white rounded hover:bg-opacity-70 dark:hover:bg-opacity-80 transition-all"
                 >
                     {t("waitermodal.imageUpload.changePhoto")}
                 </label>
                 <input
                  id="waiterImageInput"
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

export default WaiterModal;