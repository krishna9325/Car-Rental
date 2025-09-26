import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from "./admin/AdminPage";
import AddCarPage from "./admin/AddCar";
import AddCity from "./admin/AddCity";
import Header from "./components/Header";
import { ThemeProvider } from "./components/ThemeContext";
import { AuthProvider } from "./auth/AuthContext";
import "./animations.css";
import HomePage from "./components/HomePage";
import AdminLoginPage from "./auth/AdminLoginPage";
import AdminSignupPage from "./auth/AdminSignupPage";
import LoginPage from "./auth/LoginPage";
import SignupPage from "./auth/SignupPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import CarViewPage from "./components/CarViewPage";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div style={{ minHeight: "100vh" }}>
            <Header />
            <main
              style={{ paddingTop: "70px", minHeight: "calc(100vh - 70px)" }}
            >
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/signup" element={<AdminSignupPage />} />
                <Route path="/car/:carId" element={<CarViewPage />} />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/add-car"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AddCarPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/add-city"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AddCity />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/cities"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <HomePage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected User Routes (if needed) */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute requireAdmin={false}>
                      <div>User Profile Page</div>
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route
                  path="*"
                  element={
                    <div style={{ textAlign: "center", padding: "50px" }}>
                      Page Not Found
                    </div>
                  }
                />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
