import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
import ProtectedRoute from "@/components/routing/ProtectedRoute";
import RequireRole from "@/components/routing/RequireRole";

// Layouts
import MainLayout from "@/components/layouts/MainLayout";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import OwnerLayout from "@/components/layouts/OwnerLayout";
import AdminLayout from "@/components/layouts/AdminLayout";

// Public Pages
import Index from "@/pages/index";
import VenuesList from "@/pages/VenuesList";
import VenueDetails from "@/pages/VenueDetails";
import EventsList from "@/pages/EventsList";
import EventDetails from "@/pages/EventDetails";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";

// Customer Dashboard
import CustomerDashboard from "@/pages/dashboard/CustomerDashboard";
import Reservations from "@/pages/dashboard/Reservations";
import Tickets from "@/pages/dashboard/Tickets";
import Favorites from "@/pages/dashboard/Favorites";
import Profile from "@/pages/dashboard/Profile";

// Owner Dashboard
import OwnerDashboard from "@/pages/owner/OwnerDashboard";
import OwnerVenues from "@/pages/owner/OwnerVenues";
import OwnerEvents from "@/pages/owner/OwnerEvents";
import OwnerReservations from "@/pages/owner/OwnerReservations";
import OwnerAnalytics from "@/pages/owner/OwnerAnalytics";
import OwnerVenueForm from "@/pages/owner/OwnerVenueForm";
import OwnerEventForm from "@/pages/owner/OwnerEventForm";

// Admin Dashboard
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminVenues from "@/pages/admin/AdminVenues";
import AdminEvents from "@/pages/admin/AdminEvents";
import AdminReports from "@/pages/admin/AdminReports";
import AdminLogs from "@/pages/admin/AdminLogs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <NotificationsProvider>
          <BrowserRouter>
            <Routes>
            {/* Public routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/venues" element={<VenuesList />} />
              <Route path="/venues/:id" element={<VenueDetails />} />
              <Route path="/events" element={<EventsList />} />
              <Route path="/events/:id" element={<EventDetails />} />
            </Route>

            {/* Auth pages (no layout) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer dashboard — authenticated users */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<CustomerDashboard />} />
                <Route path="/dashboard/reservations" element={<Reservations />} />
                <Route path="/dashboard/tickets" element={<Tickets />} />
                <Route path="/dashboard/favorites" element={<Favorites />} />
                <Route path="/dashboard/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* Owner panel */}
            <Route element={<ProtectedRoute />}>
              <Route element={<RequireRole allow={["owner"]} />}>
                <Route element={<OwnerLayout />}>
                  <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                  <Route path="/owner/venues" element={<OwnerVenues />} />
                  <Route path="/owner/venues/new" element={<OwnerVenueForm mode="create" />} />
                  <Route path="/owner/venues/:id/edit" element={<OwnerVenueForm mode="edit" />} />
                  <Route path="/owner/events" element={<OwnerEvents />} />
                  <Route path="/owner/events/new" element={<OwnerEventForm mode="create" />} />
                  <Route path="/owner/events/:id/edit" element={<OwnerEventForm mode="edit" />} />
                  <Route path="/owner/reservations" element={<OwnerReservations />} />
                  <Route path="/owner/analytics" element={<OwnerAnalytics />} />
                </Route>
              </Route>
            </Route>

            {/* Admin panel */}
            <Route element={<ProtectedRoute />}>
              <Route element={<RequireRole allow={["admin"]} />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/venues" element={<AdminVenues />} />
                  <Route path="/admin/events" element={<AdminEvents />} />
                  <Route path="/admin/reports" element={<AdminReports />} />
                  <Route path="/admin/logs" element={<AdminLogs />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </NotificationsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
