import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {isMobile && (
        <AppSidebar 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar}
          className="mobile-nav"
        />
      )}
      <div 
        className={cn(
          "flex-1 transition-all duration-300",
          !isMobile && (isSidebarOpen ? "ml-64" : "ml-[60px]")
        )}
      >
        {!isMobile && (
          <AppSidebar 
            isSidebarOpen={isSidebarOpen} 
            toggleSidebar={toggleSidebar} 
          />
        )}
        <div className={cn(
          "container mx-auto px-4",
          isMobile ? "pt-28 pb-8" : "py-8"
        )}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
