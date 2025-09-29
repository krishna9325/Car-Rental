// AuthForm.js - Debug version to check role field visibility
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const AuthForm = ({ isAdmin = false, defaultMode = "login" }) => {
  const { colors } = useTheme();
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(defaultMode === "login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      setError("Username and password are required");
      return false;
    }

    if (isAdmin && !formData.role) {
      setError("Role is required for admin access");
      return false;
    }

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let result;
      const credentials = {
        username: formData.username,
        password: formData.password,
        ...(isAdmin && { role: formData.role }),
      };

      if (isLogin) {
        result = await login(credentials, isAdmin);
      } else {
        result = await signup(credentials, isAdmin);
      }

      if (result.success) {
        setSuccess(isLogin ? "Login successful!" : "Signup successful!");

        // Redirect based on user role
        setTimeout(() => {
          if (result.user.isAdmin) {
            navigate("/admin");
          } else {
            navigate("/home");
          }
        }, 1000);
      } else {
        setError(result.error || "Authentication failed");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: "",
      password: "",
      confirmPassword: "",
      role: "",
    });
    setError("");
    setSuccess("");
  };

  const getRedirectText = () => {
    if (isAdmin) {
      return {
        question: isLogin ? "Need admin access?" : "Already have admin access?",
        action: isLogin ? "Sign up here" : "Login here",
      };
    }
    return {
      question: isLogin ? "Don't have an account?" : "Already have an account?",
      action: isLogin ? "Sign up here" : "Login here",
    };
  };

  const redirectText = getRedirectText();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        paddingTop: "90px", // Account for fixed header
      }}
    >
      <div
        style={{
          background: colors.cardBackground,
          borderRadius: "15px",
          padding: "40px",
          boxShadow: colors.cardHover,
          width: "100%",
          maxWidth: "450px",
          border: `1px solid ${colors.accent}`,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2
            style={{
              color: colors.text,
              fontSize: "28px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            {isAdmin ? "Admin " : ""}
            {isLogin ? "Login" : "Signup"}
          </h2>
          <p
            style={{
              color: colors.textSecondary,
              fontSize: "14px",
            }}
          >
            {isLogin
              ? `Sign in to your ${isAdmin ? "admin " : ""}account`
              : `Create a new ${isAdmin ? "admin " : ""}account`}
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "linear-gradient(135deg, #ff6b6b, #ff5252)",
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: colors.button?.success || "#28a745",
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              style={{
                color: colors.text,
                fontSize: "14px",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Username *
            </label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleInputChange}
              style={{
                background: colors.secondary,
                border: `1px solid ${colors.accent}`,
                borderRadius: "8px",
                padding: "12px",
                color: colors.text,
                fontSize: "14px",
                width: "100%",
              }}
              placeholder="Enter username"
              required
            />
          </div>

          {/* ROLE FIELD - ALWAYS SHOW FOR ADMIN PAGES */}
          {isAdmin && (
            <div className="mb-3">
              <input
                type="text"
                name="role"
                className="form-control"
                value={formData.role}
                onChange={handleInputChange}
                style={{
                  background: colors.secondary,
                  border: `1px solid ${colors.accent}`,
                  borderRadius: "8px",
                  padding: "12px",
                  color: colors.text,
                  fontSize: "14px",
                  width: "100%",
                }}
                placeholder="Enter your role"
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label
              style={{
                color: colors.text,
                fontSize: "14px",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Password *
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleInputChange}
              style={{
                background: colors.secondary,
                border: `1px solid ${colors.accent}`,
                borderRadius: "8px",
                padding: "12px",
                color: colors.text,
                fontSize: "14px",
                width: "100%",
              }}
              placeholder="Enter password"
              required
            />
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label
                style={{
                  color: colors.text,
                  fontSize: "14px",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={{
                  background: colors.secondary,
                  border: `1px solid ${colors.accent}`,
                  borderRadius: "8px",
                  padding: "12px",
                  color: colors.text,
                  fontSize: "14px",
                  width: "100%",
                }}
                placeholder="Confirm password"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading
                ? colors.button?.secondary || "#6c757d"
                : colors.button?.primary || "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              marginBottom: "20px",
            }}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <span style={{ color: colors.textSecondary, fontSize: "14px" }}>
            {redirectText.question}{" "}
          </span>
          <button
            onClick={toggleMode}
            style={{
              background: "transparent",
              border: "none",
              color: colors.button?.primary?.includes("fdac94ff")
                ? "#fdac94ff"
                : "#585656ff",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {redirectText.action}
          </button>
        </div>

        {/* Navigation Links */}
        <div
          style={{
            textAlign: "center",
            borderTop: `1px solid ${colors.accent}`,
            paddingTop: "15px",
          }}
        >
          <div style={{ fontSize: "12px", color: colors.textSecondary }}>
            {isAdmin && (
              <Link
                to="/login"
                style={{
                  color: colors.textSecondary,
                  textDecoration: "none",
                }}
              >
                ← Back to User Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
