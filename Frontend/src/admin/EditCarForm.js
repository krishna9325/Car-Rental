import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useTheme } from "../contexts/ThemeContext";
import { useCars } from "../contexts/CarsContext";
import BackToDashBoard from "../components/BackToDashBoard";
import { useAuth } from "../contexts/AuthContext";

function EditCarForm() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { isDark, colors } = useTheme();
  const { getAuthHeaders } = useAuth();
  const { cities, loading: citiesLoading } = useCars();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [carLoading, setCarLoading] = useState(false);
  const [defaultCars, setDefaultCars] = useState([]);
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [formData, setFormData] = useState({
    id: "",
    carName: "",
    pricePerDay: "",
    details: "",
    count: "",
    brand: "",
    cityId: "",
    cityName: "", // added for display
    specifications: {
      id: "",
      engine: "",
      cc: "",
      transmission: "",
      seatingCapacity: "",
      fuelType: "",
    },
    images: ["0.jpg", "1.jpg", "2.jpg", "3.jpg"],
  });

  // Check if we're editing an existing car
  useEffect(() => {
    if (carId && carId !== "new") {
      setIsEditing(true);
      fetchCarData(carId);
    }
  }, [carId]);

  // Fetch specific car data for editing
  const fetchCarData = async (id) => {
    setCarLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/admin/cars/${id}`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const carData = await response.json();
        console.log("carData: ", carData);

        setFormData({
          ...carData,
          cityId: carData.city.id,
          cityName: carData.city.cityName,
        });

        console.log("formData: ", formData);
      } else {
        setShowAlert({
          show: true,
          message: "Failed to load car data",
          type: "danger",
        });
      }
    } catch (error) {
      console.error("Error fetching car:", error);
      setShowAlert({
        show: true,
        message: "Error loading car data",
        type: "danger",
      });
    } finally {
      setCarLoading(false);
    }
  };

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
        count: "",
        cityId: "",
        cityName: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = `http://localhost:8080/admin/cars/${carId}`;

      const method = "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowAlert({
          show: true,
          message: "Car updated successfully! Redirecting...",
          type: "success",
        });
        setTimeout(() => navigate("/admin/list-car"), 1000);
      } else {
        setShowAlert({
          show: true,
          message: "Failed to update car! Please try again.",
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

  if (citiesLoading || carLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          background: colors.background,
          minHeight: "calc(100vh - 80px)",
          transition: "all 0.3s ease",
        }}
      >
        <div className="text-center">
          <Spinner
            animation="border"
            style={{
              width: "4rem",
              height: "4rem",
              color: colors.text,
            }}
          />
          <p className="mt-3 fs-5" style={{ color: colors.text }}>
            {carLoading ? "Loading car data..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

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
            Edit Car
          </h1>
          <p
            className="lead"
            style={{
              color: colors.textSecondary,
              animation: "fadeInUp 1s ease-out 0.2s both",
            }}
          >
            {" "}
            Update vehicle information
          </p>
        </div>

        {/* Back Button */}
        <BackToDashBoard path="/admin/list-car" />

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
                  style={{ color: colors.text, fontSize: "1.5rem" }}
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
                        City
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="cityName"
                        value={formData.cityName}
                        disabled
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

              {/* Technical Specifications Section */}
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
                        placeholder="Petrol/Diesel/CNG/Electric"
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

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-3"
                  style={{
                    background: colors.button.primary,
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Saving...
                    </>
                  ) : isEditing ? (
                    "Update Car"
                  ) : (
                    "Add Car"
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default EditCarForm;
