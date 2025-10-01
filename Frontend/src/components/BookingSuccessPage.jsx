import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useTheme } from "../contexts/ThemeContext";

const BookingSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors, isDark } = useTheme();
  const booking = location.state?.booking;

  useEffect(() => {
    if (!booking) {
      navigate("/home");
    }
  }, [booking, navigate]);

  if (!booking) return null;

  const duration = Math.ceil(
    (new Date(booking.endDate) - new Date(booking.startDate)) /
      (1000 * 60 * 60 * 24)
  );

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
        <Row className="justify-content-center">
          <Col lg={8}>
            {/* Success Animation */}
            <div className="text-center mb-4">
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  background: colors.button.success,
                  borderRadius: "50%",
                  margin: "0 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "4rem",
                  animation: "scaleIn 0.5s ease",
                }}
              >
                ✓
              </div>
            </div>

            {/* Success Message */}
            <Card
              className="border-0 shadow-lg text-center mb-4"
              style={{
                background: colors.cardBackground,
                borderRadius: "20px",
              }}
            >
              <Card.Body className="p-5">
                <h1
                  className="mb-3"
                  style={{ color: colors.text, fontWeight: "bold" }}
                >
                  Booking Confirmed!
                </h1>
                <p
                  style={{
                    color: colors.textSecondary,
                    fontSize: "1.2rem",
                    marginBottom: "2rem",
                  }}
                >
                  Your car rental has been successfully confirmed. We've sent the
                  details to your email.
                </p>

                {/* Booking Reference */}
                <div
                  style={{
                    background: isDark ? "#404040" : "#f8f9fa",
                    padding: "20px",
                    borderRadius: "15px",
                    marginBottom: "2rem",
                  }}
                >
                  <small style={{ color: colors.textSecondary }}>
                    Booking Reference
                  </small>
                  <h2
                    style={{
                      color: colors.text,
                      fontWeight: "bold",
                      letterSpacing: "2px",
                      marginTop: "5px",
                    }}
                  >
                    #{booking.bookingId}
                  </h2>
                </div>
              </Card.Body>
            </Card>

            {/* Booking Details Card */}
            <Card
              className="border-0 shadow-lg mb-4"
              style={{
                background: colors.cardBackground,
                borderRadius: "20px",
              }}
            >
              <Card.Body className="p-4">
                <h4 className="mb-4" style={{ color: colors.text }}>
                  Booking Details
                </h4>

                {/* Car Info */}
                <div
                  className="mb-4 p-3"
                  style={{
                    background: isDark ? "#404040" : "#f8f9fa",
                    borderRadius: "12px",
                  }}
                >
                  <Row>
                    <Col md={8}>
                      <h5
                        className="text-capitalize mb-1"
                        style={{ color: colors.text, fontWeight: "600" }}
                      >
                        {booking.brand} {booking.carName}
                      </h5>
                      <p className="mb-0" style={{ color: colors.textSecondary }}>
                        Car ID: #{booking.carId}
                      </p>
                    </Col>
                    <Col md={4} className="text-end">
                      <div
                        style={{
                          background: colors.button.success,
                          color: "white",
                          padding: "8px 16px",
                          borderRadius: "20px",
                          display: "inline-block",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        {booking.status}
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Rental Period */}
                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <div
                      className="p-3"
                      style={{
                        background: isDark ? "#404040" : "#f8f9fa",
                        borderRadius: "12px",
                      }}
                    >
                      <small style={{ color: colors.textSecondary }}>
                        Pick-up Date
                      </small>
                      <div
                        style={{
                          color: colors.text,
                          fontWeight: "600",
                          fontSize: "1.1rem",
                          marginTop: "5px",
                        }}
                      >
                        {new Date(booking.startDate).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div
                      className="p-3"
                      style={{
                        background: isDark ? "#404040" : "#f8f9fa",
                        borderRadius: "12px",
                      }}
                    >
                      <small style={{ color: colors.textSecondary }}>
                        Drop-off Date
                      </small>
                      <div
                        style={{
                          color: colors.text,
                          fontWeight: "600",
                          fontSize: "1.1rem",
                          marginTop: "5px",
                        }}
                      >
                        {new Date(booking.endDate).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Duration & Price */}
                <Row className="g-3">
                  <Col md={6}>
                    <div
                      className="p-3"
                      style={{
                        background: isDark ? "#404040" : "#f8f9fa",
                        borderRadius: "12px",
                      }}
                    >
                      <small style={{ color: colors.textSecondary }}>
                        Total Duration
                      </small>
                      <div
                        style={{
                          color: colors.text,
                          fontWeight: "600",
                          fontSize: "1.1rem",
                          marginTop: "5px",
                        }}
                      >
                        {duration} {duration === 1 ? "day" : "days"}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div
                      className="p-3"
                      style={{
                        background: isDark ? "#404040" : "#f8f9fa",
                        borderRadius: "12px",
                      }}
                    >
                      <small style={{ color: colors.textSecondary }}>
                        Amount Paid
                      </small>
                      <div
                        style={{
                          color: colors.text,
                          fontWeight: "600",
                          fontSize: "1.3rem",
                          marginTop: "5px",
                        }}
                      >
                        ₹{(booking.totalPrice * 1.18).toFixed(2)}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Next Steps Card */}
            <Card
              className="border-0 shadow-lg mb-4"
              style={{
                background: colors.cardBackground,
                borderRadius: "20px",
              }}
            >
              <Card.Body className="p-4">
                <h4 className="mb-4" style={{ color: colors.text }}>
                  What's Next?
                </h4>

                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-start">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        background: colors.button.primary,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                        marginRight: "15px",
                        flexShrink: 0,
                      }}
                    >
                      📧
                    </div>
                    <div>
                      <h6 style={{ color: colors.text, marginBottom: "5px" }}>
                        Check Your Email
                      </h6>
                      <p
                        style={{
                          color: colors.textSecondary,
                          marginBottom: 0,
                          fontSize: "0.95rem",
                        }}
                      >
                        We've sent a confirmation email with all the booking details
                        and pickup instructions.
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        background: colors.button.primary,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                        marginRight: "15px",
                        flexShrink: 0,
                      }}
                    >
                      🪪
                    </div>
                    <div>
                      <h6 style={{ color: colors.text, marginBottom: "5px" }}>
                        Bring Valid Documents
                      </h6>
                      <p
                        style={{
                          color: colors.textSecondary,
                          marginBottom: 0,
                          fontSize: "0.95rem",
                        }}
                      >
                        Please carry your driving license, Aadhar card, and this
                        booking confirmation when picking up the car.
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        background: colors.button.primary,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                        marginRight: "15px",
                        flexShrink: 0,
                      }}
                    >
                      📞
                    </div>
                    <div>
                      <h6 style={{ color: colors.text, marginBottom: "5px" }}>
                        Need Help?
                      </h6>
                      <p
                        style={{
                          color: colors.textSecondary,
                          marginBottom: 0,
                          fontSize: "0.95rem",
                        }}
                      >
                        Contact our support team at +91 1800-123-4567 for any
                        queries or assistance.
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Action Buttons */}
            <Row className="g-3">
              <Col md={6}>
                <Button
                  onClick={() => navigate("/home")}
                  style={{
                    width: "100%",
                    background: colors.button.primary,
                    border: "none",
                    borderRadius: "12px",
                    padding: "15px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                  }}
                >
                  Book Another Car
                </Button>
              </Col>
              <Col md={6}>
                <Button
                  onClick={() => navigate("/profile")}
                  variant="outline-primary"
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    padding: "15px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    borderColor: colors.button.primary,
                    color: colors.text,
                  }}
                >
                  View My Bookings
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingSuccessPage;