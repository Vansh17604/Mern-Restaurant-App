import { Heart, Coffee, ExternalLink, Github } from 'lucide-react';
import { Separator } from "../../components/ui/separator";
import { Button } from "../../components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  
  // Restaurant data
  const restaurantName = "RestaurantHub";
  const version = "v1.2.0";
  
  // Footer links - you can customize these
  const links = [
    { name: "Help Center", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Release Notes", href: "#" },
  ];
  
  // Quick stats - these would be dynamic in a real app
  const stats = [
    { label: "Uptime", value: "99.9%" },
    { label: "Orders Today", value: "147" },
    { label: "Active Tables", value: "12" }
  ];

  return (
    <footer className="bg-background border-t border-border py-3 px-3 sm:py-4 sm:px-4 md:px-6 w-full">
      {/* First row - stacked on mobile, horizontal on larger screens */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
        {/* Logo and copyright - centered on mobile, left-aligned on desktop */}
        <div className="flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-2">
            <Coffee className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span className="font-semibold text-sm sm:text-base">{restaurantName}</span>
            <span className="text-xs text-muted-foreground ml-1">{version}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            © {currentYear} {restaurantName} Admin. All rights reserved.
          </p>
        </div>
        
        {/* Quick stats - Horizontal scrollable strip on mobile */}
        <div className="flex items-center justify-center space-x-4 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto sm:justify-end">
          {stats.map((stat, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex flex-col items-center px-2 py-1 rounded-md bg-background/5">
                    <span className="text-sm font-medium">{stat.value}</span>
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Live {stat.label.toLowerCase()} statistics</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
      
      {/* Navigation - Fullwidth on mobile, flex on desktop */}
      <div className="mt-4 sm:mt-6">
        <div className="grid grid-cols-2 gap-y-2 gap-x-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-4">
          {links.map((link, index) => (
            <a 
              key={index} 
              href={link.href}
              className="text-xs text-center sm:text-left text-muted-foreground hover:text-foreground hover:underline transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
      
      {/* Separator and system status */}
      <div className="mt-4">
        <Separator />
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-3 sm:space-y-0">
          <div className="text-xs text-muted-foreground flex items-center space-x-1">
            <span>System Status:</span>
            <span className="text-green-500 font-medium">Operational</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-xs text-muted-foreground">Made with</span>
              <Heart className="h-3 w-3 text-red-500 fill-red-500 mx-1" />
              <span className="text-xs text-muted-foreground">by</span>
              <span className="text-xs font-medium ml-1">Culinary Systems Inc.</span>
            </div>
            
            <div className="flex items-center ml-2">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;