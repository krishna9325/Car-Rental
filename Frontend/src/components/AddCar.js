import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import { useTheme } from "./ThemeContext";
import BackToDashBoard from "./BackToDashBoard";

function AddCarPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cities } = location.state || { cities: [] };
  const { isDark, colors } = useTheme();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaultCars, setDefaultCars] = useState([]);
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [formData, setFormData] = useState({
    carName: "",
    pricePerDay: "",
    details: "",
    count: "",
    brand: "",
    cityId: "",
    specifications: {
      engine: "",
      cc: "",
      transmission: "",
      seatingCapacity: "",
      fuelType: "",
    },
    images: ["0.jpg", "1.jpg", "2.jpg", "3.jpg"],
  });

  // ✅ Load default cars data from JSON
  useEffect(() => {
    const loadDefaultCars = async () => {
      try {
        const response = await fetch("/data/cars.json");
        if (response.ok) {
          const carsData = await response.json();
          setDefaultCars(carsData);
        } else {
          console.error("Failed to load default cars data");
        }
      } catch (error) {
        console.error("Error loading default cars:", error);
      }
    };
    loadDefaultCars();
  }, []);

  // ✅ Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.specifications) {
      setFormData((prev) => ({
        ...prev,
        specifications: { ...prev.specifications, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Handle default car selection
  const handleDefaultCarSelect = (e) => {
    const selectedCarName = e.target.value;
    const selectedCar = defaultCars.find(
      (car) => car.carName === selectedCarName
    );

    if (selectedCar) {
      setFormData((prev) => ({
        ...prev,
        carName: selectedCar.carName,
        brand: selectedCar.brand,
        pricePerDay: selectedCar.pricePerDay,
        details: selectedCar.details || "",
        specifications: selectedCar.specifications || prev.specifications,
        // keep count & cityId empty for manual input
        count: "",
        cityId: "",
      }));
    }
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8080/admin/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowAlert({
          show: true,
          message: "Car added successfully! Redirecting...",
          type: "success",
        });
        setTimeout(() => navigate("/"), 2000);
      } else {
        setShowAlert({
          show: true,
          message: "Failed to add car! Please try again.",
          type: "danger",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      setShowAlert({
        show: true,
        message: "Network error! Please check your connection.",
        type: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Input styles
  const inputStyle = {
    backgroundColor: isDark ? "#404040" : "#ffffff",
    border: `2px solid ${isDark ? "#555" : "#e0e0e0"}`,
    color: colors.text,
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "16px",
    transition: "all 0.3s ease",
    boxShadow: "none",
  };

  const focusStyle = {
    borderColor: isDark ? "#666" : "#ff8c69",
    boxShadow: `0 0 0 3px ${
      isDark ? "rgba(255,255,255,0.1)" : "rgba(255,140,105,0.2)"
    }`,
    backgroundColor: isDark ? "#4a4a4a" : "#fff5f0",
  };

  return (
    <div
      style={{
        background: colors.background,
        minHeight: "calc(100vh - 80px)",
        padding: "40px 0",
        transition: "all 0.3s ease",
      }}
    >
      <Container>
        {/* Alert */}
        {showAlert.show && (
          <Alert
            variant={showAlert.type}
            dismissible
            onClose={() => setShowAlert({ show: false, message: "", type: "" })}
            style={{
              animation: "slideInDown 0.5s ease-out",
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
          >
            {showAlert.message}
          </Alert>
        )}

        {/* Header */}
        <div className="text-center mb-5">
          <h1
            className="display-5 fw-bold mb-3"
            style={{
              color: colors.text,
              textShadow: isDark
                ? "0 0 20px rgba(255,255,255,0.3)"
                : "0 4px 8px rgba(0,0,0,0.1)",
              animation: "fadeInDown 1s ease-out",
            }}
          >
            Add New Car
          </h1>
          <p
            className="lead"
            style={{
              color: colors.textSecondary,
              animation: "fadeInUp 1s ease-out 0.2s both",
            }}
          >
            Add a new vehicle to your fleet
          </p>
        </div>

        {/* Back Button */}
        <BackToDashBoard />

        {/* Default Cars Dropdown */}
        {defaultCars.length > 0 && (
          <Card
            className="border-0 shadow-sm mb-4"
            style={{
              background: colors.cardBackground,
              borderRadius: "15px",
              animation: "slideInUp 0.8s ease-out 0.2s both",
            }}
          >
            <Card.Body className="p-4">
              <h5 className="mb-3 fw-bold" style={{ color: colors.text }}>
                📥 Import Default Car Data
              </h5>
              <Form.Group>
                <Form.Select
                  onChange={handleDefaultCarSelect}
                  style={inputStyle}
                >
                  <option value="">Select a car to import data...</option>
                  {defaultCars.map((car) => (
                    <option key={car.carid} value={car.carName}>
                      {car.brand} {car.carName} - ₹{car.pricePerDay}/day
                    </option>
                  ))}
                </Form.Select>
                <Form.Text style={{ color: colors.textSecondary }}>
                  Select a car to auto-fill fields. You’ll still need to set{" "}
                  <b>count</b> and <b>city</b>.
                </Form.Text>
              </Form.Group>
            </Card.Body>
          </Card>
        )}

        {/* Form Card */}
        <Card
          className="border-0 shadow-lg"
          style={{
            background: colors.cardBackground,
            borderRadius: "20px",
            animation: "slideInUp 0.8s ease-out 0.4s both",
            overflow: "hidden",
          }}
        >
          <Card.Body className="p-4 p-md-5">
            <Form onSubmit={handleSubmit}>
              {/* Basic Information Section */}
              <div
                className="mb-5"
                style={{
                  borderBottom: `2px solid ${isDark ? "#404040" : "#f0f0f0"}`,
                  paddingBottom: "2rem",
                }}
              >
                <h4
                  className="mb-4 fw-bold"
                  style={{
                    color: colors.text,
                    fontSize: "1.5rem",
                  }}
                >
                  📋 Basic Information
                </h4>

                <Row className="g-3 g-md-4">
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        className="fw-semibold mb-2"
                        style={{ color: colors.text, fontSize: "1.1rem" }}
                      >
                        Car Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="carName"
                        value={formData.carName}
                        onChange={handleChange}
                        required
                        placeholder="Enter car name (e.g., Tata Nexon)"
                        style={inputStyle}
                        onFocus={(e) =>
                          Object.assign(e.target.style, focusStyle)
                        }
                        onBlur={(e) =>
                          Object.assign(e.target.style, inputStyle)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        className="fw-semibold mb-2"
                        style={{ color: colors.text, fontSize: "1.1rem" }}
                      >
                        Brand
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                        placeholder="Enter brand (e.g., Tata, Maruti)"
                        style={inputStyle}
                        onFocus={(e) =>
                          Object.assign(e.target.style, focusStyle)
                        }
                        onBlur={(e) =>
                          Object.assign(e.target.style, inputStyle)
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-3 g-md-4">
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        className="fw-semibold mb-2"
                        style={{ color: colors.text, fontSize: "1.1rem" }}
                      >
                        Price Per Day (₹)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="pricePerDay"
                        value={formData.pricePerDay}
                        onChange={handleChange}
                        required
                        placeholder="1900"
                        min="1"
                        style={inputStyle}
                        onFocus={(e) =>
                          Object.assign(e.target.style, focusStyle)
                        }
                        onBlur={(e) =>
                          Object.assign(e.target.style, inputStyle)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        className="fw-semibold mb-2"
                        style={{ color: colors.text, fontSize: "1.1rem" }}
                      >
                        Available Count
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="count"
                        value={formData.count}
                        onChange={handleChange}
                        required
                        placeholder="6"
                        min="1"
                        style={inputStyle}
                        onFocus={(e) =>
                          Object.assign(e.target.style, focusStyle)
                        }
                        onBlur={(e) =>
                          Object.assign(e.target.style, inputStyle)
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-3 g-md-4">
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        className="fw-semibold mb-2"
                        style={{ color: colors.text, fontSize: "1.1rem" }}
                      >
                        Select City
                      </Form.Label>
                      <Form.Select
                        name="cityId"
                        value={formData.cityId}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                        onFocus={(e) =>
                          Object.assign(e.target.style, focusStyle)
                        }
                        onBlur={(e) =>
                          Object.assign(e.target.style, inputStyle)
                        }
                      >
                        <option value="">Choose City</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.cityName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        className="fw-semibold mb-2"
                        style={{ color: colors.text, fontSize: "1.1rem" }}
                      >
                        Details
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        required
                        placeholder="Enter car details and features..."
                        style={inputStyle}
                        onFocus={(e) =>
                          Object.assign(e.target.style, focusStyle)
                        }
                        onBlur={(e) =>
                          Object.assign(e.target.style, inputStyle)
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Specifications Section */}
              <div className="mb-5">
                <h4
                  className="mb-4 fw-bold"
                  style={{
                    color: colors.text,
                    fontSize: "1.5rem",
                  }}
                >
                  ⚙️ Technical Specifications
                </h4>

                <Row className="g-3 g-md-4">
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        className="fw-semibold mb-2"
                        style={{ color: colors.text, fontSize: "1.1rem" }}
                      >
                        Engine
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="engine"
                        value={formData.specifications.engine}
                        onChange={handleChange}
                        placeholder="1.2L Revotron Petrol"
                        style={inputStyle}
                        onFocus={(e) =>
                          Object.assign(e.target.style, focusStyle)
                        }
                        onBlur={(e) =>
                          Object.assign(e.target.style, inputStyle)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        className="fw-semibold mb-2"
                        style={{ color: colors.text, fontSize: "1.1rem" }}
                      >
                        CC (Cubic Capacity)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="cc"
                        value={formData.specifications.cc}
                        onChange={handleChange}
                        placeholder="1199"
                        min="1"
                        style={inputStyle}
                        onFocus={(e) =>
                          Object.assign(e.target.style, focusStyle)
                        }
                        onBlur={(e) =>
                          Object.assign(e.target.style, inputStyle)
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-3 g-md-4">
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        className="fw-semibold mb-2"
                        style={{ color: colors.text, fontSize: "1.1rem" }}
                      >
                        Transmission
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="transmission"
                        value={formData.specifications.transmission}
                        onChange={handleChange}
                        placeholder="Manual/AMT/Automatic"
                        style={inputStyle}
                        onFocus={(e) =>
                          Object.assign(e.target.style, focusStyle)
                        }
                        onBlur={(e) =>
                          Object.assign(e.target.style, inputStyle)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        className="fw-semibold mb-2"
                        style={{ color: colors.text, fontSize: "1.1rem" }}
                      >
                        Seating Capacity
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="seatingCapacity"
                        value={formData.specifications.seatingCapacity}
                        onChange={handleChange}
                        placeholder="5"
                        min="1"
                        max="12"
                        style={inputStyle}
                        onFocus={(e) =>
                          Object.assign(e.target.style, focusStyle)
                        }
                        onBlur={(e) =>
                          Object.assign(e.target.style, inputStyle)
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-3 g-md-4">
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        className="fw-semibold mb-2"
                        style={{ color: colors.text, fontSize: "1.1rem" }}
                      >
                        Fuel Type
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="fuelType"
                        value={formData.specifications.fuelType}
                        onChange={handleChange}
                        placeholder="Petrol/Diesel/Electric/Hybrid"
                        style={inputStyle}
                        onFocus={(e) =>
                          Object.assign(e.target.style, focusStyle)
                        }
                        onBlur={(e) =>
                          Object.assign(e.target.style, inputStyle)
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Submit Section */}
              <div className="text-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: colors.button.success,
                    border: "none",
                    borderRadius: "25px",
                    padding: "15px 40px",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#ffffff",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                    transition: "all 0.3s ease",
                    minWidth: "200px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = "translateY(-3px)";
                      e.target.style.boxShadow = "0 12px 25px rgba(0,0,0,0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
                    }
                  }}
                >
                  {isSubmitting ? "🔄 Adding Car..." : "Add Car to Fleet"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default AddCarPage;
