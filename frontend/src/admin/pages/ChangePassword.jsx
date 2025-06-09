import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'; // Add this import
import { Eye, EyeOff, Lock, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { changePassword, resetAdminState } from '../../features/admin/admin/adminSlice';


const Alert = ({ children, variant = "default", className = "" }) => {
  const baseStyles = "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground";
  const variants = {
    default: "bg-background text-foreground dark:bg-gray-800 dark:text-gray-100",
    destructive: "border-red-500/50 text-red-600 dark:border-red-500 [&>svg]:text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
    success: "border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400"
  };
  
  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const AlertDescription = ({ children, className = "" }) => (
  <div className={`text-sm [&_p]:leading-relaxed ${className}`}>
    {children}
  </div>
);

// Shadcn/ui Input Component
const Input = React.forwardRef(({ className = "", type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:ring-offset-gray-800 dark:focus-visible:ring-gray-500 ${className}`}
      ref={ref}
      {...props}
    />
  );
});

// Shadcn/ui Label Component
const Label = React.forwardRef(({ className = "", ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-200 ${className}`}
    {...props}
  />
));

// Shadcn/ui Button Component
const Button = React.forwardRef(({ className = "", variant = "default", size = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-800 dark:focus-visible:ring-gray-500";
  const variants = {
    default: "bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
    ghost: "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
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

// Password strength indicator
const PasswordStrengthIndicator = ({ password }) => {
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
    
    if (score < 2) return { score, label: t('adminchangepassword.strength.weak'), color: 'bg-red-500' };
    if (score < 4) return { score, label: t('adminchangepassword.strength.medium'), color: 'bg-yellow-500' };
    return { score, label: t('adminchangepassword.strength.strong'), color: 'bg-green-500' };
  };
  
  const strength = getStrength(password);
  
  if (!password) return null;
  
  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-600 dark:text-gray-400">{t('adminchangepassword.strength.label')}</span>
        <span className={`text-xs font-medium ${
          strength.label === t('adminchangepassword.strength.strong') ? 'text-green-600 dark:text-green-400' : 
          strength.label === t('adminchangepassword.strength.medium') ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {strength.label}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>
    </div>
  );
};

const ChangePassword = () => {
  const { t } = useTranslation();
  
  // Redux hooks - connect to your admin slice
  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.admin);
  
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
        return !value ? t('adminchangepassword.validation.currentPasswordRequired') : '';
      case 'newPassword':
        if (!value) return t('adminchangepassword.validation.newPasswordRequired');
        if (value.length < 8) return t('adminchangepassword.validation.newPasswordLength');
        if (value === formData.currentPassword) return t('adminchangepassword.validation.newPasswordDifferent');
        return '';
      case 'confirmPassword':
        if (!value) return t('adminchangepassword.validation.confirmPasswordRequired');
        if (value !== formData.newPassword) return t('adminchangepassword.validation.passwordsNotMatch');
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
      dispatch(changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
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
        dispatch(resetAdminState());
      }, 3000);
    }
  }, [isSuccess, dispatch]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetAdminState());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center mr-3">
              <Shield className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
            <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">{t('adminchangepassword.title')}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{t('adminchangepassword.subtitle')}</p>
        </div>

        {/* Success Alert */}
        {isSuccess && (
          <Alert variant="success" className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              {t('adminchangepassword.messages.success')}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {isError && message && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Current Password Field */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{t('adminchangepassword.form.currentPassword.label')}</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.currentPassword ? "border-red-500 dark:border-red-500" : ""}
                    placeholder={t('adminchangepassword.form.currentPassword.placeholder')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.currentPassword}</p>
                )}
              </div>

              {/* New Password Field */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t('adminchangepassword.form.newPassword.label')}</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.newPassword ? "border-red-500 dark:border-red-500" : ""}
                    placeholder={t('adminchangepassword.form.newPassword.placeholder')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>
                )}
                <PasswordStrengthIndicator password={formData.newPassword} />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('adminchangepassword.form.confirmPassword.label')}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.confirmPassword ? "border-red-500 dark:border-red-500" : ""}
                    placeholder={t('adminchangepassword.form.confirmPassword.placeholder')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Security Guidelines */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                <div className="flex items-start">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      {t('adminchangepassword.requirements.title')}
                    </h3>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• {t('adminchangepassword.requirements.minLength')}</li>
                      <li>• {t('adminchangepassword.requirements.uppercase')}</li>
                      <li>• {t('adminchangepassword.requirements.number')}</li>
                      <li>• {t('adminchangepassword.requirements.special')}</li>
                      <li>• {t('adminchangepassword.requirements.different')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || Object.keys(errors).some(key => errors[key])}
                  className="min-w-[140px]"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white dark:border-gray-900 mr-2"></div>
                      {t('adminchangepassword.buttons.submitting')}
                    </div>
                  ) : (
                    t('adminchangepassword.buttons.submit')
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;