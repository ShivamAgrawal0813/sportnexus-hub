import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  LayoutDashboard, 
  CalendarDays, 
  PackageOpen, 
  GraduationCap, 
  UserCircle, 
  LogOut,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

// Main navigation items that require authentication
const sidebarItems = [
  {
    path: '/',
    label: 'Home',
    icon: Home,
    description: 'Return to landing page'
  },
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'View your dashboard'
  },
  {
    path: '/venues',
    label: 'Venue Booking',
    icon: CalendarDays,
    description: 'Book sports venues'
  },
  {
    path: '/equipment',
    label: 'Equipment Rental',
    icon: PackageOpen,
    description: 'Rent sports equipment'
  },
  {
    path: '/tutorials',
    label: 'Tutorials',
    icon: GraduationCap,
    description: 'Learn sports skills'
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: UserCircle,
    description: 'Manage your profile'
  }
];

type AppSidebarProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function AppSidebar({ isOpen, setIsOpen }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-full max-w-[280px] bg-sportnexus-green text-white transition-transform duration-300 flex flex-col shadow-lg",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 py-4 border-b border-white/20">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">SN</span>
            <span className="font-semibold">SportNexus</span>
          </div>
          <Button variant="ghost" size="sm" onClick={closeSidebar} className="md:hidden text-white hover:bg-white/10 h-8 w-8 p-0">
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 768) {
                  closeSidebar();
                }
              }}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-2 rounded-md text-base transition-colors",
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-white hover:bg-white/10"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-white hover:bg-white/10 w-full px-4 py-2 rounded-md transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
