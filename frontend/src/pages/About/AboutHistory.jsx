import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BookOpen, Clock, Award, Users, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';


const AboutHistory = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { t, i18n } = useTranslation();
  
  
  useEffect(() => {
    const img = new Image();
    img.src = "/assets/20250513_0902_Appetizing Cuisine Showcase_simple_compose_01jv3v3w91emqrpxsbazgb4wt8.png";
    img.onload = () => setImageLoaded(true);
  }, []);
  
  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Automatic rotation timer
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setActiveSection(prev => (prev < storySegments.length - 1 ? prev + 1 : 0));
    }, 5000); // Rotate every 5 seconds
    
    return () => clearInterval(rotationInterval); // Cleanup on unmount
  }, []);

  // Story segments for timeline

  const icons = [<Clock size={24} />, <Users size={24} />, <Award size={24} />, <BookOpen size={24} />];

  const storySegments = t('abouthistory.storySegments', { returnObjects: true })?.map((segment, index) => ({
    ...segment,
    icon: icons[index],
  }));
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/20250513_0902_Appetizing Cuisine Showcase_simple_compose_01jv3v3w91emqrpxsbazgb4wt8.png"
            alt="Gustoso Cuisine"
            className={`w-full h-full object-cover transition-all duration-1000 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            } ${isDarkMode ? 'brightness-50' : 'brightness-90'}`}
          />
          <div className={`absolute inset-0 ${
            isDarkMode 
              ? 'bg-gradient-to-t from-black via-black/70 to-black/30' 
              : 'bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-gray-900/30'
          }`}></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 px-4">
          <div className={`transform transition-all duration-1000 text-center ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center justify-center mb-6">
              <div className={`flex items-center justify-center w-20 h-20 rounded-full ${isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'} p-3`}>
                <img 
                  src="/assets/restaurant.png" 
                  alt="Gustoso Logo" 
                  className="w-12 h-12"
                />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tighter">
              {t('abouthistory.our')} <span className={isDarkMode ? 'text-orange-400' : 'text-orange-300'}>{t("abouthistory.story")}</span>
            </h1>
            
            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-center mb-12 text-gray-200 font-light">
              {t('abouthistory.discription')}
            </p>
            
            <div className="mt-12 animate-bounce">
              <a href="#story" className="inline-block p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Story Timeline Section */}
      <div id="story" className={`py-24 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className={`mb-16 text-center ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
            <h2 className={`text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <span className={isDarkMode ? 'text-orange-400' : 'text-orange-600'}>{t("abouthistory.trade")}</span> {t("abouthistory.meet")} <span className={isDarkMode ? 'text-orange-400' : 'text-orange-600'}>{t("abouthistory.innovation")}</span>
            </h2>
            <div className="w-24 h-1 mx-auto rounded-full mb-8 bg-gradient-to-r from-orange-400 to-red-500"></div>
            <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
             {t('abouthistory.storydis')}
            </p>
          </div>
          
          {/* Modern Horizontal Timeline */}
          <div className="relative max-w-6xl mx-auto">
            {/* Timeline Line */}
            <div className={`absolute top-24 left-0 right-0 h-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
            
            {/* Timeline Content */}
            <div className="relative">
              <div className="grid grid-cols-1 gap-16">
                {storySegments.map((segment, index) => (
                  <div 
                    key={index} 
                    className={`transition-all duration-1000 transform ${
                      activeSection === index 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-8 absolute pointer-events-none'
                    }`}
                    style={{gridColumn: 1, gridRow: 1}}
                  >
                    <div className="relative">
                      {/* Year Marker */}
                     
                      {/* Content Card */}
                      <div className={`mt-32 pt-6 px-6 pb-8 rounded-3xl shadow-2xl ${
                        isDarkMode 
                          ? 'bg-gray-900 border border-gray-800' 
                          : 'bg-white border border-gray-100'
                      }`}>
                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                          {/* Icon */}
                          <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${
                            isDarkMode 
                              ? 'bg-orange-500/10 text-orange-400' 
                              : 'bg-orange-100 text-orange-600'
                          }`}>
                            {React.cloneElement(segment.icon, { size: 32 })}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1">
                            <h3 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {segment.title}
                            </h3>
                            <p className={`text-xl leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {segment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Dots Only - Removed Next Button */}
            <div className="flex justify-center mt-12">
              <div className="flex gap-2">
                {storySegments.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSection(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      activeSection === index
                        ? isDarkMode 
                          ? 'bg-orange-500 scale-125' 
                          : 'bg-orange-600 scale-125'
                        : isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`${t("abouthistory.goto")} ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
    
      <div className={`py-32 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`inline-block mb-8 text-7xl ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`}>"</div>
            <p className={`text-3xl font-light italic mb-12 leading-relaxed ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('abouthistory.readdiscription')}
            </p>
            <div className="flex items-center justify-center">
              <div className={`h-px w-12 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <div className={`h-1 w-12 mx-2 rounded-full ${isDarkMode ? 'bg-orange-500' : 'bg-orange-600'}`}></div>
              <div className={`h-px w-12 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutHistory;