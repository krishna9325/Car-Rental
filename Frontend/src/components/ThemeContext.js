import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(isDark));
    const bg = isDark
      ? "linear-gradient(135deg, #1a1a1a 0%, #1a1a1a 50%, #1a1a1a 100%)"
      : "linear-gradient(135deg, #ffffff 0%, #ffffff 50%, #ffffff 100%)";

    // Apply background to html and body
    document.documentElement.style.background = bg;
    document.body.style.background = bg;
    document.body.style.color = isDark ? "#ffffff" : "#1a1a1a";

    //Fix the overscroll/pull-to-refresh background
    document.documentElement.style.backgroundColor = isDark
      ? "#1a1a1a"
      : "#ffffff";
    document.body.style.backgroundColor = isDark ? "#1a1a1a" : "#ffffff";

    //Prevent white flash during theme transitions
    document.documentElement.style.transition = "background-color 0.3s ease";
    document.body.style.transition = "background-color 0.3s ease";
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = {
    isDark,
    toggleTheme,
    colors: isDark
      ? {
          // Dark theme colors
          primary: "#1a1a1a",
          secondary: "#2d2d2d",
          accent: "#404040",
          text: "#ffffff",
          swipe: "#000000",
          textSecondary: "#b0b0b0",
          background:
            "linear-gradient(135deg, #1a1a1a 0%, #1a1a1a 50%, #1a1a1a 100%)",
          cardBackground: "linear-gradient(135deg, #2d2d2d, #404040)",
          carDisplayBackground: "linear-gradient(135deg, #000000ff, #000000ff)",
          cardHover: "0 15px 30px rgba(255, 255, 255, 0.1)",
          button: {
            primary: "linear-gradient(135deg, #585656ff, #5a5a5a)",
            secondary: "linear-gradient(135deg, #2d2d2d, #404040)",
            danger: "linear-gradient(135deg, #dc3545, #c82333)",
            success: "linear-gradient(135deg, #82c486ff, #82c486ff)",
            warning: "linear-gradient(135deg, #ffc107, #ffc107)",
            info: "linear-gradient(135deg, #17a2b8, #138496)",
          },
        }
      : {
          // Light theme colors - silent orange tone
          primary: "#f5f5f5",
          secondary: "#ffffff",
          accent: "#fff5f0",
          swipe: "#ffffffff",
          text: "#2d2d2d",
          textSecondary: "#666666",
          background:
            "linear-gradient(135deg, #ffffffff 0%, #ffffffff 50%, #ffffffff 100%)",
          cardBackground: "linear-gradient(135deg, #f4f4f4ff, #f4f4f4ff)",
          carDisplayBackground: "linear-gradient(135deg, #ffffffff, #ffffffff)",
          cardHover: "0 15px 30px rgba(255, 140, 105, 0.2)",
          button: {
            primary: "linear-gradient(135deg, #fdac94ff, #fdac94ff)",
            secondary: "linear-gradient(135deg, #f5f5f5, #e0e0e0)",
            danger: "linear-gradient(135deg, #ff6b6b, #ff5252)",
            success: "linear-gradient(135deg, #82c486ff, #82c486ff)",
            warning: "linear-gradient(135deg, #ffb74d, #ffa726)",
            info: "linear-gradient(135deg, #42a5f5, #2196f3)",
          },
        },
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
