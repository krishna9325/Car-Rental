import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAuth } from "../contexts/AuthContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { colors, isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchUserBookings();
  }, [isAuthenticated, navigate]);

  const fetchUserBookings = async () => {
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
        `http://localhost:8080/user/bookings/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const sortedBookings = data.sort(
          (a, b) => new Date(b.startDate) - new Date(a.startDate)
        );
        setBookings(sortedBookings);
      } else if (response.status === 401) {
        setShowAlert({
          show: true,
          message: "Session expired. Please login again.",
          type: "warning",
        });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setShowAlert({
          show: true,
          message: "Failed to load bookings",
          type: "danger",
        });
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setShowAlert({
        show: true,
        message: "Error loading booking history",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { bg: colors.button.warning, text: "Pending Payment" },
      CONFIRMED: { bg: colors.button.success, text: "Confirmed" },
      COMPLETED: { bg: colors.button.info, text: "Completed" },
      EXPIRED: { bg: colors.button.danger, text: "Expired" },
      CANCELLED: { bg: colors.button.secondary, text: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
      <Badge
        style={{
          backgroundImage: config.bg,
          padding: "6px 12px",
          borderRadius: "8px",
          fontSize: "0.85rem",
          border: "none",
        }}
      >
        {config.text}
      </Badge>
    );
  };

  const handlePaymentAction = (booking) => {
    if (booking.status === "PENDING") {
      const now = new Date();
      const deadline = new Date(booking.paymentDeadline);

      if (now > deadline) {
        setShowAlert({
          show: true,
          message: "Payment deadline has expired. Please create a new booking.",
          type: "warning",
        });
        return;
      }

      navigate(`/payment/${booking.bookingId}`, {
        state: { booking },
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const days = Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );
    return days;
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
        <div className="text-center">
          <Spinner
            animation="border"
            style={{ width: "4rem", height: "4rem", color: colors.text }}
          />
          <p className="mt-3 fs-5" style={{ color: colors.text }}>
            Loading your profile...
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

        {/* Profile Header */}
        <Card
          className="border-0 shadow-lg mb-4"
          style={{
            backgroundImage: colors.carDisplayBackground,
            borderRadius: "20px",
          }}
        >
          <Card.Body className="p-4">
            <Row className="align-items-center">
              <Col md={8} className="mb-3 mb-md-0">
                <h2 style={{ color: colors.text, marginBottom: "10px" }}>
                  Welcome, {user?.username || "User"}!
                </h2>
                <p
                  style={{
                    color: colors.textSecondary,
                    fontSize: "1.1rem",
                    marginBottom: 0,
                  }}
                >
                  Manage your bookings and profile here.
                </p>
              </Col>
              <Col md={4} className="text-md-end text-center">
                <Button
                  onClick={() => navigate("/home")}
                  style={{
                    backgroundImage: colors.button.primary,
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px 24px",
                  }}
                >
                  Browse Cars
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Booking Statistics */}
        <Row className="g-3 mb-4">
          <Col xs={6} md={3}>
            <Card
              className="border-0 shadow-sm"
              style={{
                backgroundImage: colors.cardBackground,
                borderRadius: "15px",
              }}
            >
              <Card.Body className="text-center p-3 p-md-4">
                <h3
                  style={{
                    color: colors.text,
                    fontSize: "1.75rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {bookings.length}
                </h3>
                <p
                  style={{
                    color: colors.textSecondary,
                    marginBottom: 0,
                    fontSize: "0.9rem",
                  }}
                >
                  Total Bookings
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card
              className="border-0 shadow-sm"
              style={{
                backgroundImage: colors.cardBackground,
                borderRadius: "15px",
              }}
            >
              <Card.Body className="text-center p-3 p-md-4">
                <h3
                  style={{
                    color: "#ffc107",
                    fontSize: "1.75rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {bookings.filter((b) => b.status === "PENDING").length}
                </h3>
                <p
                  style={{
                    color: colors.textSecondary,
                    marginBottom: 0,
                    fontSize: "0.9rem",
                  }}
                >
                  Pending
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card
              className="border-0 shadow-sm"
              style={{
                backgroundImage: colors.cardBackground,
                borderRadius: "15px",
              }}
            >
              <Card.Body className="text-center p-3 p-md-4">
                <h3
                  style={{
                    color: "#82c486",
                    fontSize: "1.75rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {bookings.filter((b) => b.status === "CONFIRMED").length}
                </h3>
                <p
                  style={{
                    color: colors.textSecondary,
                    marginBottom: 0,
                    fontSize: "0.9rem",
                  }}
                >
                  Active
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card
              className="border-0 shadow-sm"
              style={{
                backgroundImage: colors.cardBackground,
                borderRadius: "15px",
              }}
            >
              <Card.Body className="text-center p-3 p-md-4">
                <h3
                  style={{
                    color: "#17a2b8",
                    fontSize: "1.75rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {bookings.filter((b) => b.status === "COMPLETED").length}
                </h3>
                <p
                  style={{
                    color: colors.textSecondary,
                    marginBottom: 0,
                    fontSize: "0.9rem",
                  }}
                >
                  Completed
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Booking History */}
        <Card
          className="border-0 shadow-lg"
          style={{
            backgroundImage: colors.carDisplayBackground,
            borderRadius: "20px",
          }}
        >
          <Card.Body className="p-3 p-md-4">
            <h4 className="mb-4" style={{ color: colors.text }}>
              Booking History
            </h4>

            {bookings.length === 0 ? (
              <div className="text-center py-5">
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📋</div>
                <h5 style={{ color: colors.text }}>No Bookings Yet</h5>
                <p style={{ color: colors.textSecondary }}>
                  Start by browsing available cars
                </p>
                <Button
                  onClick={() => navigate("/home")}
                  style={{
                    backgroundImage: colors.button.primary,
                    border: "none",
                    borderRadius: "12px",
                    padding: "10px 20px",
                    marginTop: "1rem",
                  }}
                >
                  Browse Cars
                </Button>
              </div>
            ) : (
              <div className="d-none d-md-block">
                {/* Desktop Table View */}
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "separate",
                      borderSpacing: "0 10px",
                    }}
                  >
                    <thead>
                      <tr
                        style={{ borderBottom: `2px solid ${colors.border}` }}
                      >
                        <th
                          style={{
                            color: colors.text,
                            padding: "15px",
                            textAlign: "left",
                          }}
                        >
                          Booking
                        </th>
                        <th
                          style={{
                            color: colors.text,
                            padding: "15px",
                            textAlign: "left",
                          }}
                        >
                          Car
                        </th>
                        <th
                          style={{
                            color: colors.text,
                            padding: "15px",
                            textAlign: "left",
                          }}
                        >
                          Duration
                        </th>
                        <th
                          style={{
                            color: colors.text,
                            padding: "15px",
                            textAlign: "right",
                          }}
                        >
                          Amount
                        </th>
                        <th
                          style={{
                            color: colors.text,
                            padding: "15px",
                            textAlign: "center",
                          }}
                        >
                          Status
                        </th>
                        <th
                          style={{
                            color: colors.text,
                            padding: "15px",
                            textAlign: "center",
                          }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr
                          key={booking.bookingId}
                          style={{
                            borderBottom: `1px solid ${
                              isDark ? "#404040" : "#f0f0f0"
                            }`,
                          }}
                        >
                          <td style={{ color: colors.text, padding: "15px" }}>
                            <strong>#{booking.bookingId}</strong>
                            <br />
                            <small style={{ color: colors.textSecondary }}>
                              Car ID: {booking.carId}
                            </small>
                          </td>
                          <td style={{ color: colors.text, padding: "15px" }}>
                            <strong>
                              {booking.brand} {booking.carName}
                            </strong>
                          </td>
                          <td style={{ color: colors.text, padding: "15px" }}>
                            <div>{formatDate(booking.startDate)}</div>
                            <div
                              style={{
                                color: colors.textSecondary,
                                fontSize: "0.85rem",
                              }}
                            >
                              to
                            </div>
                            <div>{formatDate(booking.endDate)}</div>
                            <Badge
                              bg="secondary"
                              style={{ marginTop: "5px", fontSize: "0.75rem" }}
                            >
                              {calculateDuration(
                                booking.startDate,
                                booking.endDate
                              )}{" "}
                              days
                            </Badge>
                          </td>
                          <td
                            style={{
                              color: colors.text,
                              padding: "15px",
                              textAlign: "right",
                            }}
                          >
                            <strong>₹{booking.totalPrice}</strong>
                          </td>
                          <td style={{ padding: "15px", textAlign: "center" }}>
                            {getStatusBadge(booking.status)}
                            {booking.status === "PENDING" &&
                              booking.paymentDeadline && (
                                <div
                                  style={{
                                    color: colors.textSecondary,
                                    fontSize: "0.75rem",
                                    marginTop: "5px",
                                  }}
                                >
                                  Expires:{" "}
                                  {formatDateTime(booking.paymentDeadline)}
                                </div>
                              )}
                          </td>
                          <td style={{ padding: "15px", textAlign: "center" }}>
                            {booking.status === "PENDING" && (
                              <Button
                                size="sm"
                                onClick={() => handlePaymentAction(booking)}
                                style={{
                                  backgroundImage: colors.button.success,
                                  border: "none",
                                  borderRadius: "8px",
                                  padding: "6px 12px",
                                }}
                              >
                                Pay Now
                              </Button>
                            )}
                            {booking.status === "CONFIRMED" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  navigate(`/booking/${booking.bookingId}`)
                                }
                                style={{
                                  backgroundImage: colors.button.info,
                                  border: "none",
                                  borderRadius: "8px",
                                  padding: "6px 12px",
                                  color: "#fff",
                                }}
                              >
                                View
                              </Button>
                            )}
                            {(booking.status === "EXPIRED" ||
                              booking.status === "CANCELLED") && (
                              <Button
                                size="sm"
                                onClick={() => navigate("/home")}
                                style={{
                                  backgroundImage: colors.button.primary,
                                  border: "none",
                                  borderRadius: "8px",
                                  padding: "6px 12px",
                                }}
                              >
                                Book Again
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Mobile Card View */}
            {bookings.length > 0 && (
              <div className="d-md-none">
                {bookings.map((booking) => (
                  <Card
                    key={booking.bookingId}
                    className="mb-3 border-0 shadow-sm"
                    style={{
                      backgroundImage: colors.cardBackground,
                      borderRadius: "12px",
                    }}
                  >
                    <Card.Body className="p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <strong style={{ color: colors.text }}>
                            #{booking.bookingId}
                          </strong>
                          <div
                            style={{
                              color: colors.textSecondary,
                              fontSize: "0.85rem",
                            }}
                          >
                            {booking.brand} {booking.carName}
                          </div>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>

                      <div
                        className="mb-2"
                        style={{ color: colors.text, fontSize: "0.9rem" }}
                      >
                        <div>
                          {formatDate(booking.startDate)} to{" "}
                          {formatDate(booking.endDate)}
                        </div>
                        <Badge
                          bg="secondary"
                          style={{ fontSize: "0.75rem", marginTop: "4px" }}
                        >
                          {calculateDuration(
                            booking.startDate,
                            booking.endDate
                          )}{" "}
                          days
                        </Badge>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <strong style={{ color: colors.text }}>
                          ₹{booking.totalPrice}
                        </strong>
                        <div>
                          {booking.status === "PENDING" && (
                            <Button
                              size="sm"
                              onClick={() => handlePaymentAction(booking)}
                              style={{
                                backgroundImage: colors.button.success,
                                border: "none",
                                borderRadius: "8px",
                                padding: "6px 12px",
                                fontSize: "0.85rem",
                              }}
                            >
                              Pay Now
                            </Button>
                          )}
                          {booking.status === "CONFIRMED" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                navigate(`/booking/${booking.bookingId}`)
                              }
                              style={{
                                backgroundImage: colors.button.info,
                                border: "none",
                                borderRadius: "8px",
                                padding: "6px 12px",
                                fontSize: "0.85rem",
                                color: "#fff",
                              }}
                            >
                              View
                            </Button>
                          )}
                          {(booking.status === "EXPIRED" ||
                            booking.status === "CANCELLED") && (
                            <Button
                              size="sm"
                              onClick={() => navigate("/home")}
                              style={{
                                backgroundImage: colors.button.primary,
                                border: "none",
                                borderRadius: "8px",
                                padding: "6px 12px",
                                fontSize: "0.85rem",
                              }}
                            >
                              Book Again
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ProfilePage;
