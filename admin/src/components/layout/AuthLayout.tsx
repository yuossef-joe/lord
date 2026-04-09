import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
