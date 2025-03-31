import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Gauge, CalendarRange, ShoppingBag, 
  GraduationCap, UserCircle, Settings, LogOut, MenuIcon, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';

type NavItem = {
  title: string;
  icon: React.ElementType;
  path: string;
};

const navItems: NavItem[] = [
  { title: 'Home', icon: Home, path: '/' },
  { title: 'Dashboard', icon: Gauge, path: '/dashboard' },
  { title: 'Venue Booking', icon: CalendarRange, path: '/venues' },
  { title: 'Equipment Rental', icon: ShoppingBag, path: '/equipment' },
  { title: 'Tutorials', icon: GraduationCap, path: '/tutorials' },
  { title: 'Profile', icon: UserCircle, path: '/profile' },
  { title: 'Settings', icon: Settings, path: '/settings' },
];

interface AppSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  className?: string;
}

export default function AppSidebar({ isSidebarOpen, toggleSidebar, className }: AppSidebarProps) {
  const isMobile = useIsMobile();
  const { signOut } = useAuth();

  if (isMobile) {
    return (
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-sidebar shadow-md flex flex-col",
        className
      )}>
        {/* Top bar with logo */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-sportnexus-green flex items-center justify-center text-white font-bold">
              SN
            </div>
            <h1 className="text-lg font-bold text-white">SportNexus</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => signOut()}
            className="text-white hover:bg-sidebar-primary/20"
          >
            <LogOut size={20} />
          </Button>
        </div>

        {/* Navigation icons */}
        <div className="h-12 px-2 flex items-center justify-between overflow-x-auto hide-scrollbar border-b border-sidebar-border">
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex flex-col items-center justify-center p-2 rounded-md transition-colors min-w-[48px]",
                  "hover:bg-sidebar-primary/20",
                  isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground"
                )}
              >
                <item.icon size={20} />
                <span className="text-[10px] mt-0.5 font-medium">{item.title}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar transition-transform duration-300 ease-in-out",
      isSidebarOpen ? "translate-x-0" : "translate-x-0 w-[60px]"
    )}>
      <Sidebar className={cn(
        "h-full flex flex-col border-r border-sidebar-border", 
        isSidebarOpen ? "w-64" : ""
      )}>
        <SidebarHeader className={cn(
          "flex p-4 justify-between items-center",
          !isSidebarOpen && "justify-center"
        )}>
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-sportnexus-green flex items-center justify-center text-white font-bold">
                SN
              </div>
              <h1 className="text-lg font-bold text-white">SportNexus</h1>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="text-white hover:bg-sidebar-primary/20"
          >
            {isSidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </Button>
        </SidebarHeader>
        <SidebarContent className="flex-1 py-4">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors",
                  "hover:bg-sidebar-primary/20 group",
                  isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground",
                  !isSidebarOpen && "justify-center px-2"
                )}
              >
                <item.icon size={20} className={cn(
                  "flex-shrink-0",
                  !isSidebarOpen && "mx-auto"
                )} />
                {isSidebarOpen && (
                  <span className="ml-3 text-sm font-medium">{item.title}</span>
                )}
              </NavLink>
            ))}
          </nav>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full text-sidebar-foreground hover:bg-sidebar-primary/20 flex items-center",
              !isSidebarOpen && "justify-center"
            )}
            onClick={signOut}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
