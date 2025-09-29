import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useTheme } from "../contexts/ThemeContext";

const CarViewPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { isDark, colors } = useTheme();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    fetchCarDetails();
  }, [carId]);

  const fetchCarDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/cars/public/${carId}`
      );
      if (response.ok) {
        const data = await response.json();
        setCar(data);
      } else {
        setShowAlert({
          show: true,
          message: "Car not found!",
          type: "danger",
        });
      }
    } catch (error) {
      console.error("Error fetching car details:", error);
      setShowAlert({
        show: true,
        message: "Failed to load car details!",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRentCar = () => {
    // For now, just show a success message
    setShowAlert({
      show: true,
      message: "Rent functionality will be implemented soon!",
      type: "info",
    });
  };

  const nextImage = () => {
    if (car?.images && car.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
    }
  };

  const prevImage = () => {
    if (car?.images && car.images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + car.images.length) % car.images.length
      );
    }
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
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
              color: isDark ? "#ffffff" : "#ff8c69",
            }}
          />
          <p className="mt-3 fs-5" style={{ color: colors.text }}>
            Loading car details...
          </p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div
        style={{
          background: colors.background,
          minHeight: "calc(100vh - 80px)",
          padding: "40px 0",
        }}
      >
        <Container>
          <Card
            className="border-0 shadow-lg text-center"
            style={{
              background: colors.cardBackground,
              borderRadius: "20px",
              padding: "60px 20px",
            }}
          >
            <h3 style={{ color: colors.text }}>Car Not Found</h3>
            <p style={{ color: colors.textSecondary }}>
              The requested car could not be found.
            </p>
            <Button
              onClick={() => navigate("/home")}
              style={{
                background: colors.button.primary,
                border: "none",
                borderRadius: "25px",
                padding: "12px 24px",
              }}
            >
              Back to Home
            </Button>
          </Card>
        </Container>
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
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
              marginBottom: "2rem",
            }}
          >
            {showAlert.message}
          </Alert>
        )}

        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          style={{
            background: colors.button.secondary,
            border: "none",
            borderRadius: "10px",
            padding: "8px 16px",
            marginBottom: "2rem",
          }}
        >
          ← Back
        </Button>

        <Row className="g-4">
          {/* Image Gallery */}
          <Col lg={7}>
            <Card
              className="border-0 shadow-lg"
              style={{
                background: colors.cardBackground,
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              {/* Main Image */}
              <div
                style={{
                  height: "400px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {car.images && car.images.length > 0 ? (
                  <>
                    <img
                      src={`/images/${car.brand}/${car.carName}/${car.images[currentImageIndex]}`}
                      alt={`${car.brand} ${car.carName}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y4ZjlmYSIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2YzY5NzUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlIG5vdCBmb3VuZDwvdGV4dD4KPC9zdmc+";
                      }}
                    />

                    {/* Navigation Arrows */}
                    {car.images.length > 1 && (
                      <>
                        <Button
                          onClick={prevImage}
                          style={{
                            position: "absolute",
                            left: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "rgba(0,0,0,0.5)",
                            border: "none",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            color: "white",
                            fontSize: "1.2rem",
                          }}
                        >
                          ‹
                        </Button>
                        <Button
                          onClick={nextImage}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "rgba(0,0,0,0.5)",
                            border: "none",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            color: "white",
                            fontSize: "1.2rem",
                          }}
                        >
                          ›
                        </Button>
                      </>
                    )}

                    {/* Status Badge */}
                    <Badge
                      style={{
                        position: "absolute",
                        top: "15px",
                        right: "15px",
                        background:
                          car.count > 0
                            ? colors.button.success
                            : colors.button.danger,
                        padding: "8px 12px",
                        borderRadius: "20px",
                        fontSize: "0.9rem",
                      }}
                    >
                      {car.count > 0
                        ? `${car.count} Available`
                        : "Out of Stock"}
                    </Badge>
                  </>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      fontSize: "6rem",
                      color: colors.textSecondary,
                    }}
                  >
                    🚗
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {car.images && car.images.length > 1 && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    padding: "15px",
                    overflowX: "auto",
                  }}
                >
                  {car.images.map((image, index) => (
                    <img
                      key={index}
                      src={`/images/${car.brand}/${car.carName}/${image}`}
                      alt={`${car.brand} ${car.carName} - ${index + 1}`}
                      onClick={() => selectImage(index)}
                      style={{
                        width: "80px",
                        height: "60px",
                        objectFit: "contain",
                        borderRadius: "8px",
                        cursor: "pointer",
                        border:
                          index === currentImageIndex
                            ? `3px solid ${
                                colors.button.primary
                                  .split(",")[0]
                                  .split("(")[1]
                              }`
                            : "2px solid transparent",
                        transition: "all 0.3s ease",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ))}
                </div>
              )}
            </Card>
          </Col>

          {/* Car Details */}
          <Col lg={5}>
            <Card
              className="border-0 shadow-lg"
              style={{
                background: colors.cardBackground,
                borderRadius: "20px",
              }}
            >
              <Card.Body className="p-4">
                {/* Car Name and Brand */}
                <div className="mb-4">
                  <h1
                    className="mb-2 text-capitalize fw-bold"
                    style={{ color: colors.text, fontSize: "2rem" }}
                  >
                    {car.brand} {car.carName}
                  </h1>
                  <p
                    style={{ color: colors.textSecondary, fontSize: "1.1rem" }}
                  >
                    📍 {car.cityName}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <h2
                    style={{
                      color: colors.text,
                      fontSize: "2.5rem",
                      fontWeight: "bold",
                    }}
                  >
                    ₹{car.pricePerDay}
                    <span
                      style={{
                        fontSize: "1rem",
                        color: colors.textSecondary,
                        fontWeight: "normal",
                      }}
                    >
                      /day
                    </span>
                  </h2>
                </div>

                {/* Details */}
                <div className="mb-4">
                  <h5 style={{ color: colors.text, marginBottom: "15px" }}>
                    Description
                  </h5>
                  <p
                    style={{
                      color: colors.textSecondary,
                      lineHeight: "1.6",
                      fontSize: "1rem",
                    }}
                  >
                    {car.details}
                  </p>
                </div>

                {/* Specifications */}
                <div className="mb-4">
                  <h5 style={{ color: colors.text, marginBottom: "15px" }}>
                    Specifications
                  </h5>
                  <Row className="g-3">
                    <Col xs={6}>
                      <div
                        style={{
                          background: isDark ? "#404040" : "#f8f9fa",
                          padding: "12px",
                          borderRadius: "10px",
                        }}
                      >
                        <small
                          style={{
                            color: colors.textSecondary,
                            fontSize: "0.8rem",
                          }}
                        >
                          ENGINE
                        </small>
                        <div
                          style={{
                            color: colors.text,
                            fontWeight: "600",
                            fontSize: "0.9rem",
                          }}
                        >
                          {car.specifications?.engine || "N/A"}
                        </div>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div
                        style={{
                          background: isDark ? "#404040" : "#f8f9fa",
                          padding: "12px",
                          borderRadius: "10px",
                        }}
                      >
                        <small
                          style={{
                            color: colors.textSecondary,
                            fontSize: "0.8rem",
                          }}
                        >
                          TRANSMISSION
                        </small>
                        <div
                          style={{
                            color: colors.text,
                            fontWeight: "600",
                            fontSize: "0.9rem",
                          }}
                        >
                          {car.specifications?.transmission || "N/A"}
                        </div>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div
                        style={{
                          background: isDark ? "#404040" : "#f8f9fa",
                          padding: "12px",
                          borderRadius: "10px",
                        }}
                      >
                        <small
                          style={{
                            color: colors.textSecondary,
                            fontSize: "0.8rem",
                          }}
                        >
                          SEATS
                        </small>
                        <div
                          style={{
                            color: colors.text,
                            fontWeight: "600",
                            fontSize: "0.9rem",
                          }}
                        >
                          {car.specifications?.seatingCapacity || "N/A"}
                        </div>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div
                        style={{
                          background: isDark ? "#404040" : "#f8f9fa",
                          padding: "12px",
                          borderRadius: "10px",
                        }}
                      >
                        <small
                          style={{
                            color: colors.textSecondary,
                            fontSize: "0.8rem",
                          }}
                        >
                          FUEL TYPE
                        </small>
                        <div
                          style={{
                            color: colors.text,
                            fontWeight: "600",
                            fontSize: "0.9rem",
                          }}
                        >
                          {car.specifications?.fuelType || "N/A"}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Rent Button */}
                <Button
                  onClick={handleRentCar}
                  disabled={car.count === 0}
                  style={{
                    width: "100%",
                    background:
                      car.count > 0
                        ? colors.button.primary
                        : colors.button.secondary,
                    border: "none",
                    borderRadius: "15px",
                    padding: "15px",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (car.count > 0) {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (car.count > 0) {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                >
                  {car.count > 0 ? "🚗 Rent This Car" : "❌ Out of Stock"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CarViewPage;
