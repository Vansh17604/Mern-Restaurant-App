import React, { useState, useEffect } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { useTheme } from '../../context/ThemeContext';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';

const HomeHero = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [imageLoaded, setImageLoaded] = useState(false);
  const { t, i18n } = useTranslation();
  
  // Handle image loading
  useEffect(() => {
    const img = new Image();
    img.src = "/assets/20250513_1039_Restaurant Website Imagery_simple_compose_01jv40phzyevfrph7gctmzp10w.png"
    img.onload = () => setImageLoaded(true);
  }, []);
  
  return (
    <div className={`relative min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Background Image with proper styling */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
           src="/assets/20250513_1039_Restaurant Website Imagery_simple_compose_01jv40phzyevfrph7gctmzp10w.png"
          alt="Gustoso Restaurant Interior"
          className="w-full h-full object-cover"
        />
       
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
        <img
          src="/assets/output-onlinegiftools.gif" 
          alt="Gustoso Logo"
          className="mx-auto h-52 w-auto mb-6"
        />
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-playwrite font-bold text-white mb-8">
          Gustoso
        </h1>
        
        <div className="text-xl md:text-3xl lg:text-4xl text-white font-light mb-10">
          <span className="mr-2">{t('homehero.title')}</span>
          <span className={`font-roboto ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`}>
            <Typewriter
               words={t('homehero.words', { returnObjects: true })}
              loop={true}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={2000}
            />
          </span>
        </div>
        
      
        
        <div className="mt-16 flex justify-center space-x-8">
          <div className="text-center text-white">
            <p className="text-4xl font-bold">  <CountUp end={12} duration={2} /></p>
            <p className="text-sm uppercase tracking-wider">{t("homehero.lable1")}</p>
          </div>
          <div className="text-center text-white">
            <p className="text-4xl font-bold"> <CountUp end={4.9} duration={2} decimals={1} /></p>
            <p className="text-sm uppercase tracking-wider">{t("homehero.lable2")}</p>
          </div>
          <div className="text-center text-white">
            <p className="text-4xl font-bold"> <CountUp end={150} duration={2} suffix="+" /></p>
            <p className="text-sm uppercase tracking-wider">{t("homehero.lable3")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;