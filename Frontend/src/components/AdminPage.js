import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Spinner, Card, Row, Col } from "react-bootstrap";
import { useTheme } from "./ThemeContext";

function CarsPage() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isDark, colors } = useTheme();

  useEffect(() => {
    fetch("http://localhost:8080/admin/cities")
      .then((res) => res.json())
      .then((data) => {
        setCities(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cities:", err);
        setLoading(false);
      });
  }, []);

  const handleAddCar = () => {
    navigate("/add-car", { state: { cities } });
  };

  const handleAddCity = () => {
    navigate("/add-city", { state: { cities } });
  };

  const handleUpdateCar = () => {
    console.log(cities);
    navigate("/cities", { state: { cities } });
  };

  const cardConfigs = [
    {
      title: "Add New City",
      icon: "🌆",
      handler: handleAddCity,
      gradient: colors.button.info,
      description: "Add a new city to your service area",
    },
    {
      title: "Add New Car",
      icon: "🚘",
      handler: handleAddCar,
      gradient: colors.button.warning,
      description: "Add a new vehicle to your fleet",
    },
    {
      title: "List Cars",
      icon: "📋",
      handler: handleUpdateCar,
      gradient: colors.button.success,
      description: "Modify existing car details",
    },
  ];

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          background: colors.background,
          minHeight: "calc(100vh - 80px)", // Account for fixed header
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
              animation:
                "spin 1s linear infinite, pulse 2s ease-in-out infinite alternate",
            }}
          />
          <p className="mt-3 fs-5" style={{ color: colors.text }}>
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: colors.background,
        minHeight: "calc(100vh - 80px)", // Account for fixed header
        padding: "40px 0", // Increased top padding
        transition: "all 0.3s ease",
      }}
    >
      <Container>
        <div className="text-center mb-5">
          <h1
            className="display-4 fw-bold mb-3"
            style={{
              color: colors.text,
              textShadow: isDark
                ? "0 0 20px rgba(255,255,255,0.3)"
                : "0 4px 8px rgba(0,0,0,0.1)",
              animation: "fadeInDown 1s ease-out",
            }}
          >
            Car Management Hub
          </h1>
          <p
            className="lead"
            style={{
              color: colors.textSecondary,
              animation: "fadeInUp 1s ease-out 0.2s both",
            }}
          >
            Manage your fleet with style and efficiency
          </p>
        </div>

        <Row className="g-4 justify-content-center">
          {cardConfigs.map((card, index) => (
            <Col lg={3} md={6} sm={12} key={card.title}>
              <Card
                className="h-100 border-0 shadow-lg"
                style={{
                  background: card.gradient,
                  transform: "translateY(0)",
                  transition: "all 0.3s ease",
                  animation: `slideIn${
                    ["Left", "Up", "Down", "Right"][index]
                  } 0.8s ease-out ${0.3 + index * 0.1}s both`,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = colors.cardHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 20px rgba(0,0,0,0.1)";
                }}
                onClick={card.handler}
              >
                <Card.Body className="text-center p-4">
                  <div
                    className="mb-3"
                    style={{
                      fontSize: "3rem",
                      filter: isDark ? "brightness(1.2)" : "brightness(1)",
                    }}
                  >
                    {card.icon}
                  </div>
                  <Card.Title className="text-white fs-5 mb-2">
                    {card.title}
                  </Card.Title>
                  <Card.Text className="text-white-75 small mb-3">
                    {card.description}
                  </Card.Text>
                  <Button
                    variant="light"
                    size="lg"
                    className="fw-bold"
                    style={{
                      borderRadius: "25px",
                      padding: "12px 30px",
                      boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                      color: colors.text,
                      background: colors.secondary,
                      border: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    {["Get Started", "View Fleet", "Modify", "Delete"][index]}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div
          className="text-center mt-5"
          style={{ animation: "fadeIn 1s ease-out 0.8s both" }}
        >
          <div
            className="d-inline-block px-4 py-3 rounded-pill"
            style={{
              background: colors.cardBackground,
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              border: `1px solid ${isDark ? "#404040" : "#e0e0e0"}`,
            }}
          >
            <p className="mb-0" style={{ color: colors.textSecondary }}>
              🌟 Total Cities Available:
              <span
                className="fw-bold ms-2 px-2 py-1 rounded"
                style={{
                  color: colors.text,
                  background: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,140,105,0.2)",
                }}
              >
                {cities.length}
              </span>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default CarsPage;
