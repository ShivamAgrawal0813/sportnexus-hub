
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "../ui/skeleton";

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-48 w-full" />
          <div className="flex space-x-4">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-12 w-1/2" />
          </div>
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Render the protected route
  return <Outlet />;
};
