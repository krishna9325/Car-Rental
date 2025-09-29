// App.js - Updated routing structure
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from "./admin/AdminPage";
import AddCarPage from "./admin/AddCar"; // You might want to rename this to AddCarForm
import AddCity from "./admin/AddCity";
import Header from "./components/Header";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CarsProvider } from "./contexts/CarsContext"; // New context
import "./animations.css";
import HomePage from "./components/HomePage";
import AdminLoginPage from "./auth/AdminLoginPage";
import AdminSignupPage from "./auth/AdminSignupPage";
import LoginPage from "./auth/LoginPage";
import SignupPage from "./auth/SignupPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import CarViewPage from "./components/CarViewPage";
import UserHomePage from "./user/UserHome";
import ListAllCars from "./admin/ListAllCars"; // Admin car management page
import EditCarForm from "./admin/EditCarForm"; // Renamed from EditCarPage

function App() {
  return (
    <ThemeProvider>
      <CarsProvider>
        {" "}
        {/* Wrap with CarsProvider */}
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

                  {/* Add new car */}
                  <Route
                    path="/admin/add-car"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AddCarPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Add new city */}
                  <Route
                    path="/admin/add-city"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AddCity />
                      </ProtectedRoute>
                    }
                  />

                  {/* List/Manage all cars (admin view with edit/delete buttons) */}
                  <Route
                    path="/admin/list-car"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <ListAllCars />
                      </ProtectedRoute>
                    }
                  />

                  {/* Edit specific car form */}
                  <Route
                    path="/admin/edit/:carId"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <EditCarForm />
                      </ProtectedRoute>
                    }
                  />

                  {/* Add new car form (reuse EditCarForm with no carId) */}
                  <Route
                    path="/admin/car/new"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <EditCarForm />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected User Routes */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute requireAdmin={false}>
                        <div>User Profile Page</div>
                      </ProtectedRoute>
                    }
                  />

                  {/* User car browsing */}
                  <Route
                    path="/home"
                    element={
                      <ProtectedRoute requireAdmin={false}>
                        <UserHomePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Route */}
                  <Route
                    path="*"
                    element={
                      <div style={{ textAlign: "center", padding: "50px" }}>
                        <h2>Page Not Found</h2>
                        <p>The page you're looking for doesn't exist.</p>
                      </div>
                    }
                  />
                </Routes>
              </main>
            </div>
          </Router>
        </AuthProvider>
      </CarsProvider>
    </ThemeProvider>
  );
}

export default App;
