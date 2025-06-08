import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { CustomInput, CustomModal } from "../componets/Customes";
import { useTranslation } from "react-i18next";

const KitchenModal = ({
  isOpen,
  onClose,
  onSubmit,
  selectedKitchen,
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
    if (isOpen && selectedKitchen) {
      setFormData({
        name: selectedKitchen.name || "",
        email: selectedKitchen.email || "",
        phone: selectedKitchen.phone || "",
        address: {
          en: selectedKitchen.address?.en || "",
          es: selectedKitchen.address?.es || ""
        },
        city: {
          en: selectedKitchen.city?.en || "",
          es: selectedKitchen.city?.es || ""
        },
        dob: selectedKitchen.dob ? selectedKitchen.dob.split('T')[0] : "",
        gender: selectedKitchen.gender || "",
        password: "" 
      });

      if (selectedKitchen.photo) {
        setImagePreview(selectedKitchen.photo);
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
  }, [isOpen, selectedKitchen]);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name) {
      newErrors.name = t("kitchenmodal.validation.nameRequired");
    }
    
    if (!formData.email) {
      newErrors.email = t("kitchenmodal.validation.emailRequired");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = t("kitchenmodal.validation.emailInvalid");
      }
    }
    
    if (!formData.phone) {
      newErrors.phone = t("kitchenmodal.validation.phoneRequired");
    } else if (formData.phone.length < 10) {
      newErrors.phone = t("kitchenmodal.validation.phoneMinLength");
    }
    
    if (!formData.address.en) {
      newErrors.addressEn = t("kitchenmodal.validation.addressEnRequired");
    }
    
    if (!formData.address.es) {
      newErrors.addressEs = t("kitchenmodal.validation.addressEsRequired");
    }
    
    if (!formData.city.en) {
      newErrors.cityEn = t("kitchenmodal.validation.cityEnRequired");
    }
    
    if (!formData.city.es) {
      newErrors.cityEs = t("kitchenmodal.validation.cityEsRequired");
    }
    
    // Date of birth validation
    if (!formData.dob) {
      newErrors.dob = t("kitchenmodal.validation.dobRequired");
    }
    
    // Gender validation
    if (!formData.gender) {
      newErrors.gender = t("kitchenmodal.validation.genderRequired");
    }
    
    // Password validation (only for new kitchen staff)
    if (!selectedKitchen && !formData.password) {
      newErrors.password = t("kitchenmodal.validation.passwordRequired");
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
        setErrors(prev => ({ ...prev, image: t("kitchenmodal.validation.imageInvalidType") }));
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: t("kitchenmodal.validation.imageSize") }));
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
    const fileInput = document.getElementById('kitchenImageInput');
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
      submitData.append("type", "profilekitchen");
    }
    
    onSubmit(submitData);
    handleClose();
  };

  const handleClose = () => {
    setErrors({});
    setSelectedImage(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('kitchenImageInput');
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
    return error ? <p className="text-red-500 text-xs mt-1">{error}</p> : null;
  };

  return (
    <CustomModal
      open={isOpen}
      hideModal={handleClose}
      performAction={handleSubmit}
      title={selectedKitchen ? t("kitchenmodal.title.edit") : t("kitchenmodal.title.add")}
      description={selectedKitchen ? t("kitchenmodal.description.edit") : t("kitchenmodal.description.add")}
    >
      <div className="p-5 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <CustomInput
              type="text"
              label={t("kitchenmodal.labels.name")}
              name="name"
              className={errors.name ? "border-red-500" : ""}
              value={formData.name}
              onChange={handleChange}
              placeholder={t("kitchenmodal.placeholders.name")}
            />
            <ErrorMessage error={errors.name} />
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <CustomInput
                type="email"
                label={t("kitchenmodal.labels.email")}
                name="email"
                className={errors.email ? "border-red-500" : ""}
                value={formData.email}
                onChange={handleChange}
                placeholder={t("kitchenmodal.placeholders.email")}
              />
              <ErrorMessage error={errors.email} />
            </div>
            
            <div>
              <CustomInput
                type="tel"
                label={t("kitchenmodal.labels.phone")}
                name="phone"
                className={errors.phone ? "border-red-500" : ""}
                value={formData.phone}
                onChange={handleChange}
                placeholder={t("kitchenmodal.placeholders.phone")}
              />
              <ErrorMessage error={errors.phone} />
            </div>
          </div>

          {/* Address Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <CustomInput
                type="text"
                label={t("kitchenmodal.labels.addressEn")}
                name="address.en"
                className={errors.addressEn ? "border-red-500" : ""}
                value={formData.address.en}
                onChange={handleChange}
                placeholder={t("kitchenmodal.placeholders.addressEn")}
              />
              <ErrorMessage error={errors.addressEn} />
            </div>
            
            <div>
              <CustomInput
                type="text"
                label={t("kitchenmodal.labels.addressEs")}
                name="address.es"
                className={errors.addressEs ? "border-red-500" : ""}
                value={formData.address.es}
                onChange={handleChange}
                placeholder={t("kitchenmodal.placeholders.addressEs")}
              />
              <ErrorMessage error={errors.addressEs} />
            </div>
          </div>

          {/* City Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <CustomInput
                type="text"
                label={t("kitchenmodal.labels.cityEn")}
                name="city.en"
                className={errors.cityEn ? "border-red-500" : ""}
                value={formData.city.en}
                onChange={handleChange}
                placeholder={t("kitchenmodal.placeholders.cityEn")}
              />
              <ErrorMessage error={errors.cityEn} />
            </div>
            
            <div>
              <CustomInput
                type="text"
                label={t("kitchenmodal.labels.cityEs")}
                name="city.es"
                className={errors.cityEs ? "border-red-500" : ""}
                value={formData.city.es}
                onChange={handleChange}
                placeholder={t("kitchenmodal.placeholders.cityEs")}
              />
              <ErrorMessage error={errors.cityEs} />
            </div>
          </div>

          {/* Date of Birth and Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <CustomInput
                type="date"
                label={t("kitchenmodal.labels.dob")}
                name="dob"
                className={errors.dob ? "border-red-500" : ""}
                value={formData.dob}
                onChange={handleChange}
              />
              <ErrorMessage error={errors.dob} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("kitchenmodal.labels.gender")}
              </label>
              <Select onValueChange={handleGenderChange} value={formData.gender}>
                <SelectTrigger className={`w-full ${errors.gender ? "border-red-500" : ""}`}>
                  <SelectValue placeholder={t("kitchenmodal.placeholders.gender")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t("kitchenmodal.genderOptions.male")}</SelectItem>
                  <SelectItem value="female">{t("kitchenmodal.genderOptions.female")}</SelectItem>
                  <SelectItem value="other">{t("kitchenmodal.genderOptions.other")}</SelectItem>
                </SelectContent>
              </Select>
              <ErrorMessage error={errors.gender} />
            </div>
          </div>

          {/* Password */}
          <div>
            <CustomInput
              type="password"
              label={selectedKitchen ? t("kitchenmodal.labels.passwordEdit") : t("kitchenmodal.labels.password")}
              name="password"
              className={errors.password ? "border-red-500" : ""}
              value={formData.password}
              onChange={handleChange}
              placeholder={selectedKitchen ? t("kitchenmodal.placeholders.passwordOptional") : t("kitchenmodal.placeholders.password")}
            />
            <ErrorMessage error={errors.password} />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("kitchenmodal.labels.profilePhoto")}
            </label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <div className="mt-2">
                  <label
                    htmlFor="kitchenImageInput"
                    className="cursor-pointer inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    {t("kitchenmodal.imageUpload.choosePhoto")}
                  </label>
                  <input
                    id="kitchenImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("kitchenmodal.imageUpload.fileTypes")}
                </p>
              </div>
            ) : (
              <div className="relative">
                 <img
                  src={getImageUrl(imagePreview)}
                   alt={t("kitchenmodal.imageUpload.preview")}
                   className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                 <button
                   type="button"
                   onClick={removeImage}
                   className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                 >
                   <X size={16} />
                 </button>
                 <label
                   htmlFor="kitchenImageInput"
                   className="absolute bottom-2 left-2 cursor-pointer inline-flex items-center px-2 py-1 text-xs bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-all"
                 >
                     {t("kitchenmodal.imageUpload.changePhoto")}
                 </label>
                 <input
                  id="kitchenImageInput"
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

export default KitchenModal;