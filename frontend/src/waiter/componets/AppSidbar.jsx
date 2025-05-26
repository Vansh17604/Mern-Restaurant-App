import { useState, useEffect } from 'react';
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";

// Lucide icons
import {
  Coffee,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Utensils,
  User,
  Users,
  Calendar,
  ClipboardList,
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

// Import navigation configuration
import _waiter_nav from "../../Waiter_nav";

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activePath, setActivePath] = useState("/waiter/dashboard");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [openGroups, setOpenGroups] = useState({});

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
    
  const waiter = {
    name: "Alex Garcia",
    role: "Head Waiter",
    avatar: "/api/placeholder/32/32"
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
          darkMode ? "text-blue-400" : "text-blue-800",
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
                      darkMode ? "border-slate-700 hover:bg-slate-700 text-white" : "hover:bg-blue-100 text-blue-900",
                      collapsed && "justify-center p-2"
                    )}
                  >
                    <span className={cn(
                      "flex items-center gap-3",
                      collapsed && "justify-center"
                    )}>
                      <span className={darkMode ? "text-blue-400" : "text-blue-600"}>{item.icon}</span>
                      {!collapsed && <span>{item.title}</span>}
                    </span>
                    {!collapsed && (
                      openGroups[item.title] ? 
                        <ChevronUp size={16} className={darkMode ? "text-slate-400" : "text-blue-500"} /> : 
                        <ChevronDown size={16} className={darkMode ? "text-slate-400" : "text-blue-500"} />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className={darkMode ? "bg-slate-800 text-white border-slate-700" : "bg-white border-blue-200"}>
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
                      (activePath === subItem.path ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border-slate-700" : "border-slate-700 hover:bg-slate-700 text-white") :
                      (activePath === subItem.path ? "bg-blue-100 text-blue-900 hover:bg-blue-200" : "hover:bg-blue-50 text-blue-900")
                  )}
                  onClick={() => handleNavigation(subItem.path)}
                >
                  <span className="flex-1 text-left">{subItem.title}</span>
                  {subItem.badge && subItem.badge.text && (
                    <Badge variant={subItem.badge.variant === "info" ? "default" : subItem.badge.variant} 
                      className={cn(
                        "ml-auto shrink-0",
                        darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
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
                    (activePath === item.path ? "bg-blue-600/20 text-white hover:bg-blue-600/30 border-slate-700" : "border-slate-700 hover:bg-slate-700 text-white") :
                    (activePath === item.path ? "bg-blue-100 text-blue-900 hover:bg-blue-200" : "hover:bg-blue-50 text-blue-900"),
                  collapsed && "justify-center p-2"
                )}
                onClick={() => handleNavigation(item.path)}
              >
                <span className={cn(
                  darkMode ? "text-blue-400" : "text-blue-600",
                  activePath === item.path && darkMode ? "text-blue-300" : activePath === item.path && "text-blue-700"
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
                      darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                    )}>
                    {item.badge.text}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className={darkMode ? "bg-slate-800 text-white border-slate-700" : "bg-white border-blue-200"}>
                <div className="flex items-center gap-2">
                  <span>{item.title}</span>
                  {item.badge && item.badge.text && (
                    <Badge variant={item.badge.variant || "default"} 
                      className={cn(
                        "shrink-0",
                        darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
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
        darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-gradient-to-b from-blue-50 to-indigo-50 border-blue-200 text-blue-900",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo & Collapse Button */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-400'}`}>
              <Coffee className={darkMode ? 'text-white h-5 w-5' : 'text-blue-900 h-5 w-5'} />
            </div>
            <span className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-blue-900'}`}>TableServe</span>
          </div>
        )}
        {collapsed && (
          <div className={`p-2 rounded-full mx-auto ${darkMode ? 'bg-blue-600' : 'bg-blue-400'}`}>
            <Coffee className={darkMode ? 'text-white h-5 w-5' : 'text-blue-900 h-5 w-5'} />
          </div>
        )}
        <Button 
          variant={darkMode ? "outline" : "ghost"} 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            darkMode ? "border-slate-700 hover:bg-slate-700" : "hover:bg-blue-100", 
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? 
            <ChevronRight size={16} className={darkMode ? "text-blue-400" : "text-blue-600"} /> : 
            <ChevronLeft size={16} className={darkMode ? "text-blue-400" : "text-blue-600"} />
          }
        </Button>
      </div>

      <Separator className={darkMode ? "bg-slate-700" : "bg-blue-200"} />

      {/* Profile Section */}
      <div className={cn(
        "p-4",
        collapsed ? "flex justify-center" : "flex items-center gap-3"
      )}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-10 w-10 cursor-pointer border-2 border-blue-400">
                <AvatarImage src={waiter.avatar} alt={waiter.name} />
                <AvatarFallback className={darkMode ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-900"}>AG</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className={darkMode ? "bg-slate-800 text-white border-slate-700" : "bg-white border-blue-200"}>
                <p>{waiter.name}</p>
                <p className="text-xs text-muted-foreground">{waiter.role}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        
        {!collapsed && (
          <div className="flex flex-col">
            <span className={`font-medium ${darkMode ? "text-white" : "text-blue-900"}`}>{waiter.name}</span>
            <span className={`text-xs ${darkMode ? "text-blue-400" : "text-blue-600"}`}>{waiter.role}</span>
          </div>
        )}
      </div>

      <Separator className={darkMode ? "mb-2 bg-slate-700" : "mb-2 bg-blue-200"} />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <nav className="flex flex-col gap-1">
          {_waiter_nav.map((item, index) => renderNavItem(item, index))}
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
                  darkMode ? "border-slate-700 hover:bg-slate-700 text-red-400" : "border-blue-200 hover:bg-blue-100 text-red-500",
                  collapsed && "p-2"
                )}
              >
                <LogOut size={20} />
                {!collapsed && <span className="ml-2">Logout</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className={darkMode ? "bg-slate-800 text-white border-slate-700" : "bg-white border-blue-200"}>
                <p>Logout</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default AppSidebar;