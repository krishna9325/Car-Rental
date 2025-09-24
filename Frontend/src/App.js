import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CarsPage from "./components/AdminPage";
import AddCarPage from "./components/AddCar";
import AddCity from "./components/AddCity";
import Header from "./components/Header";
import { ThemeProvider } from "./components/ThemeContext";
import "./animations.css";
import CarsListPage from "./components/CarsListPage";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div style={{ minHeight: "70vh" }}>
          <Header />
          <main style={{ paddingTop: "70px", minHeight: "70vh" }}>
            <Routes>
              <Route path="/" element={<CarsPage />} />
              <Route path="/add-car" element={<AddCarPage />} />
              <Route path="/add-city" element={<AddCity />} />
              <Route path="/cities" element={<CarsListPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
