import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Lock, Shield, CheckCircle, AlertCircle, ChefHat } from 'lucide-react';
import { changeKitchenPassword, resetKitchenState } from '../../features/admin/kitchen/kitchenSlice';

// Shadcn/ui Alert Component with dark mode
const Alert = ({ children, variant = "default", className = "", darkMode = false }) => {
  const baseStyles = "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground";
  const variants = {
    default: darkMode 
      ? "bg-slate-800 text-slate-200 border-slate-700" 
      : "bg-white text-amber-900 border-amber-200",
    destructive: darkMode 
      ? "border-red-500/50 text-red-400 bg-red-950/50 [&>svg]:text-red-400" 
      : "border-red-500/50 text-red-600 bg-red-50 [&>svg]:text-red-600",
    success: darkMode 
      ? "border-green-500/50 text-green-400 bg-green-950/50 [&>svg]:text-green-400" 
      : "border-green-500/50 text-green-600 bg-green-50 [&>svg]:text-green-600"
  };
  
  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const AlertDescription = ({ children, className = "", darkMode = false }) => (
  <div className={`text-sm [&_p]:leading-relaxed ${className}`}>
    {children}
  </div>
);

// Shadcn/ui Input Component with dark mode
const Input = React.forwardRef(({ className = "", type, darkMode = false, ...props }, ref) => {
  const baseStyles = "flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const modeStyles = darkMode
    ? "bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-400 focus-visible:ring-amber-500 focus-visible:border-amber-500 ring-offset-slate-900"
    : "bg-white border-amber-200 text-amber-900 placeholder:text-amber-500 focus-visible:ring-amber-400 focus-visible:border-amber-400 ring-offset-white";
  
  return (
    <input
      type={type}
      className={`${baseStyles} ${modeStyles} ${className}`}
      ref={ref}
      {...props}
    />
  );
});

// Shadcn/ui Label Component with dark mode
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

// Shadcn/ui Button Component with dark mode
const Button = React.forwardRef(({ className = "", variant = "default", size = "default", darkMode = false, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: darkMode 
      ? "bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-500 ring-offset-slate-900" 
      : "bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-400 ring-offset-white",
    outline: darkMode 
      ? "border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-slate-200 focus-visible:ring-amber-500 ring-offset-slate-900" 
      : "border border-amber-300 bg-white hover:bg-amber-50 hover:text-amber-900 focus-visible:ring-amber-400 ring-offset-white",
    ghost: darkMode 
      ? "hover:bg-slate-800 hover:text-slate-200 focus-visible:ring-amber-500 ring-offset-slate-900" 
      : "hover:bg-amber-100 hover:text-amber-900 focus-visible:ring-amber-400 ring-offset-white"
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

// Password strength indicator with dark mode
const PasswordStrengthIndicator = ({ password, darkMode = false }) => {
  const { t } = useTranslation();
  
  const getStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    if (score < 2) return { 
      score, 
      label: t('kitchenchangepassword.passwordStrength.weak'), 
      color: 'bg-red-500' 
    };
    if (score < 4) return { 
      score, 
      label: t('kitchenchangepassword.passwordStrength.medium'), 
      color: 'bg-yellow-500' 
    };
    return { 
      score, 
      label: t('kitchenchangepassword.passwordStrength.strong'), 
      color: 'bg-green-500' 
    };
  };
  
  const strength = getStrength(password);
  
  if (!password) return null;
  
  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-amber-600'}`}>
          {t('kitchenchangepassword.passwordStrength.label')}
        </span>
        <span className={`text-xs font-medium ${
          strength.label === t('kitchenchangepassword.passwordStrength.strong') ? 'text-green-500' : 
          strength.label === t('kitchenchangepassword.passwordStrength.medium') ? 'text-yellow-500' : 'text-red-500'
        }`}>
          {strength.label}
        </span>
      </div>
      <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-slate-700' : 'bg-amber-100'}`}>
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>
    </div>
  );
};

const KitchenChangePassword = ({ darkMode = false }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const kitchenId = user?.id;
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.kitchen);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'currentPassword':
        return !value ? t('kitchenchangepassword.validation.currentPasswordRequired') : '';
      case 'newPassword':
        if (!value) return t('kitchenchangepassword.validation.newPasswordRequired');
        if (value.length < 8) return t('kitchenchangepassword.validation.newPasswordMinLength');
        if (value === formData.currentPassword) return t('kitchenchangepassword.validation.newPasswordDifferent');
        return '';
      case 'confirmPassword':
        if (!value) return t('kitchenchangepassword.validation.confirmPasswordRequired');
        if (value !== formData.newPassword) return t('kitchenchangepassword.validation.passwordsDoNotMatch');
        return '';
      default:
        return '';
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate on change if field has been touched
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }

    // Special case: re-validate confirm password when new password changes
    if (name === 'newPassword' && touched.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: validateField('confirmPassword', formData.confirmPassword)
      }));
    }
  };

  // Handle blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true
    });

    if (validateForm()) {
      // Dispatch the Redux action to call the API
      dispatch(changeKitchenPassword({
        id: kitchenId,
        passwordData: {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }
      }));
    }
  };

  // Reset form on success
  useEffect(() => {
    if (isSuccess) {
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTouched({});
      setErrors({});
      
      // Reset state after showing success message
      setTimeout(() => {
        dispatch(resetKitchenState());
      }, 3000);
    }
  }, [isSuccess, dispatch]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetKitchenState());
    };
  }, [dispatch]);

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
        : 'bg-gradient-to-br from-amber-50 to-orange-50'
    }`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className={`h-8 w-8 rounded-md flex items-center justify-center mr-3 ${
              darkMode ? 'bg-amber-600' : 'bg-amber-100'
            }`}>
              <ChefHat className={`h-5 w-5 ${darkMode ? 'text-white' : 'text-amber-600'}`} />
            </div>
            <h1 className={`text-2xl font-medium ${
              darkMode ? 'text-white' : 'text-amber-900'
            }`}>
              {t('kitchenchangepassword.title')}
            </h1>
          </div>
          <p className={darkMode ? 'text-slate-400' : 'text-amber-600'}>
            {t('kitchenchangepassword.subtitle')}
          </p>
        </div>

        {/* Success Alert */}
        {isSuccess && (
          <Alert variant="success" className="mb-6" darkMode={darkMode}>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription darkMode={darkMode}>
              {t('kitchenchangepassword.alerts.success')}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {isError && message && (
          <Alert variant="destructive" className="mb-6" darkMode={darkMode}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription darkMode={darkMode}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Form Container */}
        <div className={`rounded-lg p-8 border backdrop-blur-sm ${
          darkMode 
            ? 'bg-slate-800/80 border-slate-700 shadow-xl' 
            : 'bg-white/80 border-amber-200 shadow-lg'
        }`}>
          <div>
            <div className="space-y-6">
              {/* Current Password Field */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword" darkMode={darkMode}>
                  {t('kitchenchangepassword.fields.currentPassword.label')}
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    darkMode={darkMode}
                    className={errors.currentPassword ? (darkMode ? "border-red-500" : "border-red-500") : ""}
                    placeholder={t('kitchenchangepassword.fields.currentPassword.placeholder')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? (
                      <EyeOff className={`h-4 w-4 ${darkMode ? 'text-slate-400' : 'text-amber-400'}`} />
                    ) : (
                      <Eye className={`h-4 w-4 ${darkMode ? 'text-slate-400' : 'text-amber-400'}`} />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-500">{errors.currentPassword}</p>
                )}
              </div>

              {/* New Password Field */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" darkMode={darkMode}>
                  {t('kitchenchangepassword.fields.newPassword.label')}
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    darkMode={darkMode}
                    className={errors.newPassword ? (darkMode ? "border-red-500" : "border-red-500") : ""}
                    placeholder={t('kitchenchangepassword.fields.newPassword.placeholder')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? (
                      <EyeOff className={`h-4 w-4 ${darkMode ? 'text-slate-400' : 'text-amber-400'}`} />
                    ) : (
                      <Eye className={`h-4 w-4 ${darkMode ? 'text-slate-400' : 'text-amber-400'}`} />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-500">{errors.newPassword}</p>
                )}
                <PasswordStrengthIndicator password={formData.newPassword} darkMode={darkMode} />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" darkMode={darkMode}>
                  {t('kitchenchangepassword.fields.confirmPassword.label')}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    darkMode={darkMode}
                    className={errors.confirmPassword ? (darkMode ? "border-red-500" : "border-red-500") : ""}
                    placeholder={t('kitchenchangepassword.fields.confirmPassword.placeholder')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className={`h-4 w-4 ${darkMode ? 'text-slate-400' : 'text-amber-400'}`} />
                    ) : (
                      <Eye className={`h-4 w-4 ${darkMode ? 'text-slate-400' : 'text-amber-400'}`} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Security Guidelines */}
              <div className={`rounded-md p-4 ${
                darkMode ? 'bg-slate-700/50' : 'bg-amber-50'
              }`}>
                <div className="flex items-start">
                  <Lock className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${
                    darkMode ? 'text-slate-400' : 'text-amber-400'
                  }`} />
                  <div>
                    <h3 className={`text-sm font-medium mb-2 ${
                      darkMode ? 'text-slate-200' : 'text-amber-900'
                    }`}>
                      {t('kitchenchangepassword.securityGuidelines.title')}
                    </h3>
                    <ul className={`text-sm space-y-1 ${
                      darkMode ? 'text-slate-400' : 'text-amber-600'
                    }`}>
                      <li>• {t('kitchenchangepassword.securityGuidelines.requirements.minLength')}</li>
                      <li>• {t('kitchenchangepassword.securityGuidelines.requirements.upperLower')}</li>
                      <li>• {t('kitchenchangepassword.securityGuidelines.requirements.number')}</li>
                      <li>• {t('kitchenchangepassword.securityGuidelines.requirements.special')}</li>
                      <li>• {t('kitchenchangepassword.securityGuidelines.requirements.different')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || Object.keys(errors).some(key => errors[key])}
                  className="min-w-[140px]"
                  darkMode={darkMode}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('kitchenchangepassword.buttons.updating')}
                    </div>
                  ) : (
                    t('kitchenchangepassword.buttons.updatePassword')
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenChangePassword;