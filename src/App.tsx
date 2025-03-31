
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/AuthContext";

// Import pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import Dashboard from "./pages/Dashboard";
import VenueBooking from "./pages/VenueBooking";
import EquipmentRental from "./pages/EquipmentRental";
import Tutorials from "./pages/Tutorials";
import NotFound from "./pages/NotFound";

// Import layout and auth components
import MainLayout from "./components/layout/MainLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected routes that use the MainLayout with sidebar */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/venues" element={<VenueBooking />} />
                  <Route path="/equipment" element={<EquipmentRental />} />
                  <Route path="/tutorials" element={<Tutorials />} />
                  <Route path="/profile" element={<Dashboard />} /> {/* Placeholder */}
                  <Route path="/settings" element={<Dashboard />} /> {/* Placeholder */}
                </Route>
              </Route>
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
