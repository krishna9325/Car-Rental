import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import { Button } from "react-bootstrap";

const BackToDashBoard = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/admin");
  };
  const { colors } = useTheme();

  return (
    <div
      className="mb-4"
      style={{ animation: "slideInLeft 0.8s ease-out 0.3s both" }}
    >
      <Button
        onClick={handleBack}
        style={{
          background: colors.button.primary,
          border: "none",
          borderRadius: "25px",
          padding: "10px 20px",
          color: colors.text,
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
        ← Back to Dashboard
      </Button>
    </div>
  );
};

export default BackToDashBoard;
