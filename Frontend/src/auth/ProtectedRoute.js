// auth/ProtectedRoute.js - Component to protect admin routes
import { useAuth } from "./AuthContext";
import { useTheme } from "../components/ThemeContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Not authenticated, redirect to appropriate login
        navigate(requireAdmin ? "/admin/login" : "/login");
      } else if (requireAdmin && !isAdmin()) {
        // Authenticated but not admin, redirect to home
        navigate("/");
      }
    }
  }, [isAuthenticated, isAdmin, loading, navigate, requireAdmin]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: colors.background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: colors.text,
            fontSize: "18px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              marginBottom: "10px",
              fontSize: "24px",
            }}
          >
            🔐
          </div>
          Loading...
        </div>
      </div>
    );
  }

  // If not authenticated or (requireAdmin and not admin), don't render
  if (!isAuthenticated || (requireAdmin && !isAdmin())) {
    return null; // useEffect will handle redirection
  }

  return children;
};

export default ProtectedRoute;
