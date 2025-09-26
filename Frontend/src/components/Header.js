import { useState } from "react";
import { useTheme } from "./ThemeContext";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { isDark, toggleTheme, colors } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleLogin = () => {
    navigate("/login");
    setIsNavOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsNavOpen(false);
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsNavOpen(false);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav
      className="navbar navbar-expand-lg shadow-lg"
      style={{
        backgroundImage: colors.carDisplayBackground,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1030,
        minHeight: "70px",
      }}
    >
      <div className="container d-flex justify-content-between align-items-center">
        {/* Left - Logo */}
        <a
          className="navbar-brand d-flex flex-column"
          href="/"
          style={{
            textDecoration: "none",
            lineHeight: "1.1",
          }}
        >
          <span
            style={{
              fontSize: "32px",
              fontWeight: "800",
              letterSpacing: "-0.5px",
              backgroundImage: isDark
                ? "linear-gradient(135deg, #ffffff, #e0e0e0)"
                : "linear-gradient(135deg, #ff6b35, #f7931e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Car-Rental
          </span>
          <span
            style={{
              fontSize: "11px",
              fontWeight: "500",
              color: colors.textSecondary,
              marginTop: "-2px",
              letterSpacing: "0.5px",
            }}
          >
            Premium Car Services
          </span>
        </a>

        {/* Right - Theme toggle + Hamburger */}
        <div className="d-flex align-items-center ms-auto">
          {/* Theme Toggle (outside nav) */}
          <div
            className="d-flex align-items-center justify-content-center me-3"
            style={{ padding: "8px 0" }}
          >
            <label
              style={{
                position: "relative",
                display: "inline-block",
                width: "50px",
                height: "24px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={isDark}
                onChange={toggleTheme}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: isDark ? "#8a8a8aff" : "#f98752ff",
                  transition: "0.3s ease",
                  borderRadius: "24px",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    height: "18px",
                    width: "18px",
                    left: isDark ? "29px" : "3px",
                    bottom: "3px",
                    backgroundColor: "white",
                    transition: "0.3s ease",
                    borderRadius: "50%",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                ></span>
              </span>
            </label>
          </div>

          {/* Mobile hamburger button */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNav}
            aria-expanded={isNavOpen}
            aria-label="Toggle navigation"
            style={{
              border: "none",
              background: "transparent",
              padding: "4px 8px",
              borderRadius: "4px",
              outline: "none",
            }}
          >
            <span
              style={{
                display: "block",
                width: "25px",
                height: "3px",
                backgroundColor: colors.text,
                margin: "3px 0",
                transition: "0.3s",
                transform: isNavOpen
                  ? "rotate(-45deg) translate(-5px, 6px)"
                  : "none",
              }}
            ></span>
            <span
              style={{
                display: "block",
                width: "25px",
                height: "3px",
                backgroundColor: colors.text,
                margin: "3px 0",
                transition: "0.3s",
                opacity: isNavOpen ? "0" : "1",
              }}
            ></span>
            <span
              style={{
                display: "block",
                width: "25px",
                height: "3px",
                backgroundColor: colors.text,
                margin: "3px 0",
                transition: "0.3s",
                transform: isNavOpen
                  ? "rotate(45deg) translate(-5px, -6px)"
                  : "none",
              }}
            ></span>
          </button>
        </div>

        {/* Collapsible navbar content */}
        <div
          className={`navbar-collapse collapse ${isNavOpen ? "show" : ""}`}
          style={{
            transition: "all 0.3s ease-in-out",
          }}
        >
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {isAuthenticated && user && (
              <li className="nav-item me-lg-3">
                <span
                  className="d-flex align-items-end justify-content-end"
                  style={{
                    color: colors.text,
                    fontSize: "14px",
                    padding: "8px 16px",
                    margin: 0,
                  }}
                >
                  <span style={{ color: colors.text, marginLeft: "5px" }}>
                    Welcome, {user.username}
                  </span>
                </span>
              </li>
            )}

            {/* Auth buttons */}
            <li className="nav-item">
              <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center">
                {!isAuthenticated ? (
                  <>
                    <button
                      className="btn mb-2 mb-lg-0 me-lg-2"
                      onClick={handleLogin}
                      style={{
                        backgroundImage: colors.button.primary,
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        margin: "2px",
                        transition: "all 0.3s ease",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Login
                    </button>
                    <button
                      className="btn"
                      onClick={() => {
                        navigate("/signup");
                        setIsNavOpen(false);
                      }}
                      style={{
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                        borderRadius: "6px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                        margin: "2px",
                        transition: "all 0.3s ease",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn mb-2 mb-lg-0 me-lg-2"
                      onClick={handleProfile}
                      style={{
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                        borderRadius: "6px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                        margin: "2px",
                        transition: "all 0.3s ease",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Profile
                    </button>
                    <button
                      className="btn"
                      onClick={handleLogout}
                      style={{
                        backgroundImage: colors.button.primary,
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "10px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                        margin: "2px",
                        transition: "all 0.3s ease",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
