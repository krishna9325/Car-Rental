import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
  Alert,
  Badge,
  ProgressBar,
} from "react-bootstrap";
import { useTheme } from "../contexts/ThemeContext";

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, colors } = useTheme();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);
  const [processing, setProcessing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const fetchBookingDetails = useCallback(async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));
      const storedToken = localStorage.getItem("token");
      const userId = storedUser?.id;

      if (!userId || !storedToken) {
        setShowAlert({
          show: true,
          message: "Please login to view bookings",
          type: "warning",
        });
        navigate("/login");
        return;
      }

    const response = await fetch(
        `http://localhost:8080/user/bookings/booking/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

    if (response.ok) {
      const data = await response.json();
      setBooking(data);
      
      // Calculate actual remaining time based on deadline
      if (data.paymentDeadline) {
        const now = new Date();
        const deadline = new Date(data.paymentDeadline);
        const remainingMs = deadline - now;
        const remainingSecs = Math.max(0, Math.floor(remainingMs / 1000));
        
        setTimeRemaining(remainingSecs);
        
        // If already expired, show message
        if (remainingSecs <= 0) {
          setShowAlert({
            show: true,
            message: "Payment deadline has expired!",
            type: "danger",
          });
          setTimeout(() => navigate("/profile"), 3000);
        }
      }
    } else {
      setShowAlert({
        show: true,
        message: "Booking not found!",
        type: "danger",
      });
      setTimeout(() => navigate("/home"), 2000);
    }
  } catch (error) {
    console.error("Error fetching booking:", error);
    setShowAlert({
      show: true,
      message: "Failed to load booking details!",
      type: "danger",
    });
  } finally {
    setLoading(false);
  }
}, [bookingId, navigate]);

useEffect(() => {
  if (!booking) {
    fetchBookingDetails();
  } else if (booking.paymentDeadline) {
    // Calculate remaining time when component mounts with existing booking
    const now = new Date();
    const deadline = new Date(booking.paymentDeadline);
    const remainingMs = deadline - now;
    const remainingSecs = Math.max(0, Math.floor(remainingMs / 1000));
    
    setTimeRemaining(remainingSecs);
    
    if (remainingSecs <= 0) {
      setShowAlert({
        show: true,
        message: "Payment deadline has expired!",
        type: "danger",
      });
      setTimeout(() => navigate("/profile"), 3000);
    }
  }
}, [booking, fetchBookingDetails, navigate]);

  useEffect(() => {
    if (!booking) {
      fetchBookingDetails();
    } else if (booking.remainingSeconds) {
      setTimeRemaining(booking.remainingSeconds);
    }
  }, [booking, fetchBookingDetails]);

  // Countdown timer
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowAlert({
            show: true,
            message: "Payment time expired! Booking cancelled.",
            type: "danger",
          });
          setTimeout(() => navigate("/home"), 3000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCardInput = (field, value) => {
    let formattedValue = value;

    if (field === "cardNumber") {
      // Remove non-digits and format as XXXX XXXX XXXX XXXX
      formattedValue = value.replace(/\D/g, "").slice(0, 16);
      formattedValue = formattedValue.match(/.{1,4}/g)?.join(" ") || formattedValue;
    } else if (field === "expiryDate") {
      // Format as MM/YY
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
      if (formattedValue.length >= 3) {
        formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2);
      }
    } else if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setCardDetails((prev) => ({ ...prev, [field]: formattedValue }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    // Validate card details
    if (paymentMethod === "card") {
      if (
        !cardDetails.cardNumber ||
        cardDetails.cardNumber.replace(/\s/g, "").length !== 16
      ) {
        setShowAlert({
          show: true,
          message: "Please enter a valid 16-digit card number",
          type: "warning",
        });
        return;
      }
      if (!cardDetails.cardName) {
        setShowAlert({
          show: true,
          message: "Please enter cardholder name",
          type: "warning",
        });
        return;
      }
      if (!cardDetails.expiryDate || cardDetails.expiryDate.length !== 5) {
        setShowAlert({
          show: true,
          message: "Please enter valid expiry date (MM/YY)",
          type: "warning",
        });
        return;
      }
      if (!cardDetails.cvv || cardDetails.cvv.length !== 3) {
        setShowAlert({
          show: true,
          message: "Please enter valid 3-digit CVV",
          type: "warning",
        });
        return;
      }
    }

    setProcessing(true);
    setShowAlert({ show: false, message: "", type: "" });

    try {
         const storedUser = JSON.parse(localStorage.getItem("user"));
      const storedToken = localStorage.getItem("token");
      const userId = storedUser?.id;

      if (!userId || !storedToken) {
        setShowAlert({
          show: true,
          message: "Please login to view bookings",
          type: "warning",
        });
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:8080/user/bookings/payment",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: booking.bookingId,
            paymentMethod: paymentMethod,
            amount: booking.totalPrice,
          }),
        }
      );

      if (response.ok) {
        const confirmedBooking = await response.json();
        setShowAlert({
          show: true,
          message: "Payment successful! Redirecting to confirmation...",
          type: "success",
        });
        setTimeout(() => {
          navigate("/booking-success", {
            state: { booking: confirmedBooking },
          });
        }, 2000);
      } else {
        const error = await response.json();
        setShowAlert({
          show: true,
          message: error.message || "Payment failed. Please try again.",
          type: "danger",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      setShowAlert({
        show: true,
        message: "Payment processing failed. Please try again.",
        type: "danger",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          background: colors.background,
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <Spinner
          animation="border"
          style={{ width: "4rem", height: "4rem", color: colors.text }}
        />
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ background: colors.background, minHeight: "calc(100vh - 80px)", padding: "40px 0" }}>
        <Container>
          <Card className="text-center p-5" style={{ background: colors.cardBackground }}>
            <h3 style={{ color: colors.text }}>Booking Not Found</h3>
            <Button onClick={() => navigate("/home")} className="mt-3">
              Back to Home
            </Button>
          </Card>
        </Container>
      </div>
    );
  }

  const timePercentage = booking.remainingSeconds
    ? (timeRemaining / booking.remainingSeconds) * 100
    : 0;

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
              marginBottom: "2rem",
            }}
          >
            {showAlert.message}
          </Alert>
        )}

        {/* Timer Warning */}
        {timeRemaining > 0 && (
          <Card
            className="border-0 shadow-lg mb-4"
            style={{
              background: timeRemaining < 60 ? "#ff6b6b" : colors.button.warning,
              borderRadius: "15px",
            }}
          >
            <Card.Body className="p-3">
              <Row className="align-items-center">
                <Col md={8}>
                  <h6 className="mb-2 text-white">
                    ⏰ Complete payment within: <strong>{formatTime(timeRemaining)}</strong>
                  </h6>
                  <ProgressBar
                    now={timePercentage}
                    variant={timeRemaining < 60 ? "danger" : "warning"}
                    style={{ height: "8px" }}
                  />
                </Col>
                <Col md={4} className="text-end">
                  <Badge
                    bg={timeRemaining < 60 ? "danger" : "warning"}
                    style={{ fontSize: "1.2rem", padding: "10px 20px" }}
                  >
                    {formatTime(timeRemaining)}
                  </Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        <Row className="g-4">
          {/* Payment Form */}
          <Col lg={7}>
            <Card
              className="border-0 shadow-lg"
              style={{
                background: colors.cardBackground,
                borderRadius: "20px",
              }}
            >
              <Card.Body className="p-4">
                <h4 className="mb-4" style={{ color: colors.text }}>
                  💳 Payment Details
                </h4>

                <Form onSubmit={handlePayment}>
                  {/* Payment Method Selection */}
                  <Form.Group className="mb-4">
                    <Form.Label style={{ color: colors.text, fontWeight: "500" }}>
                      Select Payment Method
                    </Form.Label>
                    <div className="d-flex gap-3">
                      {["card", "upi", "netbanking"].map((method) => (
                        <Button
                          key={method}
                          variant={paymentMethod === method ? "primary" : "outline-secondary"}
                          onClick={() => setPaymentMethod(method)}
                          style={{
                            flex: 1,
                            borderRadius: "12px",
                            padding: "12px",
                            background:
                              paymentMethod === method
                                ? colors.button.primary
                                : "transparent",
                            border: `2px solid ${
                              paymentMethod === method ? colors.button.primary : "#ccc"
                            }`,
                            color: paymentMethod === method ? "#fff" : colors.text,
                          }}
                        >
                          {method === "card" && "💳 Card"}
                          {method === "upi" && "📱 UPI"}
                          {method === "netbanking" && "🏦 Net Banking"}
                        </Button>
                      ))}
                    </div>
                  </Form.Group>

                  {/* Card Payment Form */}
                  {paymentMethod === "card" && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: colors.text }}>Card Number</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={(e) => handleCardInput("cardNumber", e.target.value)}
                          style={{
                            backgroundColor: isDark ? "#404040" : "#ffffff",
                            color: colors.text,
                            border: `2px solid ${isDark ? "#555" : "#e0e0e0"}`,
                            borderRadius: "12px",
                            padding: "12px",
                          }}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: colors.text }}>Cardholder Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="John Doe"
                          value={cardDetails.cardName}
                          onChange={(e) =>
                            setCardDetails({ ...cardDetails, cardName: e.target.value })
                          }
                          style={{
                            backgroundColor: isDark ? "#404040" : "#ffffff",
                            color: colors.text,
                            border: `2px solid ${isDark ? "#555" : "#e0e0e0"}`,
                            borderRadius: "12px",
                            padding: "12px",
                          }}
                        />
                      </Form.Group>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label style={{ color: colors.text }}>Expiry Date</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="MM/YY"
                              value={cardDetails.expiryDate}
                              onChange={(e) => handleCardInput("expiryDate", e.target.value)}
                              style={{
                                backgroundColor: isDark ? "#404040" : "#ffffff",
                                color: colors.text,
                                border: `2px solid ${isDark ? "#555" : "#e0e0e0"}`,
                                borderRadius: "12px",
                                padding: "12px",
                              }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </>
                  )}

                  {/* UPI Payment */}
                  {paymentMethod === "upi" && (
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: colors.text }}>UPI ID</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="yourname@upi"
                        style={{
                          backgroundColor: isDark ? "#404040" : "#ffffff",
                          color: colors.text,
                          border: `2px solid ${isDark ? "#555" : "#e0e0e0"}`,
                          borderRadius: "12px",
                          padding: "12px",
                        }}
                      />
                    </Form.Group>
                  )}

                  {/* Net Banking */}
                  {paymentMethod === "netbanking" && (
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: colors.text }}>Select Bank</Form.Label>
                      <Form.Select
                        style={{
                          backgroundColor: isDark ? "#404040" : "#ffffff",
                          color: colors.text,
                          border: `2px solid ${isDark ? "#555" : "#e0e0e0"}`,
                          borderRadius: "12px",
                          padding: "12px",
                        }}
                      >
                        <option>State Bank of India</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                      </Form.Select>
                    </Form.Group>
                  )}

                  {/* Payment Button */}
                  <Button
                    type="submit"
                    disabled={processing || timeRemaining === 0}
                    style={{
                      width: "100%",
                      background: colors.button.success,
                      border: "none",
                      borderRadius: "15px",
                      padding: "15px",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      marginTop: "20px",
                    }}
                  >
                    {processing ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Processing Payment...
                      </>
                    ) : (
                      `Pay ₹${booking.totalPrice}`
                    )}
                  </Button>
                </Form>

                {/* Security Note */}
                <div
                  className="mt-4 p-3"
                  style={{
                    background: isDark ? "#404040" : "#f8f9fa",
                    borderRadius: "12px",
                  }}
                >
                  <small style={{ color: colors.textSecondary }}>
                    🔒 <strong>Secure Payment:</strong> This is a simulated payment
                    for demonstration purposes. No actual charges will be made.
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Booking Summary */}
          <Col lg={5}>
            <Card
              className="border-0 shadow-lg"
              style={{
                background: colors.cardBackground,
                borderRadius: "20px",
              }}
            >
              <Card.Body className="p-4">
                <h4 className="mb-4" style={{ color: colors.text }}>
                  Booking Summary
                </h4>

                {/* Car Details */}
                <div className="mb-4">
                  <h5
                    className="text-capitalize"
                    style={{ color: colors.text, fontWeight: "600" }}
                  >
                    {booking.brand} {booking.carName}
                  </h5>
                  <Badge
                    style={{
                      background: colors.button.primary,
                      padding: "5px 10px",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                    }}
                  >
                    {booking.status}
                  </Badge>
                </div>

                {/* Booking Details */}
                <div
                  style={{
                    background: isDark ? "#404040" : "#f8f9fa",
                    padding: "20px",
                    borderRadius: "12px",
                    marginBottom: "20px",
                  }}
                >
                  <Row className="mb-3">
                    <Col xs={6}>
                      <small style={{ color: colors.textSecondary }}>
                        Booking ID
                      </small>
                      <div style={{ color: colors.text, fontWeight: "600" }}>
                        #{booking.bookingId}
                      </div>
                    </Col>
                    <Col xs={6} className="text-end">
                      <small style={{ color: colors.textSecondary }}>Car ID</small>
                      <div style={{ color: colors.text, fontWeight: "600" }}>
                        #{booking.carId}
                      </div>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col>
                      <small style={{ color: colors.textSecondary }}>
                        Start Date
                      </small>
                      <div style={{ color: colors.text, fontWeight: "600" }}>
                        {new Date(booking.startDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col>
                      <small style={{ color: colors.textSecondary }}>
                        End Date
                      </small>
                      <div style={{ color: colors.text, fontWeight: "600" }}>
                        {new Date(booking.endDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <small style={{ color: colors.textSecondary }}>
                        Duration
                      </small>
                      <div style={{ color: colors.text, fontWeight: "600" }}>
                        {Math.ceil(
                          (new Date(booking.endDate) - new Date(booking.startDate)) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Price Breakdown */}
                <div className="mb-4">
                  <h6 className="mb-3" style={{ color: colors.text }}>
                    Price Breakdown
                  </h6>
                  <div
                    style={{
                      background: isDark ? "#404040" : "#f8f9fa",
                      padding: "15px",
                      borderRadius: "12px",
                    }}
                  >
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ color: colors.textSecondary }}>Subtotal</span>
                      <span style={{ color: colors.text, fontWeight: "600" }}>
                        ₹{booking.totalPrice}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ color: colors.textSecondary }}>GST (18%)</span>
                      <span style={{ color: colors.text, fontWeight: "600" }}>
                        ₹{(booking.totalPrice * 0.18).toFixed(2)}
                      </span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <span
                        style={{ color: colors.text, fontWeight: "bold", fontSize: "1.1rem" }}
                      >
                        Total Amount
                      </span>
                      <span
                        style={{
                          color: colors.text,
                          fontWeight: "bold",
                          fontSize: "1.3rem",
                        }}
                      >
                        ₹{(booking.totalPrice * 1.18).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div
                  style={{
                    background: isDark ? "#404040" : "#f8f9fa",
                    padding: "15px",
                    borderRadius: "12px",
                  }}
                >
                  <small style={{ color: colors.textSecondary, lineHeight: "1.6" }}>
                    <strong>Terms & Conditions:</strong>
                    <ul className="mt-2 mb-0" style={{ paddingLeft: "20px" }}>
                      <li>Full payment required to confirm booking</li>
                      <li>Cancellation charges may apply</li>
                      <li>Valid driving license required at pickup</li>
                      <li>Security deposit will be collected</li>
                    </ul>
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PaymentPage;