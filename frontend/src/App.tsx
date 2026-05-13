import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/routing/ProtectedRoute";
import RequireRole from "@/components/routing/RequireRole";
import Navbar from "@/components/Navbar";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

const queryClient = new QueryClient();

function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Prishtina Nights</h1>
      <p>Authentication module is active.</p>
    </div>
  );
}

function Dashboard() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>User Dashboard</h1>
      <p>This route is protected.</p>
    </div>
  );
}

function AdminPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Area</h1>
      <p>This route requires admin role.</p>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<RequireRole allow={["admin"]} />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;