import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";

const ProtectedRoutes = () => {
  const { isAuthenticated, loading, hasToken } = useAuth();

  if (!isAuthenticated && hasToken && loading) {
    return <div className="p-6 text-center text-gray-500">იტვირთება...</div>;
  }

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  return <Outlet />;
};

export default ProtectedRoutes