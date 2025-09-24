import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
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

function AddCity() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cities } = location.state || { cities: [] };
  const { isDark, colors } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [formData, setFormData] = useState({
    cityName: "",
    pinCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log(formData.pinCode);
      const cityExists = cities.some(
        (city) => city.pinCode === Number(formData.pinCode)
      );

      if (cityExists) {
        setShowAlert({
          show: true,
          message: "City already exists!",
          type: "danger",
        });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("http://localhost:8080/admin/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowAlert({
          show: true,
          message: "City added successfully! Redirecting...",
          type: "success",
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setShowAlert({
          show: true,
          message: "Failed to add city! Please try again.",
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
            Add New City
          </h1>
          <p
            className="lead"
            style={{
              color: colors.textSecondary,
              animation: "fadeInUp 1s ease-out 0.2s both",
            }}
          >
            Add a new City to your fleet
          </p>
        </div>

        {/* Back Button */}
        <BackToDashBoard />

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
                        City Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="cityName"
                        value={formData.cityName}
                        onChange={handleChange}
                        required
                        placeholder="Enter city name"
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
                        Pincode
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleChange}
                        required
                        placeholder="Enter pincode"
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
                  {isSubmitting ? "🔄 Adding City..." : "Add City to Fleet"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default AddCity;
