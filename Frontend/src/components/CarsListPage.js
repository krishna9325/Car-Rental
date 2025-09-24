import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Alert,
} from "react-bootstrap";
import { useTheme } from "./ThemeContext";

function CarsListPage() {
  const location = useLocation();
  const { cities } = location.state || { cities: [] };

  const { isDark, colors } = useTheme();
  const [selectedCity, setSelectedCity] = useState("all");
  const [filteredCars, setFilteredCars] = useState([]);
  const [deleteAlert, setDeleteAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);

    if (cityId === "all") {
      const allCars = cities.flatMap((city) =>
        city.cars.map((car) => ({ ...car, cityName: city.cityName }))
      );
      setFilteredCars(allCars);
    } else {
      const selectedCityData = cities.find(
        (city) => city.id.toString() === cityId
      );
      if (selectedCityData) {
        const carsWithCity = selectedCityData.cars.map((car) => ({
          ...car,
          cityName: selectedCityData.cityName,
        }));
        setFilteredCars(carsWithCity);
      }
    }
  };

  const handleEditCar = (carId) => {
    console.log("Edit car with ID:", carId);
    // Navigate to edit page - you'll implement this later
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
        {deleteAlert.show && (
          <Alert
            variant={deleteAlert.type}
            dismissible
            onClose={() =>
              setDeleteAlert({ show: false, message: "", type: "" })
            }
            className="animate-slideInDown"
            style={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
          >
            {deleteAlert.message}
          </Alert>
        )}

        {/* City Filter */}
        <Card
          className="border-0 shadow-lg mb-4 animate-slideInUp animate-delay-400"
          style={{
            background: colors.carDisplayBackground,
            borderRadius: "15px",
          }}
        >
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
                  onChange={handleCityChange}
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
            className="border-0 shadow-lg animate-zoomIn"
            style={{
              background: colors.carDisplayBackground,
              borderRadius: "20px",
              minHeight: "300px",
            }}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center p-5">
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🚫</div>
              <h3 style={{ color: colors.text }} className="mb-3">
                No Cars Found
              </h3>
              <p style={{ color: colors.textSecondary, fontSize: "1.1rem" }}>
                {selectedCity === "all"
                  ? "No cars available in any city at the moment."
                  : `No cars found for the selected city.`}
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
                className="hover-scale"
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
                  className={`h-100 border-0 shadow-lg hover-lift animate-fadeInUp animate-delay-${Math.min(
                    500 + index * 100,
                    800
                  )}`}
                  style={{
                    background: colors.carDisplayBackground,
                    borderRadius: "20px",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = colors.cardHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 10px 20px rgba(0,0,0,0.1)";
                  }}
                >
                  {/* Car Image */}
                  <div
                    style={{
                      height: "200px",
                      background: `linear-gradient(45deg, "#ffffffff" : "#ffffffff")`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    {car.images && car.images.length > 0
                      ? (console.log(car.brand, car.carName),
                        (
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
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = "flex";
                              }
                            }}
                            className="hover-img"
                          />
                        ))
                      : null}
                    <div
                      style={{
                        display:
                          car.images && car.images.length > 0 ? "none" : "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "4rem",
                        color: colors.textSecondary,
                      }}
                    >
                      🚗
                    </div>

                    {/* Status Badge */}
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
                    {/* Car Name and Brand */}
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

                    {/* Car Details */}
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

                    {/* Specifications */}
                    <div className="mb-3">
                      <Row className="g-2">
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
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEditCar(car.id)}
                        style={{
                          background: colors.button.warning,
                          border: "none",
                          borderRadius: "10px",
                          padding: "8px 16px",
                          fontSize: "0.85rem",
                          flex: 1,
                        }}
                        className="hover-scale"
                      >
                        Edit
                        {/* ✏️ Edit */}
                      </Button>
                      {/* <Button
                        size="sm"
                        onClick={() => handleDeleteCar(car.id, car.carName)}
                        style={{
                          background: colors.swipe,
                          border: "none",
                          borderRadius: "10px",
                          padding: "8px 16px",
                          fontSize: "0.95rem",
                          // flex: 1,
                        }}
                        className="hover-scale"
                      >
                        🗑️
                      </Button> */}
                    </div>
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

export default CarsListPage;
