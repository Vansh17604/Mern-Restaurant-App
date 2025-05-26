import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  
  const getInitialTheme = () => {
    
    if (typeof window !== 'undefined' && window.localStorage) {
  
      
      const storedPrefs = window.localStorage.getItem('theme');
      if (storedPrefs) {
     
        return storedPrefs;
      }
      
     
      const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
      if (userMedia.matches) {
    
        return 'dark';
      }
    } else {
    
    }
    
    console.log('Defaulting to light theme');
    return 'light';
  };
  
  const [theme, setTheme] = useState(() => {
  
    return getInitialTheme();
  });
  

  
  useEffect(() => {
    
    
    try {
      const root = window.document.documentElement;
   
      
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      
      
      
      localStorage.setItem('theme', theme);
  
    } catch (error) {
      console.error('Error in theme effect:', error);
    }
  }, [theme]);
  
  const toggleTheme = () => {

    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
   
      return newTheme;
    });
  };
  
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {

  
  const context = useContext(ThemeContext);
  
  if (!context) {
    
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  
  return context;
};