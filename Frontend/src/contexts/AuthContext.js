import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // includes userId, username, role
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // ✅ On app start, check for saved auth data
  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp > currentTime) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser)); // includes userId
          setIsAuthenticated(true);
        } else {
          clearAuthData();
        }
      } catch (error) {
        console.error("Invalid token:", error);
        clearAuthData();
      }
    }
    setLoading(false);
  };

  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // ✅ Login function
  const login = async (credentials, isAdmin = false) => {
    try {
      const endpoint = isAdmin ? "/admin/login" : "/user/login";
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.message);

      if (data.token && data.userId) {
        // Decode token
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        const userData = {
          id: data.userId, // ✅ backend-provided userId
          username: payload.sub,
          role: payload.role,
          isAdmin: payload.role === "ADMIN",
        };

        setToken(data.token);
        setUser(userData);
        setIsAuthenticated(true);

        // Save to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userData));

        return { success: true, user: userData };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ✅ Signup function
  const signup = async (credentials, isAdmin = false) => {
    try {
      const endpoint = isAdmin ? "/admin/signup" : "/user/signup";
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.message);

      if (data.token && data.userId) {
        // Decode token
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        const userData = {
          id: data.userId, // ✅ backend-provided userId
          username: payload.sub,
          role: payload.role,
          isAdmin: payload.role === "ADMIN",
        };

        setToken(data.token);
        setUser(userData);
        setIsAuthenticated(true);

        // Save to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userData));

        return { success: true, user: userData };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    clearAuthData();
    setMessage({ type: "success", text: "Logged out successfully!" });
    setTimeout(() => setMessage(null), 3000);
  };

  const getAuthHeaders = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user, // now includes { id, username, role }
        token,
        loading,
        message,
        login,
        signup,
        logout,
        getAuthHeaders,
        isAdmin,
      }}
    >
      {message && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "20px",
            background: message.type === "success" ? "#a2c9a5ff" : "#e59696ff",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          {message.text}
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};
