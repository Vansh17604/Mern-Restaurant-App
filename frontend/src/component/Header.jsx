import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import Flag from 'react-world-flags'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    document.documentElement.lang = lng;
    setLanguageMenuOpen(false);
  };
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLanguageMenu = () => setLanguageMenuOpen(!languageMenuOpen);

  // Navigation items with translations
  const navItems = [
    { key: 'home', label: t('header.home') },
    { key: 'about', label: t('header.about') },
    { key: 'menu', label: t('header.menu') },
    { key: 'gallery', label: t('header.gallery') },
    { key: 'contact', label: t('header.contact') }
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg'
        : 'bg-white dark:bg-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/assets/output-onlinegiftools.gif"
              alt="Restaurant Logo"
              className="h-28 w-auto"
            />
          </div>
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-2xl font-bold text-black dark:text-white mr-2">{t('header.title')}</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={item.key}>
                  <a
                   href={`/${item.key}`}
                    className="text-base font-medium relative px-1 py-2 text-gray-800 dark:text-gray-200 transition-colors duration-200 hover:text-primary-600 dark:hover:text-primary-400 group"
                  >
                    {item.label}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Actions Section */}
          <div className="flex items-center space-x-3 relative">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={toggleLanguageMenu}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300"
                aria-label="Change language"
              >
                <Globe className="h-5 w-5" />
              </button>
              {languageMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md z-50">
                  <ul className="py-1">
                    <li>
                      <button
                        onClick={() => changeLanguage('en')}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                      <Flag code="US" className="w-5 h-3" /> English
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => changeLanguage('es')}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Flag code="ES" className="w-5 h-3" /> Spanish
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Login Button */}
            <a
              href="/login"
              className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full dark:border-white bg-gradient-to-r from-primary-500 to-secondary-500 dark:text-white text-black hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200"
            >
              {t('header.login')}
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="py-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.key}>
                  <a
                   href={`/${item.key}`}
                    className="block px-4 py-2 text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/login"
                  className="block px-4 py-2 text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.login')}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;