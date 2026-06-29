import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store";
import { useAuth } from "../../hooks/useAuth";
import { logoutUser } from "../../../store/auth/auth.thunks";
import { clearAuth } from "../../../store/auth/auth.slice";

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition
    ${isActive
      ? "bg-blue-600 text-white"
      : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
    }`;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(clearAuth());
    navigate("/auth/login", { replace: true });
  };

  return (
    <header className="w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="text-xl font-bold text-blue-600">Frontend & Backend</div>

        {/* Nav */}
        <nav className="flex items-center gap-3">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/users" className={linkClass}>Users</NavLink>
          <NavLink to="/exams" className={linkClass}>Exams</NavLink>
          <NavLink to="/documents" className={linkClass}>Documents</NavLink>
          <span className="text-gray-300">|</span>

          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className={linkClass}>
                {user?.firstname ?? "Profile"}
              </NavLink>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/auth/login" className={linkClass}>Login</NavLink>
              <NavLink to="/auth/register" className={linkClass}>Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header