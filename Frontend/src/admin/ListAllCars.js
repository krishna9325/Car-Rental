import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Spinner,
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Alert,
} from "react-bootstrap";
import { useTheme } from "../contexts/ThemeContext";

function ListAllCars() {
  const location = useLocation();
  const navigate = useNavigate();
  const { colors, isDark } = useTheme();
  const [cities, setCities] = useState(location.state?.cities || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState("all");

  // Fetch cities and cars
  const fetchCities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:8080/cars/public/cities");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCities(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!cities || cities.length === 0) {
      fetchCities();
    } else {
      setLoading(false);
    }
  }, []);

  const getAllCars = () =>
    cities.flatMap((city) =>
      city.cars.map((car) => ({
        ...car,
        cityName: city.cityName,
        city: { id: city.id, cityName: city.cityName, pinCode: city.pinCode },
      }))
    );

  const getFilteredCars = () => {
    if (selectedCity === "all") return getAllCars();
    const city = cities.find((c) => c.id.toString() === selectedCity);
    return city
      ? city.cars.map((car) => ({
          ...car,
          cityName: city.cityName,
          city: { id: city.id, cityName: city.cityName, pinCode: city.pinCode },
        }))
      : [];
  };

  const handleEditCar = (car) => {
    navigate(`/admin/edit/${car.id}`, { state: { car } });
  };

  const filteredCars = getFilteredCars();

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
            style={{ width: "4rem", height: "4rem", color: colors.text }}
          />
          <p className="mt-3 fs-5" style={{ color: colors.text }}>
            Loading cars for management...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger" className="mt-4">
          <h5>Error Loading Cars</h5>
          <p>Failed to load car data: {error}</p>
          <Button variant="outline-danger" onClick={fetchCities}>
            Retry
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
        {/* City Filter */}
        <Card className="border-0 shadow-lg mb-4">
          <Card.Body className="p-4">
            <Row className="align-items-center">
              <Col md={4}>
                <Form.Label
                  className="fw-semibold mb-2"
                  style={{ color: colors.text, fontSize: "1.1rem" }}
                >
                  🌍 Filter by City
                </Form.Label>
                <Form.Select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                >
                  <option value="all">Show All Cities</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.cityName} ({city.cars.length} cars)
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={8} className="text-end">
                <div className="d-flex justify-content-end align-items-center gap-3 mt-3 mt-md-0">
                  <Badge
                    style={{
                      background: colors.button.info,
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                    }}
                  >
                    Total Cars: {filteredCars.length}
                  </Badge>
                  <Badge
                    style={{
                      background: colors.button.success,
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                    }}
                  >
                    Available:{" "}
                    {filteredCars.filter((car) => car.count > 0).length}
                  </Badge>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Cars Grid */}
        {filteredCars.length === 0 ? (
          <Card
            className="border-0 shadow-lg"
            style={{ borderRadius: "20px", minHeight: "300px" }}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center p-5">
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🚫</div>
              <h3 style={{ color: colors.text }} className="mb-3">
                No Cars Found
              </h3>
              <p style={{ color: colors.textSecondary, fontSize: "1.1rem" }}>
                {selectedCity === "all"
                  ? "No cars available in any city at the moment."
                  : "No cars found for the selected city."}
              </p>
              <Button
                onClick={() => setSelectedCity("all")}
                style={{
                  background: colors.button.primary,
                  border: "none",
                  borderRadius: "25px",
                  padding: "12px 24px",
                  marginTop: "1rem",
                }}
              >
                Show All Cities
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            {filteredCars.map((car, index) => (
              <Col lg={4} md={6} sm={12} key={car.id}>
                <Card
                  className="h-100 border-0 shadow-lg"
                  style={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      height: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    {car.images && car.images.length > 0 ? (
                      <img
                        src={`/images/${car.brand}/${car.carName}/${car.images[1]}`}
                        alt={car.carName}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          fontSize: "4rem",
                          color: colors.textSecondary,
                        }}
                      >
                        🚗
                      </div>
                    )}

                    <Badge
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background:
                          car.count > 0
                            ? colors.button.success
                            : colors.button.danger,
                        padding: "5px 10px",
                        borderRadius: "15px",
                        fontSize: "0.8rem",
                      }}
                    >
                      {car.count > 0
                        ? `${car.count} Available`
                        : "Out of Stock"}
                    </Badge>
                  </div>

                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5
                          className="mb-1 text-capitalize fw-bold"
                          style={{ color: colors.text }}
                        >
                          {car.brand} {car.carName}
                        </h5>
                        <p
                          className="small mb-0"
                          style={{ color: colors.textSecondary }}
                        >
                          📍 {car.cityName}
                        </p>
                      </div>
                      <div className="text-end">
                        <h6
                          className="mb-0 fw-bold"
                          style={{ color: colors.text }}
                        >
                          ₹{car.pricePerDay}
                        </h6>
                        <small style={{ color: colors.textSecondary }}>
                          per day
                        </small>
                      </div>
                    </div>

                    <p
                      className="small mb-3"
                      style={{
                        color: colors.textSecondary,
                        lineHeight: "1.4",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {car.details}
                    </p>

                    <Row className="g-2 mb-3">
                      <Col xs={6}>
                        <small
                          className="d-block"
                          style={{ color: colors.textSecondary }}
                        >
                          🔧 {car.specifications.engine}
                        </small>
                      </Col>
                      <Col xs={6}>
                        <small
                          className="d-block"
                          style={{ color: colors.textSecondary }}
                        >
                          ⚙️ {car.specifications.transmission}
                        </small>
                      </Col>
                      <Col xs={6}>
                        <small
                          className="d-block"
                          style={{ color: colors.textSecondary }}
                        >
                          👥 {car.specifications.seatingCapacity} Seats
                        </small>
                      </Col>
                      <Col xs={6}>
                        <small
                          className="d-block"
                          style={{ color: colors.textSecondary }}
                        >
                          ⛽ {car.specifications.fuelType}
                        </small>
                      </Col>
                    </Row>

                    <Button
                      size="sm"
                      onClick={() => handleEditCar(car)}
                      style={{
                        background: colors.button.primary,
                        border: "none",
                        borderRadius: "10px",
                        padding: "8px 16px",
                        fontSize: "0.95rem",
                      }}
                    >
                      Edit
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default ListAllCars;
