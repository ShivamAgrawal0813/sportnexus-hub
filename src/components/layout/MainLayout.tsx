import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // On desktop, sidebar is always open
  // On mobile, it can be toggled
  const isOpen = isMobile ? isSidebarOpen : true;

  return (
    <div className="min-h-screen flex flex-col bg-background w-[100vw]">
      <AppSidebar 
        isOpen={isOpen} 
        setIsOpen={setIsSidebarOpen}
      />
      
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-20 bg-sportnexus-green p-4 flex items-center justify-between shadow-sm w-full">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-white"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="text-white font-bold">SportNexus</div>
          <div className="w-5"></div> {/* Empty div for balanced spacing */}
        </header>
      )}
      
      <div className={cn(
        "flex-1 transition-all",
        isMobile ? "w-full mt-16" : "md:ml-[280px]" // Add margin-top on mobile for header, left margin on desktop for sidebar
      )}>
        <main className="p-4 md:p-6 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
