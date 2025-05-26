import React from 'react';
import AboutHero from './AboutHerosection';
import AboutHistory from './AboutHistory';
import CustomerReview from './CustomerReview';
import { useTheme } from '../../context/ThemeContext';

const About = () => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="h-full w-full bg-gradient-to-br from-orange-100 to-gray-100 dark:from-gray-800 dark:to-gray-900 opacity-70"></div>
            </div>
            
            <div className="relative z-10">
                <AboutHero />
                <AboutHistory />
                <CustomerReview  />
            </div>
        </div>
    );
};

export default About;