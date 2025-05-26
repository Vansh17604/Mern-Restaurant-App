import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Star, Quote, Heart, ThumbsUp, ChevronLeft, ChevronRight, UserCircle, ArrowRight } from 'lucide-react';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';

const CustomerReview = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [isVisible, setIsVisible] = useState(false);
  const [activeReview, setActiveReview] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      rotateNext();
    }, 5000); 
    
    return () => clearInterval(interval);
  }, [activeReview]);

  // Customer review data
 const icons = [
    <ThumbsUp size={24} />,
    <Heart size={24} />,
    <Quote size={24} />,
    <Star size={24} />
  ];

  const customerReviews = t('customerreview.customerReviews', { returnObjects: true })?.map((review, index) => ({
    ...review,
    icon: icons[index]
  }));

  // Functions to rotate carousel
  const rotateNext = () => {
    setIsRotating(true);
    setTimeout(() => {
      setActiveReview((prev) => (prev + 1) % customerReviews.length);
      setIsRotating(false);
    }, 300);
  };

  const rotatePrev = () => {
    setIsRotating(true);
    setTimeout(() => {
      setActiveReview((prev) => (prev - 1 + customerReviews.length) % customerReviews.length);
      setIsRotating(false);
    }, 300);
  };

  // Function to render stars
  const renderStars = (count) => {
    return Array(count).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={18} 
        className={`${isDarkMode ? 'text-amber-400' : 'text-amber-500'} fill-current`} 
      />
    ));
  };
  
  return (
    <div className={`min-h-screen py-16 ${isDarkMode ? 'bg-gray-900 text-gray-100 bg-[url("/api/placeholder/1920/1080")] bg-fixed bg-cover bg-blend-overlay bg-opacity-90' : 'bg-white text-gray-800'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Section Heading */}
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex flex-col items-center justify-center mb-12 text-center">
            <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-4 ${isDarkMode ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-600'}`}>
              {t('customerreview.what')}
            </span>
            <h2 className={`text-5xl md:text-6xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
               {t('customerreview.customer')} <span className={`${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-500'}`}> {t('customerreview.review')}</span>
            </h2>
            
            <div className="w-24 h-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mb-6"></div>
            
            <p className={`text-xl max-w-3xl mx-auto text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('customerreview.dis')}
            </p>
          </div>
        </div>
        
        {/* Main Content Container */}
        <div className={`max-w-6xl mx-auto rounded-3xl overflow-hidden transition-all duration-700 ${
          isVisible ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-8'
        } ${isDarkMode ? 'bg-gray-800/70 backdrop-blur-md border border-gray-700 shadow-2xl shadow-orange-500/10' : 'bg-white/90 backdrop-blur-md shadow-2xl shadow-orange-500/20'}`}>
          
          {/* Hero Review Banner - Carousel */}
          <div className={`relative p-12 ${isDarkMode ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md' : 'bg-gradient-to-br from-orange-50 to-amber-100'}`}>
            
            
            {/* Carousel Navigation */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <button 
                onClick={rotatePrev} 
                className={`flex items-center justify-center w-12 h-12 rounded-full ml-4 transition-all transform hover:scale-110 ${
                  isDarkMode 
                    ? 'bg-gray-700/80 text-orange-400 hover:bg-orange-500 hover:text-white' 
                    : 'bg-white/80 text-orange-600 hover:bg-orange-500 hover:text-white'
                }`}
              >
                <ChevronLeft size={24} />
              </button>
            </div>
            
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button 
                onClick={rotateNext} 
                className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 transition-all transform hover:scale-110 ${
                  isDarkMode 
                    ? 'bg-gray-700/80 text-orange-400 hover:bg-orange-500 hover:text-white' 
                    : 'bg-white/80 text-orange-600 hover:bg-orange-500 hover:text-white'
                }`}
              >
                <ChevronRight size={24} />
              </button>
            </div>
            
            <div className="max-w-4xl mx-auto relative z-10 py-10">
              <div className="flex mb-6">
                {renderStars(5)}
              </div>
              
              <div className={`min-h-32 transition-all duration-500 ${isRotating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
                <p className={`text-3xl md:text-4xl italic font-light mb-8 leading-relaxed ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  "{customerReviews[activeReview].review}"
                </p>
                
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${customerReviews[activeReview].color} flex items-center justify-center text-white mr-4`}>
                    {customerReviews[activeReview].name.charAt(0)}
                  </div>
                  <div>
                    <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {customerReviews[activeReview].name}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                      {customerReviews[activeReview].position}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {customerReviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsRotating(true);
                    setTimeout(() => {
                      setActiveReview(index);
                      setIsRotating(false);
                    }, 300);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    activeReview === index
                      ? isDarkMode 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 w-8' 
                        : 'bg-gradient-to-r from-orange-500 to-red-500 w-8'
                      : isDarkMode
                        ? 'bg-gray-600 w-2' 
                        : 'bg-gray-300 w-2'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Reviews Selection - now as a horizontal carousel */}
          <div className={`p-8 ${isDarkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
            <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
              {customerReviews.map((review, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    setIsRotating(true);
                    setTimeout(() => {
                      setActiveReview(index);
                      setIsRotating(false);
                    }, 300);
                  }}
                  className={`p-6 rounded-2xl cursor-pointer transition-all flex-shrink-0 w-80 transform hover:scale-105 ${
                    activeReview === index 
                    ? isDarkMode 
                      ? `bg-gradient-to-br ${review.color} bg-opacity-10 border border-gray-700` 
                      : `bg-gradient-to-br from-orange-50 to-amber-100 border border-orange-200`
                    : isDarkMode
                      ? 'hover:bg-gray-700 bg-gray-800/70 backdrop-blur-sm border border-gray-700'
                      : 'hover:bg-orange-50 bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 ${
                      activeReview === index 
                        ? `bg-gradient-to-br ${review.color} text-white` 
                        : isDarkMode 
                          ? 'bg-gray-700 text-orange-400' 
                          : 'bg-orange-100 text-orange-600'
                    }`}>
                      {review.icon}
                    </div>
                    <div>
                      <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {review.name}
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {review.position}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex mb-3">
                    {renderStars(review.rating)}
                  </div>
                  
                  <p className={`text-sm line-clamp-3 leading-relaxed ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    "{review.review}"
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Call to action section */}
        
        </div>
        
        {/* Testimonial Stats with CountUp */}
        <div className={`max-w-5xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 delay-300`}>
          {[
            { value: 500, suffix: "+", label:  `${t('customerreview.lable1')}`, icon: <Star size={32} /> },
            { value: 98, suffix: "%", label: `${t('customerreview.lable2')}`, icon: <Heart size={32} /> },
            { value: 10, suffix: "K+", label: `${t('customerreview.lable3')}`, icon: <UserCircle size={32} /> }
          ].map((stat, index) => (
            <div 
              key={index} 
              className={`text-center p-8 rounded-2xl backdrop-blur-sm transform transition-all hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gray-800/60 border border-gray-700 shadow-xl shadow-orange-500/5' 
                  : 'bg-white/80 border border-gray-100 shadow-xl shadow-orange-500/10'
              }`}
            >
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-orange-500/20 to-rose-500/20 text-orange-400' 
                  : 'bg-gradient-to-br from-orange-100 to-rose-100 text-orange-600'
              }`}>
                {stat.icon}
              </div>
              <div className={`text-5xl font-bold mb-2 ${
                isDarkMode 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400' 
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500'
              }`}>
                {isVisible && <CountUp end={stat.value} suffix={stat.suffix} duration={2.5} />}
              </div>
              <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerReview;