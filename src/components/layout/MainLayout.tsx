
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
    <div className="min-h-screen flex bg-background">
      <AppSidebar 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      <div 
        className={cn(
          "flex-1 transition-all duration-300",
          isMobile ? "ml-0" : (isSidebarOpen ? "ml-64" : "ml-[60px]")
        )}
      >
        {isMobile && !isSidebarOpen && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="fixed top-4 left-4 z-40 bg-background/80 backdrop-blur-sm shadow-md"
          >
            <MenuIcon size={20} />
          </Button>
        )}
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
