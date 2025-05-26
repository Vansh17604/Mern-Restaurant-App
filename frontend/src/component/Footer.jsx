import React from 'react';
import { Instagram, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t, i18n } = useTranslation();
  // Get translations from the t function
  const title = t('footer.title');
  const description = t('footer.description');
  const home = t('footer.home');
  const about = t('footer.about');
  const menu = t('footer.menu');
  const contact = t('footer.contact');
  const gallery = t('footer.gallery');
  const reservations = t('footer.reservations');
  const contactus = t('footer.contactus');
  const address = t('footer.address');
  const location = t('footer.location');
  const hours = t('footer.hours');
  const opening = t('footer.opening');
  const phone = t('footer.phone');
  const email = t('footer.email');
  const connect = t('footer.connect');
  const subscribe = t('footer.subscribe');
  const placeholder = t('footer.placeholder');
  const join = t('footer.join');
  const coppyright = t('footer.coppyright');

  const quickLinks = [
    { name: home, path: '/home' },
    { name: about, path: '/about' },
    { name: menu, path: '/menu' },
    { name: gallery, path: '/gallery' },
    { name: contact, path: '/contact' },
    { name: reservations, path: '/reservations' },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
          {/* Language Selector */}
          <div></div> <div className="flex items-center mb-4">
              <img 
                src="/assets/output-onlinegiftools.gif" 
                alt="Restaurant Logo" 
                className="h-32 w-auto mr-2"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-black dark:text-white">
                  {title}
                </span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {home}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.path} 
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 flex items-center"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary-500 mr-2"></span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {contactus}
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-800 dark:text-gray-200 font-medium">{address}:</p>
                <address className="text-gray-600 dark:text-gray-400 not-italic">
                  {location}
                </address>
              </div>
              <div>
                <p className="text-gray-800 dark:text-gray-200 font-medium">{hours}:</p>
                <p className="text-gray-600 dark:text-gray-400">{opening}</p>
                <p className="text-gray-600 dark:text-gray-400">8:00 AM - 8:00 PM</p>
                <p className="text-gray-600 dark:text-gray-400">Open Everyday</p>
              </div>
              <div>
                <p className="text-gray-800 dark:text-gray-200 font-medium">{phone}:</p>
                <p className="text-gray-600 dark:text-gray-400">+91 9876543210</p>
              </div>
              <div>
                <p className="text-gray-800 dark:text-gray-200 font-medium">{email}:</p>
                <a href="mailto:info@gustoso.com" className="text-primary-600 dark:text-primary-400 hover:underline">
                  info@gustoso.com
                </a>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {connect}
            </h3>
            <div className="flex space-x-4 mb-6">
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary-500 hover:text-white transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary-500 hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary-500 hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary-500 hover:text-white transition-all duration-300"
                aria-label="Twitter/X"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                {subscribe}
              </h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder={placeholder} 
                  className="flex-1 px-3 py-2 text-sm rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-medium rounded-r-md hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200">
                  {join}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} {coppyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;