import { useState ,useEffect} from 'react';
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { fetchAdminDetails } from '../../features/admin/admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';


// Lucide icons
import {
  Home,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
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
import useNav from "../../_nav";

const Sidebar = () => {
    const { t, i18n } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [activePath, setActivePath] = useState("/dashboard");
  const [openGroups, setOpenGroups] = useState({});
    const dispatch = useDispatch();
    const { admin = {}, isLoading, isError, isSuccess, message } = useSelector((state) => state.admin || {});
  const { user } = useSelector((state) => state.auth || {}); 
  const adminId = user?.id;
  const  _nav  = useNav();

const navigate = useNavigate();

  useEffect(() => {
    if (adminId) {
      dispatch(fetchAdminDetails(adminId));
    }
  }, [dispatch, adminId]);
  // Mock user data
  const userData = {
    name: admin?.name|| "Admin",
    role: "Admin",
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
  navigate(path)
    
  };

  // Render navigation item based on type
  const renderNavItem = (item, index) => {
    // Title type (similar to CNavTitle)
    if (item.type === "title") {
      return (
        <div key={index} className={cn(
          "px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
          collapsed && "text-center"
        )}>
          {!collapsed && item.title}
        </div>
      );
    }
    
    // Group type (similar to CNavGroup)
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
                    variant="ghost"
                    className={cn(
                      "w-full justify-between mb-1",
                      collapsed && "justify-center p-2"
                    )}
                  >
                    <span className={cn(
                      "flex items-center gap-3",
                      collapsed && "justify-center"
                    )}>
                      <span className="text-muted-foreground">{item.icon}</span>
                      {!collapsed && <span>{item.title}</span>}
                    </span>
                    {!collapsed && (
                      openGroups[item.title] ? 
                        <ChevronUp size={16} /> : 
                        <ChevronDown size={16} />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
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
                  variant={activePath === subItem.path ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleNavigation(subItem.path)}
                >
                  <span className="flex-1 text-left">{subItem.title}</span>
                </Button>
              ))}
            </CollapsibleContent>
          )}
        </Collapsible>
      );
    }
    
    // Regular item (similar to CNavItem)
    else {
      return (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activePath === item.path ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 mb-1",
                  collapsed && "justify-center p-2"
                )}
                onClick={() => handleNavigation(item.path)}
              >
                <span className={cn(
                  "text-muted-foreground",
                  activePath === item.path && "text-foreground"
                )}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="flex-1 text-left">{item.title}</span>
                )}
                {!collapsed && item.badge && item.badge.text && (
                  <Badge variant={item.badge.variant === "info" ? "default" : item.badge.variant} className="ml-auto shrink-0">
                    {item.badge.text}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                <div className="flex items-center gap-2">
                  <span>{item.title}</span>
                  {item.badge && item.badge.text && (
                    <Badge variant={item.badge.variant === "info" ? "default" : item.badge.variant} className="shrink-0">
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
        "flex flex-col h-screen bg-background border-r border-border transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo & Collapse Button */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">{t('adminsidebar.title')}</span>
          </div>
        )}
        {collapsed && (
          <Home className="h-6 w-6 text-primary mx-auto" />
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className={cn("hover:bg-accent", collapsed && "mx-auto")}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      <Separator />

      {/* Profile Section */}
      <div className={cn(
        "p-4",
        collapsed ? "flex justify-center" : "flex items-center gap-3"
      )}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-10 w-10 cursor-pointer border-2 border-primary">
                <AvatarImage src={userData.avatar} alt={userData.name} />
               <AvatarFallback>{userData.name.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                <p>{userData.name}</p>
                <p className="text-xs text-muted-foreground">{userData.role}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-medium">{userData.name}</span>
            <span className="text-xs text-muted-foreground">{userData.role}</span>
          </div>
        )}
      </div>

      <Separator className="mb-2" />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <nav className="flex flex-col gap-1">
          {_nav.map((item, index) => renderNavItem(item, index))}
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
                  collapsed && "p-2"
                )}
              >
                <LogOut size={20} className="text-muted-foreground" />
                {!collapsed && <span className="ml-2">{t('adminsidebar.logout')}</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                <p>{t('adminsidebar.logout')}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Sidebar;