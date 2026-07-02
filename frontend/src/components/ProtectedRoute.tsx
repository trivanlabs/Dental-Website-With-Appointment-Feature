import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/appointmentApi";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!isAuthenticated()) {
    return <Navigate to="/doctor/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
