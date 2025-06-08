import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAdminProfile, fetchAdminDetails, resetAdminState } from '../../features/admin/admin/adminSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Add this import

const Profile = () => {
  const dispatch = useDispatch();
  const { admin, isLoading, isError, isSuccess, message } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);
  const adminId = user?.id;
  const navigate = useNavigate();
  const { t } = useTranslation(); // Add translation hook

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (adminId) {
      dispatch(fetchAdminDetails(adminId));
    }
  }, [dispatch, adminId]);

  useEffect(() => {
    // Populate form with admin data when fetched
    if (admin) {
      setFormData({
        name: admin.name || '',
        email: admin.email || ''
      });
    }
  }, [admin]);

  useEffect(() => {
    // Reset state on component unmount
    return () => {
      dispatch(resetAdminState());
    };
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only send changed fields
    const updatedFields = {};
    if (formData.name !== admin?.name && formData.name.trim()) {
      updatedFields.name = formData.name.trim();
    }
    if (formData.email !== admin?.email && formData.email.trim()) {
      updatedFields.email = formData.email.trim();
    }

    if (Object.keys(updatedFields).length === 0) {
      toast.info(t('adminProfile.messages.noChanges'));
      setIsEditing(false);
      return;
    }

    try {
      await dispatch(updateAdminProfile({id: adminId, profileData: updatedFields})).unwrap();
      setIsEditing(false);
    } catch (error) {
      // Error handling is done in the slice
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (admin) {
      setFormData({
        name: admin.name || '',
        email: admin.email || ''
      });
    }
    setIsEditing(false);
  };

  if (isLoading && !admin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">{t('adminProfile.title')}</h1>
          <p className="text-gray-600 mt-1">{t('adminProfile.subtitle')}</p>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-2xl font-medium text-gray-600">
                    {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {admin?.name || t('adminProfile.defaults.adminUser')}
                </h3>
                <p className="text-gray-500">{admin?.email}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('adminProfile.form.fullName.label')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                  placeholder={t('adminProfile.form.fullName.placeholder')}
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('adminProfile.form.email.label')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                  placeholder={t('adminProfile.form.email.placeholder')}
                />
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">{t('adminProfile.accountInfo.title')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">{t('adminProfile.accountInfo.adminId')}</span>
                  <span className="ml-2 text-gray-900">{admin?._id || t('adminProfile.defaults.notAvailable')}</span>
                </div>
                <div>
                  <span className="text-gray-500">{t('adminProfile.accountInfo.accountStatus')}</span>
                  <span className="ml-2 text-green-600 font-medium">{t('adminProfile.accountInfo.statusActive')}</span>
                </div>
                <div>
                  <span className="text-gray-500">{t('adminProfile.accountInfo.created')}</span>
                  <span className="ml-2 text-gray-900">
                    {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString() : t('adminProfile.defaults.notAvailable')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">{t('adminProfile.accountInfo.lastUpdated')}</span>
                  <span className="ml-2 text-gray-900">
                    {admin?.updatedAt ? new Date(admin.updatedAt).toLocaleDateString() : t('adminProfile.defaults.notAvailable')}
                  </span>
                </div>
              </div>
            </div>

            <button 
              className='px-4 py-2 bg-black text-white rounded-md focus:outline-none focus:ring-2'  
              onClick={() => navigate("/aadmin/changepassword")}
            >
              {t('adminProfile.buttons.changePassword')}
            </button>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  {t('adminProfile.buttons.editProfile')}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    {t('adminProfile.buttons.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t('adminProfile.buttons.updating')}
                      </>
                    ) : (
                      t('adminProfile.buttons.saveChanges')
                    )}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;