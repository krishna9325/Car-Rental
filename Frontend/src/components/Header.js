import { useTheme } from "./ThemeContext";

const Header = () => {
  const { isDark, toggleTheme, colors } = useTheme();

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logout clicked");
  };

  return (
    <nav
      className="navbar navbar-expand-lg shadow-lg"
      style={{
        background: colors.carDisplayBackground,
        transition: "all 0.3s ease",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1030, // Bootstrap's navbar z-index
        height: "70px", // Fixed height for consistent spacing
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="container">
        <a
          className="navbar-brand fw-bold fs-3"
          href="/"
          style={{
            color: colors.text,
            textShadow: isDark
              ? "0 0 10px rgba(255,255,255,0.3)"
              : "0 2px 4px rgba(0,0,0,0.1)",
            textDecoration: "none",
          }}
        >
          Car-Rental
        </a>

        <div className="navbar-nav d-flex flex-row gap-2">
          <button
            className="btn btn-sm me-2"
            onClick={toggleTheme}
            style={{
              background: colors.button.info,
              color: "#ffffff",
              border: "none",
              borderRadius: "25px",
              padding: "8px 16px",
              fontSize: "14px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
            }}
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>

          <button
            className="btn btn-sm"
            onClick={handleLogout}
            style={{
              background: colors.button.danger,
              color: "#ffffff",
              border: "none",
              borderRadius: "25px",
              padding: "8px 16px",
              fontSize: "14px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-10px)";
              e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
