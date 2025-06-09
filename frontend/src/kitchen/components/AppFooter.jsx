import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getKitchenFooterStats } from '../../features/admin/count/countSlice'; // Adjust the import path as needed
import { 
  Heart,
  ChefHat,
  ExternalLink,
  Clock,
  Utensils,
  Phone,
  Mail,
  MessageSquare,
  ArrowUp,
} from 'lucide-react';

const AppFooter = () => {
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());
  

  const { kitchenfooter, isLoading } = useSelector((state) => state.count);
  
  // Get dark mode status from document
  useEffect(() => {
    const checkDarkMode = () => {
      if (document) {
        setDarkMode(document.body.classList.contains('dark'));
      }
    };
    
    // Initial check
    checkDarkMode();
    
    // Create a mutation observer to watch for changes to the body's class list
    const observer = new MutationObserver(checkDarkMode);
    
    if (document) {
      observer.observe(document.body, { 
        attributes: true, 
        attributeFilter: ['class'] 
      });
    }
    
    // Handle scroll for scroll-to-top button
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Fetch kitchen footer stats on component mount
  useEffect(() => {
    dispatch(getKitchenFooterStats());
  }, [dispatch]);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const kitchenStats = kitchenfooter && Array.isArray(kitchenfooter) ? kitchenfooter : [
    { label: "Active Orders", value: "0" },
    { label: "Completed Today", value: "0" },
    { label: "Staff On Duty", value: "0" }
  ];
  
  // Support contacts
  const supportContacts = [
    { icon: <Phone size={14} />, text: "+1 (555) 123-4567" },
    { icon: <Mail size={14} />, text: "support@kitchenhub.com" },
    { icon: <MessageSquare size={14} />, text: "Live Chat" }
  ];

  return (
    <footer className={`border-t transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-amber-200 text-amber-900'}`}>
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Kitchen info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className={`p-2 rounded-full ${darkMode ? 'bg-amber-600' : 'bg-amber-400'}`}>
                <ChefHat size={20} className={darkMode ? 'text-white' : 'text-amber-900'} />
              </div>
              <div className="font-bold text-lg">KitchenHub</div>
            </div>
            <p className={`text-sm mb-4 ${darkMode ? 'text-slate-300' : 'text-amber-800'}`}>
              Your all-in-one solution for efficient kitchen management and order processing.
            </p>
            <div className="mt-auto">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                darkMode ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'
              }`}>
                Version 2.5.0
              </span>
            </div>
          </div>
          
          {/* Kitchen stats */}
          <div className="flex flex-col">
            <h3 className={`font-bold text-base mb-4 ${darkMode ? 'text-white' : 'text-amber-900'}`}>
              Kitchen Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {kitchenStats.map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-amber-600'}`}>
                    {stat.label}
                  </span>
                  <span className={`text-lg font-semibold ${darkMode ? 'text-amber-400' : 'text-amber-900'} ${isLoading ? 'animate-pulse' : ''}`}>
                    {isLoading ? '...' : stat.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center">
              <Clock size={14} className={darkMode ? 'text-slate-400' : 'text-amber-600'} />
              <span className={`text-xs ml-1 ${darkMode ? 'text-slate-400' : 'text-amber-600'}`}>
                {isLoading ? 'Loading...' : 'Last updated 5 minutes ago'}
              </span>
            </div>
          </div>
          
          {/* Support */}
          <div className="flex flex-col">
            <h3 className={`font-bold text-base mb-4 ${darkMode ? 'text-white' : 'text-amber-900'}`}>
              Support
            </h3>
            <ul className="space-y-3">
              {supportContacts.map((contact, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className={`p-1 rounded ${darkMode ? 'bg-slate-800' : 'bg-amber-100'}`}>
                    {contact.icon}
                  </div>
                  <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-amber-800'}`}>{contact.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-amber-600'}`}>
                Support Hours: 7AM - 10PM
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer bottom */}
      <div className={`border-t py-4 px-4 ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-amber-100 bg-amber-50'}`}>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-amber-700'}`}>
            © {currentYear} KitchenHub. All rights reserved.
          </div>
        </div>
      </div>
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-colors ${
            darkMode 
              ? 'bg-slate-800 border border-slate-700 hover:bg-slate-700 text-amber-400' 
              : 'bg-amber-100 border border-amber-200 hover:bg-amber-200 text-amber-800'
          }`}
          onClick={scrollToTop}
        >
          <ArrowUp size={18} />
        </button>
      )}
    </footer>
  );
};

export default AppFooter;