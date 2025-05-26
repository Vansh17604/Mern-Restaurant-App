import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ContactForm from '../../Forms/ContactForm';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Background elements */}
      <div className="absolute inset-0  pointer-events-none overflow-hidden">
        <img 
          src="/assets/20250513_1152_Restaurant Contact Page_simple_compose_01jv44wevke5jbrja0c4449t9t.png" 
          alt="Restaurant Contact Background" 
          className="w-full h-full object-cover"
        />
        <div className="h-full w-full bg-gradient-to-br from-orange-100 to-gray-100 dark:from-gray-800 dark:to-gray-900"></div>
      </div>
      
      <div className="max-w-6xl w-full relative z-10">
        {/* Header with improved visibility */}
        <div className="text-center mb-12 bg-white dark:bg-gray-800 py-6 rounded-lg shadow-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white">
            {t('contact.contact')} <span className="text-orange-600 dark:text-orange-400">{t('contact.us')}</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('contact.dis')}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Contact Form */}
          <div className="flex-1">
            <ContactForm isDarkMode={isDarkMode} />
          </div>
          
          {/* Right Column - Contact Info */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Map Card with Google Maps iframe */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="h-full w-full">
                <div className="aspect-w-16 aspect-h-9 w-full">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.9255993324705!2d73.10696791157136!3d21.115532180474542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0676ae66d70cd%3A0xe06868c8b2a64039!2sUnistar%20Softech%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1747353071636!5m2!1sen!2sin" 
                    className="w-full h-64 sm:h-80 md:h-96 lg:h-64"
                    style={{border: 0}} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps"
                  ></iframe>
                </div>
                <div className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <MapPin className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t('contact.location')}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('contact.oneadd')}<br />
                    {t('contact.twoadd')}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-4">
                    <Phone className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t('contact.phone')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    (555) 123-4567
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('contact.dis1')}
                  </p>
                </div>
              </div>
              
              {/* Email */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t('contact.email')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    info@gustoso.com
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('contact.dis2')}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Hours Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t('contact.hours')}</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-600 dark:text-gray-400">{t('contact.dis3')}</div>
                <div className="text-gray-800 dark:text-gray-200 font-medium">11:00 AM - 10:00 PM</div>
                
                <div className="text-gray-600 dark:text-gray-400">{t('contact.dis4')}</div>
                <div className="text-gray-800 dark:text-gray-200 font-medium">11:00 AM - 11:00 PM</div>
                
                <div className="text-gray-600 dark:text-gray-400">{t('contact.dis5')}</div>
                <div className="text-gray-800 dark:text-gray-200 font-medium">12:00 PM - 9:00 PM</div>
              </div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <p>{t('contact.dis6')}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}

      </div>
    </div>
  );
};

export default Contact;