import { useState,useEffect } from 'react';
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";

// Lucide icons
import {
  ChefHat,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Utensils,
  Book,
  Users,
  Calendar,
  ShoppingCart,
  Bell,
  Clock,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';

// Shadcn components
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../components/ui/collapsible";
import { fetchKitchenHeader } from '../../features/admin/kitchen/kitchenSlice';
import { useDispatch, useSelector } from "react-redux";

// Import navigation configuration - will define later
import _kitchen_nav from "../../Kitchen_nav";

const AppSlidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
  const [activePath, setActivePath] = useState("/kitchen/dashboard");
    const [showScrollTop, setShowScrollTop] = useState(false);
  const [openGroups, setOpenGroups] = useState({});
    const { user } = useSelector((state) => state.auth);
  const { kitchenHeader } = useSelector((state) => state.kitchen);
  const kitchenId = user?.id;
  const base_url = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();

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
    
 const chef = {
    name: kitchenHeader?.name || "bhavesh",
    role: "Kitchen",
    avatar: kitchenHeader?.photo
  };

  // Toggle nav group open/closed state
  const toggleGroup = (groupName) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // Handle navigation
  const handleNavigation = (path) => {
    setActivePath(path);
    navigate(path);
  };

  // Render navigation item based on type
  const renderNavItem = (item, index) => {
    // Title type
    if (item.type === "title") {
      return (
        <div key={index} className={cn(
          "px-3 py-2 text-xs font-semibold uppercase tracking-wider",
          darkMode ? "text-amber-400" : "text-amber-800",
          collapsed && "text-center"
        )}>
          {!collapsed && item.title}
        </div>
      );
    }
    
    // Group type
    else if (item.type === "group") {
      return (
        <Collapsible 
          key={index}
          open={openGroups[item.title]} 
          onOpenChange={() => toggleGroup(item.title)}
          className="w-full"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CollapsibleTrigger asChild>
                  <Button
                    variant={darkMode ? "outline" : "ghost"}
                    className={cn(
                      "w-full justify-between mb-1",
                      darkMode ? "border-slate-700 hover:bg-slate-700 text-white" : "hover:bg-amber-100 text-amber-900",
                      collapsed && "justify-center p-2"
                    )}
                  >
                    <span className={cn(
                      "flex items-center gap-3",
                      collapsed && "justify-center"
                    )}>
                      <span className={darkMode ? "text-amber-400" : "text-amber-600"}>{item.icon}</span>
                      {!collapsed && <span>{item.title}</span>}
                    </span>
                    {!collapsed && (
                      openGroups[item.title] ? 
                        <ChevronUp size={16} className={darkMode ? "text-slate-400" : "text-amber-500"} /> : 
                        <ChevronDown size={16} className={darkMode ? "text-slate-400" : "text-amber-500"} />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className={darkMode ? "bg-slate-800 text-white border-slate-700" : "bg-white border-amber-200"}>
                  <div className="flex items-center gap-2">
                    <span>{item.title}</span>
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          
          {!collapsed && (
            <CollapsibleContent className="pl-8 space-y-1">
              {item.items.map((subItem, subIndex) => (
                <Button
                  key={subIndex}
                  variant={activePath === subItem.path ? "secondary" : darkMode ? "outline" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    darkMode ? 
                      (activePath === subItem.path ? "bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 border-slate-700" : "border-slate-700 hover:bg-slate-700 text-white") :
                      (activePath === subItem.path ? "bg-amber-100 text-amber-900 hover:bg-amber-200" : "hover:bg-amber-50 text-amber-900")
                  )}
                  onClick={() => handleNavigation(subItem.path)}
                >
                  <span className="flex-1 text-left">{subItem.title}</span>
                  {subItem.badge && subItem.badge.text && (
                    <Badge variant={subItem.badge.variant === "info" ? "default" : subItem.badge.variant} 
                      className={cn(
                        "ml-auto shrink-0",
                        darkMode ? "bg-amber-600 text-white" : "bg-amber-500 text-white"
                      )}>
                      {subItem.badge.text}
                    </Badge>
                  )}
                </Button>
              ))}
            </CollapsibleContent>
          )}
        </Collapsible>
      );
    }
    
    // Regular item
    else {
      return (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activePath === item.path ? "secondary" : darkMode ? "outline" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 mb-1",
                  darkMode ? 
                    (activePath === item.path ? "bg-amber-600/20 text-white hover:bg-amber-600/30 border-slate-700" : "border-slate-700 hover:bg-slate-700 text-white") :
                    (activePath === item.path ? "bg-amber-100 text-amber-900 hover:bg-amber-200" : "hover:bg-amber-50 text-amber-900"),
                  collapsed && "justify-center p-2"
                )}
                onClick={() => handleNavigation(item.path)}
              >
                <span className={cn(
                  darkMode ? "text-amber-400" : "text-amber-600",
                  activePath === item.path && darkMode ? "text-amber-300" : activePath === item.path && "text-amber-700"
                )}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="flex-1 text-left">{item.title}</span>
                )}
                {!collapsed && item.badge && item.badge.text && (
                  <Badge variant={item.badge.variant || "default"} 
                    className={cn(
                      "ml-auto shrink-0",
                      darkMode ? "bg-amber-600 text-white" : "bg-amber-500 text-white"
                    )}>
                    {item.badge.text}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className={darkMode ? "bg-slate-800 text-white border-slate-700" : "bg-white border-amber-200"}>
                <div className="flex items-center gap-2">
                  <span>{item.title}</span>
                  {item.badge && item.badge.text && (
                    <Badge variant={item.badge.variant || "default"} 
                      className={cn(
                        "shrink-0",
                        darkMode ? "bg-amber-600 text-white" : "bg-amber-500 text-white"
                      )}>
                      {item.badge.text}
                    </Badge>
                  )}
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      );
    }
  };

  return (
    <div 
      className={cn(
        "flex flex-col h-screen border-r transition-all duration-300 ease-in-out",
        darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-gradient-to-b from-amber-50 to-orange-50 border-amber-200 text-amber-900",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo & Collapse Button */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${darkMode ? 'bg-amber-600' : 'bg-amber-400'}`}>
              <ChefHat className={darkMode ? 'text-white h-5 w-5' : 'text-amber-900 h-5 w-5'} />
            </div>
            <span className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-amber-900'}`}>KitchenHub</span>
          </div>
        )}
        {collapsed && (
          <div className={`p-2 rounded-full mx-auto ${darkMode ? 'bg-amber-600' : 'bg-amber-400'}`}>
            <ChefHat className={darkMode ? 'text-white h-5 w-5' : 'text-amber-900 h-5 w-5'} />
          </div>
        )}
        <Button 
          variant={darkMode ? "outline" : "ghost"} 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            darkMode ? "border-slate-700 hover:bg-slate-700" : "hover:bg-amber-100", 
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? 
            <ChevronRight size={16} className={darkMode ? "text-amber-400" : "text-amber-600"} /> : 
            <ChevronLeft size={16} className={darkMode ? "text-amber-400" : "text-amber-600"} />
          }
        </Button>
      </div>

      <Separator className={darkMode ? "bg-slate-700" : "bg-amber-200"} />

      {/* Profile Section */}
      <div className={cn(
        "p-4",
        collapsed ? "flex justify-center" : "flex items-center gap-3"
      )}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-10 w-10 cursor-pointer border-2 border-amber-400">
                 <AvatarImage src={chef.avatar ? `${base_url}${chef.avatar}` : undefined} alt={chef.name} />
                <AvatarFallback className={darkMode ? "bg-amber-600 text-white" : "bg-amber-100 text-amber-900"}>MR</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className={darkMode ? "bg-slate-800 text-white border-slate-700" : "bg-white border-amber-200"}>
                <p>{chef.name}</p>
                <p className="text-xs text-muted-foreground">{chef.role}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        
        {!collapsed && (
          <div className="flex flex-col">
            <span className={`font-medium ${darkMode ? "text-white" : "text-amber-900"}`}>{chef.name}</span>
            <span className={`text-xs ${darkMode ? "text-amber-400" : "text-amber-600"}`}>{chef.role}</span>
          </div>
        )}
      </div>

      <Separator className={darkMode ? "mb-2 bg-slate-700" : "mb-2 bg-amber-200"} />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <nav className="flex flex-col gap-1">
          {_kitchen_nav.map((item, index) => renderNavItem(item, index))}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-3 mt-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "w-full border-dashed",
                  darkMode ? "border-slate-700 hover:bg-slate-700 text-red-400" : "border-amber-200 hover:bg-amber-100 text-red-500",
                  collapsed && "p-2"
                )}
              >
                <LogOut size={20} />
                {!collapsed && <span className="ml-2">Logout</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className={darkMode ? "bg-slate-800 text-white border-slate-700" : "bg-white border-amber-200"}>
                <p>Logout</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default AppSlidebar;