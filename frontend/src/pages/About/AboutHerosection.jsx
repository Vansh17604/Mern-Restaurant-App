import React, { useState, useEffect } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const AboutHero = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [imageLoaded, setImageLoaded] = useState(false);
    const { t, i18n } = useTranslation();
  
  // Handle image loading
  useEffect(() => {
    const img = new Image();
    img.src = "/assets/20250513_1039_Restaurant Website Imagery_simple_compose_01jv40phzyevfrph7gctmzp10w.png";
    img.onload = () => setImageLoaded(true);
  }, []);
  
  return (
    <div className={`relative min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Background Image with proper styling */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/assets/20250513_1039_Restaurant Website Imagery_simple_compose_01jv40phzyevfrph7gctmzp10w.png"
          alt="Gustoso Restaurant Background"
          className={`w-full h-full object-cover  `}
        />
       
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
        <img 
                src="/assets/output-onlinegiftools.gif" 
                alt="Restaurant Logo" 
                className="mx-auto h-58 w-auto"
              />
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-playwrite font-bold text-white mb-6">
          {t('aboutherosection.title')}
        </h1>
        
        <div className="text-xl md:text-2xl lg:text-2xl text-white font-light">
          {t('aboutherosection.description')}{' '}
          <span className={`font-roboto ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`}>
            <Typewriter
              words={t('aboutherosection.words', { returnObjects: true })}
              loop={true}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={2000}
            />
          </span>
        </div>
        
      </div>
    </div>
  );
};

export default AboutHero;