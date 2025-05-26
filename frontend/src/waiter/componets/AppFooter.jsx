import { useState, useEffect } from 'react';
import { 
  Heart,
  Settings,
  HelpCircle,
  Megaphone,
  Info,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";

const AppFooter = ({ darkMode }) => {
  const [currentYear, setCurrentYear] = useState('');
  const [appVersion, setAppVersion] = useState('1.2.5');
  const [lastUpdated, setLastUpdated] = useState('');
  
  // Update year and last updated date
  useEffect(() => {
    const now = new Date();
    setCurrentYear(now.getFullYear().toString());
    
    // Simulating a last updated timestamp
    const lastUpdateDate = new Date(now);
    lastUpdateDate.setDate(now.getDate() - 3); // 3 days ago
    setLastUpdated(lastUpdateDate.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }));
  }, []);

  return (
    <footer className={`border-t transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200 text-teal-800'}`}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 px-4">
          {/* Footer Left - Copyright and Version */}
          <div className="flex flex-col items-center md:items-start text-sm mb-3 md:mb-0">
            <div className="flex items-center gap-1">
              <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-teal-600'}`}>WaiterHub © {currentYear}</span>
              <Separator orientation="vertical" className={`h-3 mx-1 ${darkMode ? 'bg-slate-700' : 'bg-teal-200'}`} />
              <span className={`text-xs ${darkMode ? 'text-teal-400' : 'text-teal-700'}`}>v{appVersion}</span>
            </div>
            <div className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-teal-500'}`}>
              Last updated: {lastUpdated}
            </div>
          </div>
          
          {/* Footer Middle - Quick Actions */}
          <div className="flex items-center gap-2 mb-3 md:mb-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={darkMode ? "outline" : "ghost"} 
                    size="sm"
                    className={`h-8 w-8 p-0 ${darkMode ? 'border-slate-700 hover:bg-slate-700' : 'hover:bg-teal-100'}`}
                  >
                    <Settings size={16} className={darkMode ? 'text-slate-300' : 'text-teal-700'} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className={darkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-white border-teal-200'}>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={darkMode ? "outline" : "ghost"} 
                    size="sm"
                    className={`h-8 w-8 p-0 ${darkMode ? 'border-slate-700 hover:bg-slate-700' : 'hover:bg-teal-100'}`}
                  >
                    <HelpCircle size={16} className={darkMode ? 'text-slate-300' : 'text-teal-700'} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className={darkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-white border-teal-200'}>
                  <p>Help Center</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button 
                        variant={darkMode ? "outline" : "ghost"} 
                        size="sm"
                        className={`h-8 w-8 p-0 ${darkMode ? 'border-slate-700 hover:bg-slate-700' : 'hover:bg-teal-100'}`}
                      >
                        <Megaphone size={16} className={darkMode ? 'text-slate-300' : 'text-teal-700'} />
                      </Button>
                    </SheetTrigger>
                    <SheetContent className={darkMode ? 'bg-slate-900 text-white border-slate-700' : 'bg-white border-teal-200'}>
                      <SheetHeader>
                        <SheetTitle className={darkMode ? 'text-white' : 'text-teal-900'}>Announcements</SheetTitle>
                        <SheetDescription className={darkMode ? 'text-slate-400' : 'text-teal-600'}>
                          Stay updated with the latest news
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-4 space-y-4">
                        <div className={`p-3 rounded-md ${darkMode ? 'bg-slate-800' : 'bg-teal-50'}`}>
                          <h3 className={`text-sm font-medium ${darkMode ? 'text-teal-400' : 'text-teal-700'}`}>
                            New Menu Items Added
                          </h3>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-300' : 'text-teal-800'}`}>
                            Check out our seasonal specials added to the menu section.
                          </p>
                          <p className={`text-xs mt-2 ${darkMode ? 'text-slate-500' : 'text-teal-500'}`}>
                            May 15, 2025
                          </p>
                        </div>
                        <div className={`p-3 rounded-md ${darkMode ? 'bg-slate-800' : 'bg-teal-50'}`}>
                          <h3 className={`text-sm font-medium ${darkMode ? 'text-teal-400' : 'text-teal-700'}`}>
                            System Update Coming Soon
                          </h3>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-300' : 'text-teal-800'}`}>
                            We'll be releasing version 1.3.0 with new features next week.
                          </p>
                          <p className={`text-xs mt-2 ${darkMode ? 'text-slate-500' : 'text-teal-500'}`}>
                            May 14, 2025
                          </p>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </TooltipTrigger>
                <TooltipContent className={darkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-white border-teal-200'}>
                  <p>Announcements</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button 
                        variant={darkMode ? "outline" : "ghost"} 
                        size="sm"
                        className={`h-8 w-8 p-0 ${darkMode ? 'border-slate-700 hover:bg-slate-700' : 'hover:bg-teal-100'}`}
                      >
                        <MessageSquare size={16} className={darkMode ? 'text-slate-300' : 'text-teal-700'} />
                      </Button>
                    </SheetTrigger>
                    <SheetContent className={darkMode ? 'bg-slate-900 text-white border-slate-700' : 'bg-white border-teal-200'}>
                      <SheetHeader>
                        <SheetTitle className={darkMode ? 'text-white' : 'text-teal-900'}>Staff Chat</SheetTitle>
                        <SheetDescription className={darkMode ? 'text-slate-400' : 'text-teal-600'}>
                          Connect with other staff members
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-4">
                        <div className={`p-3 rounded-md ${darkMode ? 'bg-slate-800' : 'bg-teal-50'}`}>
                          <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-teal-800'}`}>
                            Chat functionality coming in the next update!
                          </p>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </TooltipTrigger>
                <TooltipContent className={darkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-white border-teal-200'}>
                  <p>Staff Chat</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Footer Right - Links */}
          <div className="flex items-center gap-3">
            <a 
              href="#" 
              className={`text-xs flex items-center gap-1 ${darkMode ? 'text-slate-400 hover:text-teal-400' : 'text-teal-600 hover:text-teal-800'}`}
            >
              <Info size={14} />
              <span>About</span>
            </a>
            <a 
              href="#" 
              className={`text-xs flex items-center gap-1 ${darkMode ? 'text-slate-400 hover:text-teal-400' : 'text-teal-600 hover:text-teal-800'}`}
            >
              <ExternalLink size={14} />
              <span>Support</span>
            </a>
            <a 
              href="#" 
              className={`text-xs flex items-center gap-1 ${darkMode ? 'text-slate-400 hover:text-teal-400' : 'text-teal-600 hover:text-teal-800'}`}
            >
              <Heart size={14} />
              <span>Feedback</span>
            </a>
          </div>
        </div>
        
        {/* Optional restaurant-specific content - only shown on larger screens */}
        <div className="hidden md:flex items-center justify-center py-2 px-4">
          <p className={`text-xs text-center ${darkMode ? 'text-slate-500' : 'text-teal-500'}`}>
            WaiterHub helps restaurant staff manage tables and orders efficiently. 
            Need help? Contact your system administrator or visit our support page.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;