import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Lock, Shield, CheckCircle, AlertCircle, User } from 'lucide-react';
import { changeWaiterPassword, resetWaiterState } from '../../features/admin/waiter/waiterSlice';

const Alert = ({ children, variant = "default", className = "" }) => {
  const baseStyles = "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground";
  const variants = {
    default: "bg-white text-teal-900 border-teal-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
    destructive: "border-red-500/50 text-red-600 bg-red-50 [&>svg]:text-red-600 dark:border-red-500/50 dark:text-red-400 dark:bg-red-950/50 dark:[&>svg]:text-red-400",
    success: "border-green-500/50 text-green-600 bg-green-50 [&>svg]:text-green-600 dark:border-green-500/50 dark:text-green-400 dark:bg-green-950/50 dark:[&>svg]:text-green-400"
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

// Shadcn/ui Input Component with dark mode
const Input = React.forwardRef(({ className = "", type, ...props }, ref) => {
  const baseStyles = "flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const styles = "bg-white border-teal-200 text-teal-900 placeholder:text-teal-500 focus-visible:ring-teal-400 focus-visible:border-teal-400 ring-offset-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:placeholder:text-slate-400 dark:focus-visible:ring-teal-500 dark:focus-visible:border-teal-500 dark:ring-offset-slate-900";
  
  return (
    <input
      type={type}
      className={`${baseStyles} ${styles} ${className}`}
      ref={ref}
      {...props}
    />
  );
});

// Shadcn/ui Label Component with dark mode
const Label = React.forwardRef(({ className = "", ...props }, ref) => {
  const styles = "text-teal-900 peer-disabled:text-teal-400 dark:text-slate-200 dark:peer-disabled:text-slate-500";
    
  return (
    <label
      ref={ref}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${styles} ${className}`}
      {...props}
    />
  );
});

// Shadcn/ui Button Component with dark mode
const Button = React.forwardRef(({ className = "", variant = "default", size = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-teal-600 text-white hover:bg-teal-700 focus-visible:ring-teal-400 ring-offset-white dark:bg-teal-600 dark:text-white dark:hover:bg-teal-700 dark:focus-visible:ring-teal-500 dark:ring-offset-slate-900",
    outline: "border border-teal-300 bg-white hover:bg-teal-50 hover:text-teal-900 focus-visible:ring-teal-400 ring-offset-white dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:text-slate-200 dark:focus-visible:ring-teal-500 dark:ring-offset-slate-900",
    ghost: "hover:bg-teal-100 hover:text-teal-900 focus-visible:ring-teal-400 ring-offset-white dark:hover:bg-slate-800 dark:hover:text-slate-200 dark:focus-visible:ring-teal-500 dark:ring-offset-slate-900"
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
    
    if (score < 2) return { score, label: t('waiterchangepassword.passwordStrength.weak'), color: 'bg-red-500' };
    if (score < 4) return { score, label: t('waiterchangepassword.passwordStrength.medium'), color: 'bg-yellow-500' };
    return { score, label: t('waiterchangepassword.passwordStrength.strong'), color: 'bg-green-500' };
  };
  
  const strength = getStrength(password);
  
  if (!password) return null;
  
  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-teal-600 dark:text-slate-400">
          {t('waiterchangepassword.passwordStrength.label')}
        </span>
        <span className={`text-xs font-medium ${
          strength.label === t('waiterchangepassword.passwordStrength.strong') ? 'text-green-500' : 
          strength.label === t('waiterchangepassword.passwordStrength.medium') ? 'text-yellow-500' : 'text-red-500'
        }`}>
          {strength.label}
        </span>
      </div>
      <div className="w-full rounded-full h-2 bg-teal-100 dark:bg-slate-700">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>
    </div>
  );
};

const WaiterChangePassword = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const waiterId = user?.id;
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.waiter);
  
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
        return !value ? t('waiterchangepassword.validation.currentPasswordRequired') : '';
      case 'newPassword':
        if (!value) return t('waiterchangepassword.validation.newPasswordRequired');
        if (value.length < 8) return t('waiterchangepassword.validation.newPasswordMinLength');
        if (value === formData.currentPassword) return t('waiterchangepassword.validation.newPasswordDifferent');
        return '';
      case 'confirmPassword':
        if (!value) return t('waiterchangepassword.validation.confirmPasswordRequired');
        if (value !== formData.newPassword) return t('waiterchangepassword.validation.passwordsDoNotMatch');
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
      dispatch(changeWaiterPassword({
        id: waiterId,
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
        dispatch(resetWaiterState());
      }, 3000);
    }
  }, [isSuccess, dispatch]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetWaiterState());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 bg-gradient-to-br from-teal-50 to-cyan-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-md flex items-center justify-center mr-3 bg-teal-100 dark:bg-teal-600">
              <User className="h-5 w-5 text-teal-600 dark:text-white" />
            </div>
            <h1 className="text-2xl font-medium text-teal-900 dark:text-white">
              {t('waiterchangepassword.title')}
            </h1>
          </div>
          <p className="text-teal-600 dark:text-slate-400">
            {t('waiterchangepassword.subtitle')}
          </p>
        </div>

        {/* Success Alert */}
        {isSuccess && (
          <Alert variant="success" className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              {t('waiterchangepassword.messages.success')}
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
        <div className="rounded-lg p-8 border backdrop-blur-sm bg-white/80 border-teal-200 shadow-lg dark:bg-slate-800/80 dark:border-slate-700 dark:shadow-xl">
          <div>
            <div className="space-y-6">
              {/* Current Password Field */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">
                  {t('waiterchangepassword.labels.currentPassword')}
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.currentPassword ? "border-red-500" : ""}
                    placeholder={t('waiterchangepassword.placeholders.currentPassword')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4 text-teal-400 dark:text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-teal-400 dark:text-slate-400" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-500">{errors.currentPassword}</p>
                )}
              </div>

              {/* New Password Field */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">
                  {t('waiterchangepassword.labels.newPassword')}
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.newPassword ? "border-red-500" : ""}
                    placeholder={t('waiterchangepassword.placeholders.newPassword')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4 text-teal-400 dark:text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-teal-400 dark:text-slate-400" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-500">{errors.newPassword}</p>
                )}
                <PasswordStrengthIndicator password={formData.newPassword} />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {t('waiterchangepassword.labels.confirmPassword')}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                    placeholder={t('waiterchangepassword.placeholders.confirmPassword')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4 text-teal-400 dark:text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-teal-400 dark:text-slate-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Security Guidelines */}
              <div className="rounded-md p-4 bg-teal-50 dark:bg-slate-700/50">
                <div className="flex items-start">
                  <Lock className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0 text-teal-400 dark:text-slate-400" />
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-teal-900 dark:text-slate-200">
                      {t('waiterchangepassword.requirements.title')}
                    </h3>
                    <ul className="text-sm space-y-1 text-teal-600 dark:text-slate-400">
                      <li>• {t('waiterchangepassword.requirements.minLength')}</li>
                      <li>• {t('waiterchangepassword.requirements.uppercase')}</li>
                      <li>• {t('waiterchangepassword.requirements.number')}</li>
                      <li>• {t('waiterchangepassword.requirements.special')}</li>
                      <li>• {t('waiterchangepassword.requirements.different')}</li>
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
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('waiterchangepassword.buttons.updating')}
                    </div>
                  ) : (
                    t('waiterchangepassword.buttons.updatePassword')
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

export default WaiterChangePassword;