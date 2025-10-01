import { useNavigate, useParams, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const car = location.state?.car;

  const [formData, setFormData] = useState(() => ({
    ...car,
    cityId: car?.city?.id || car?.cityId,
    cityName: car?.city?.cityName || car?.cityName,
  }));

  const { isDark, colors } = useTheme();
  const { getAuthHeaders } = useAuth();
  const { cities, loading: citiesLoading } = useCars();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [carLoading, setCarLoading] = useState(false);
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if this field belongs to specifications
    const specificationFields = [
      "engine",
      "cc",
      "transmission",
      "seatingCapacity",
      "fuelType",
    ];

    if (specificationFields.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = `http://localhost:8080/admin/cars/${carId}`;

      // Prepare the payload with cityId instead of city object
      const payload = {
        id: formData.id,
        carName: formData.carName,
        pricePerDay: parseFloat(formData.pricePerDay),
        details: formData.details,
        count: parseInt(formData.count),
        brand: formData.brand,
        cityId: formData.cityId, // Send cityId only
        specifications: {
          id: formData.specifications.id,
          engine: formData.specifications.engine,
          cc: parseInt(formData.specifications.cc),
          transmission: formData.specifications.transmission,
          seatingCapacity: parseInt(formData.specifications.seatingCapacity),
          fuelType: formData.specifications.fuelType,
        },
        images: formData.images,
      };

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowAlert({
          show: true,
          message: "Car updated successfully! Redirecting...",
          type: "success",
        });
        setTimeout(() => navigate("/admin/list-car"), 1000);
      } else {
        const errorData = await response.text();
        console.error("Error response:", errorData);
        setShowAlert({
          show: true,
          message: `Failed to update car! ${errorData}`,
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

  if (!car) {
    return (
      <Container>
        <Alert variant="danger" className="mt-4">
          <h5>Error</h5>
          <p>No car data found. Please select a car from the list.</p>
          <Button
            variant="outline-danger"
            onClick={() => navigate("/admin/list-car")}
          >
            Go Back to List
          </Button>
        </Alert>
      </Container>
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
                        min="0"
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
                      />
                      <Form.Text style={{ color: colors.textSecondary }}>
                        City cannot be changed after creation
                      </Form.Text>
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
                      Updating...
                    </>
                  ) : (
                    "Update Car"
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
