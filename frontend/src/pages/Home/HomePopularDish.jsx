import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ChevronLeft, ChevronRight, Award, Clock, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';


const HomePopularDish = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { t, i18n } = useTranslation();
  
  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto-rotate slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 6000); // Rotate every 6 seconds
    
    return () => clearInterval(interval);
  }, [activeSlide]);

  // Popular dishes data
// Static values (non-translatable)
const staticPopularDishes = [
  {
    id: 1,
    price: "14.99",
    image: "/assets/EG8_EP74_Spaghetti-w-Anchovies-Tomatoes-and-white-wine-sauce.jpg",
    rating: 4.8
  },
  {
    id: 2,
    price: "16.99",
    image: "/assets/Pizza-3007395.jpg",
    rating: 4.9
  },
  {
    id: 3,
    price: "18.99",
    image: "/assets/Resioto.jpeg",
    rating: 5.0
  },
  {
    id: 4,
    price: "7.99",
    image: "/assets/download (15).jpeg",
    rating: 4.7
  }
];

// Get translated values
const translatedDishes = t("homepopulardish.popularDishes", { returnObjects: true });

// Merge translations with static values
const popularDishes = staticPopularDishes.map((dish, index) => ({
  ...dish,
  ...translatedDishes[index]
}));

  // Navigation functions
  const goToNextSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveSlide((prev) => (prev + 1) % popularDishes.length);
      setIsAnimating(false);
    }, 300);
  };

  const goToPrevSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveSlide((prev) => (prev - 1 + popularDishes.length) % popularDishes.length);
      setIsAnimating(false);
    }, 300);
  };

  // Function to render stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const decimal = rating - fullStars;
    const stars = [];
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star 
          key={`full-${i}`} 
          size={16} 
          className={`${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'} fill-current`} 
        />
      );
    }
    
    // Add partial star if needed
    if (decimal > 0) {
      stars.push(
        <div key="partial" className="relative inline-block">
          <Star 
            size={16} 
            className={`${isDarkMode ? 'text-gray-600' : 'text-gray-300'} fill-current`} 
          />
          <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${decimal * 100}%` }}>
            <Star 
              size={16} 
              className={`${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'} fill-current`} 
            />
          </div>
        </div>
      );
    }
    
    // Add empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star 
          key={`empty-${i}`} 
          size={16} 
          className={`${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} 
        />
      );
    }
    
    return stars;
  };

  return (
    <div className={`py-16 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Section Heading */}
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center justify-center mb-8">
           
            <h2 className={`text-4xl md:text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t("homepopulardish.popular")} <span className={`${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}> {t("homepopulardish.dish")}</span>
            </h2>
          </div>
          
          <p className={`text-xl max-w-3xl mx-auto text-center mb-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
             {t("homepopulardish.dis")}
          </p>
        </div>
        
        {/* Main Slideshow Container */}
        <div className={`max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ${
          isVisible ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-8'
        } ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
          
          {/* Feature Tag Banner */}
          <div className={`py-3 px-6 text-center font-semibold ${isDarkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-800'}`}>
            <div className="flex items-center justify-center">
              <Clock size={18} className="mr-2" />
              <span> {t("homepopulardish.label")}</span>
            </div>
          </div>
          
          {/* Slideshow */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center z-10">
              <button 
                onClick={goToPrevSlide} 
                className={`flex items-center justify-center w-10 h-10 rounded-full ml-4 shadow-md ${
                  isDarkMode 
                    ? 'bg-gray-800/70 text-amber-400 hover:bg-gray-700/80' 
                    : 'bg-white/70 text-amber-600 hover:bg-white/90'
                }`}
                aria-label={t("homepopulardish.buttonlable")}
              >
                <ChevronLeft size={24} />
              </button>
            </div>
            
            <div className="absolute inset-y-0 right-0 flex items-center z-10">
              <button 
                onClick={goToNextSlide} 
                className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 shadow-md ${
                  isDarkMode 
                    ? 'bg-gray-800/70 text-amber-400 hover:bg-gray-700/80' 
                    : 'bg-white/70 text-amber-600 hover:bg-white/90'
                }`}
                aria-label={t("homepopulardish.buttonlable2")}
              >
                <ChevronRight size={24} />
              </button>
            </div>
            
            {/* Slides */}
            <div className="relative overflow-hidden h-96 md:h-[500px]">
              {popularDishes.map((dish, index) => (
                <div 
                  key={dish.id}
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    activeSlide === index 
                      ? isAnimating 
                        ? 'opacity-0 transform scale-105' 
                        : 'opacity-100 transform scale-100' 
                      : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="relative h-full w-full">
                    {/* Image */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={dish.image} 
                        alt={dish.name} 
                        className="w-full h-full object-cover"
                      />
                      {/* Image overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    </div>
                    
                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
                      {/* Tag badge */}
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                        isDarkMode 
                          ? 'bg-amber-500/30 text-amber-200' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {dish.tag}
                      </span>
                      
                      {/* Title and price */}
                      <div className="flex flex-wrap justify-between items-end gap-4 mb-3">
                        <h3 className="text-3xl md:text-4xl font-bold text-white">
                          {dish.name}
                        </h3>
                        <div className="text-xl md:text-2xl font-semibold text-amber-300">
                          ${dish.price}
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-gray-200 text-lg mb-4 max-w-2xl">
                        {dish.description}
                      </p>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {renderStars(dish.rating)}
                        </div>
                        <span className="text-gray-300 text-sm">
                          {dish.rating.toFixed(1)}
                        </span>
                      </div>
                      
                      {/* Order button */}
                      <button className={`mt-6 px-6 py-2 rounded-lg font-medium transition-colors ${
                        isDarkMode 
                          ? 'bg-amber-500 text-white hover:bg-amber-600' 
                          : 'bg-amber-600 text-white hover:bg-amber-700'
                      }`}>
                        {t("homepopulardish.order")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Slide indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
              {popularDishes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAnimating(true);
                    setTimeout(() => {
                      setActiveSlide(index);
                      setIsAnimating(false);
                    }, 300);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeSlide === index
                      ? isDarkMode 
                        ? 'bg-amber-500 w-6' 
                        : 'bg-amber-600 w-6'
                      : isDarkMode
                        ? 'bg-gray-600' 
                        : 'bg-white/60'
                  }`}
                  aria-label={`Go to dish ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Dish thumbnails navigation */}
          <div className={`p-6 ${isDarkMode ? 'bg-gray-900/30' : 'bg-gray-50'}`}>
            <div className="flex overflow-x-auto pb-2 gap-4 scrollbar-hide">
              {popularDishes.map((dish, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    setIsAnimating(true);
                    setTimeout(() => {
                      setActiveSlide(index);
                      setIsAnimating(false);
                    }, 300);
                  }}
                  className={`cursor-pointer transition-all flex-shrink-0 w-40 md:w-48 rounded-lg overflow-hidden ${
                    activeSlide === index 
                    ? isDarkMode 
                      ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-gray-900' 
                      : 'ring-2 ring-amber-500 ring-offset-2 ring-offset-gray-50'
                    : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="relative h-24 md:h-28">
                    <img 
                      src={dish.image} 
                      alt={dish.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white text-sm font-medium truncate">
                        {dish.name}
                      </p>
                      <p className="text-amber-300 text-xs font-medium">
                        ${dish.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Call to action section */}
          <div className={`px-8 py-6 text-center border-t ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'}`}>
            <div className="max-w-3xl mx-auto">
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t("homepopulardish.visit")}
              </p>
              <button className={`mt-4 px-6 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-amber-500 text-white hover:bg-amber-600' 
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}>
               {t("homepopulardish.buttonV")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePopularDish;