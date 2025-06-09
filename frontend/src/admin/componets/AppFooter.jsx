import { Heart, Coffee, ExternalLink, Github } from 'lucide-react';
import { Separator } from "../../components/ui/separator";
import { Button } from "../../components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAdminFooterStats } from '../../features/admin/count/countSlice';

const AppFooter = () => {
  const dispatch = useDispatch();
  const currentYear = new Date().getFullYear();
  
  const restaurantName = "RestaurantHub";
  const version = "v1.2.0";
  
  // Get footer stats from Redux state
  const { footerStats, isLoading } = useSelector((state) => state.count);
  
  // Fetch footer stats on component mount
  useEffect(() => {
    dispatch(getAdminFooterStats());
  }, [dispatch]);
  
  // Helper function to get stat value by label
const stats = Array.isArray(footerStats) && footerStats.length > 0 
    ? footerStats.map(stat => ({
        label: stat.label,
        value: isLoading ? "..." : stat.value
      }))
    : [
        // Fallback empty stats if no data
        { label: "Loading...", value: "..." },
        { label: "Loading...", value: "..." },
        { label: "Loading...", value: "..." }
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
                    <span className={`text-sm font-medium ${isLoading ? 'animate-pulse' : ''}`}>
                      {stat.value}
                    </span>
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
                
      <div className="mt-4">
        <Separator />
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-3 sm:space-y-0">
          <div className="text-xs text-muted-foreground flex items-center space-x-1">
            <span>System Status:</span>
            <span className={`font-medium ${isLoading ? 'text-yellow-500' : 'text-green-500'}`}>
              {isLoading ? 'Loading...' : 'Operational'}
            </span>
          </div>
                    
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-xs text-muted-foreground">Made with</span>
              <Heart className="h-3 w-3 text-red-500 fill-red-500 mx-1" />
              <span className="text-xs text-muted-foreground">by</span>
              <span className="text-xs font-medium ml-1">Vansh Patel</span>
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