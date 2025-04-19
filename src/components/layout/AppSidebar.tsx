import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, ListChecks, GraduationCap, Settings, User } from 'lucide-react';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const sidebarItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
    { path: '/venues', label: 'Venues', icon: <Calendar className="h-4 w-4" /> },
    { path: '/equipment', label: 'Equipment', icon: <ListChecks className="h-4 w-4" /> },
    { path: '/tutorials', label: 'Tutorials', icon: <GraduationCap className="h-4 w-4" /> },
    { path: '/profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col border-r bg-white shadow-sm transition-transform duration-300 dark:border-gray-700 dark:bg-gray-800 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-6 py-4">
          <h1 className="text-xl font-bold">SportNexus</h1>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <style>
        {`
          /* Add your styles here */
          .sidebar-link {
            @apply flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50;
          }
          .sidebar-link.active {
            @apply bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50;
          }
        `}
      </style>
    </>
  );
};

export default AppSidebar;
