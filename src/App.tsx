
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

// Import pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import VenueBooking from "./pages/VenueBooking";
import EquipmentRental from "./pages/EquipmentRental";
import Tutorials from "./pages/Tutorials";
import NotFound from "./pages/NotFound";

// Import layout
import MainLayout from "./components/layout/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            {/* Routes that use the MainLayout with sidebar */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/venues" element={<VenueBooking />} />
              <Route path="/equipment" element={<EquipmentRental />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/profile" element={<Dashboard />} /> {/* Placeholder */}
              <Route path="/settings" element={<Dashboard />} /> {/* Placeholder */}
            </Route>
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
