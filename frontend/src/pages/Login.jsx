import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react';
import { login, reset } from '../features/auth/authSlice';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get current language and translations
  const { t, i18n } = useTranslation();
  
  const { user, role, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );


  useEffect(() => {
    if (isSuccess && user && role) {
      switch(role) {
        case 'Admin':
          navigate('/admin', { replace: true });
          break;
        case 'Kitchen':
          navigate('/kitchen', { replace: true });
          break;
        case 'Waiter':
          navigate('/waiter', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    }

    // Reset the auth state on unmount
    return () => {
      dispatch(reset());
    };
  }, [user, isSuccess, navigate, dispatch, role]);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Reset form when switching modes
    setFormData({
      email: '',
      password: '',
      fullName: ''
    });
    dispatch(reset());
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userData = {
      email: formData.email,
      password: formData.password
    };

    try {
      await dispatch(login(userData)).unwrap();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <img 
          src="/assets/20250513_0902_Appetizing Cuisine Showcase_simple_compose_01jv3v3w8yepx9spcse22czrzv.png"
          alt="Restaurant Background" 
          className="w-full h-full object-cover "
        />
      </div>
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
        <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900"></div>
      </div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Card with subtle shadow */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-8 pt-8 pb-12">
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4 shadow-md">
                <img 
                  src="/assets/restaurant.png"
                  alt="Restaurant Logo" 
                  className="h-16 w-auto"
                />
              </div>
              <h2 className="mt-2 text-center text-3xl font-bold text-gray-800 dark:text-gray-100">
                {isLogin ? t('login.welcome') : t('login.join')}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? t('login.signin') : t('login.crete')}
              </p>
            </div>

            {/* Status message */}
            {isError && message && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {message}
              </div>
            )}

            {/* Form Section */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('login.fullname')}
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder={t('login.placholdername')}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white" 
                      required 
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('login.email')}
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('login.placholderemail')} 
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('login.password')}
                  </label>
                  {isLogin && (
                    <a href="/forgot-password" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                      {t('login.forget')}
                    </a>
                  )}
                </div>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('login.placholderpassword')} 
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white" 
                    required 
                  />
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="text-gray-600 dark:text-gray-400">
                      {t('login.iagree')} <a href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">{t('login.terms')}</a> {t('login.and')} <a href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">{t('login.privacy')}</a>
                    </label>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('login.processing')}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      {isLogin ? t('login.signinbtn') : t('create')}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
              
              </div>
            </div>

            {/* Toggle Login/Register Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} {t('login.right')}
        </div>
      </div>
    </div>
  );
};

export default Login;