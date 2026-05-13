import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { authAppRole } from "@/lib/authUser";
import type { AppRole } from "@/types/auth";

interface RequireRoleProps {
  /** User must have this app-level role (admin may access owner routes). */
  allow: AppRole[];
}

const RequireRole = ({ allow }: RequireRoleProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = authAppRole(user);
  const ok =
    allow.includes(role) ||
    (allow.includes("owner") && role === "admin");

  if (!ok) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RequireRole;
