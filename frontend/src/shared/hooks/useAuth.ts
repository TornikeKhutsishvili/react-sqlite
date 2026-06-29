import { useSelector } from "react-redux";
import { authUserSelector, authLoadingSelector } from "../../store/auth/auth.slice";
import { sessionService } from "../../core/services/session.services";

export const useAuth = () => {
  const user = useSelector(authUserSelector);
  const loading = useSelector(authLoadingSelector);
  const hasToken = sessionService.isAuthenticated();

  return {
    user,
    loading,
    hasToken,
    isAuthenticated: !!user,
  };
};