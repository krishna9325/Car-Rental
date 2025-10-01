import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Spinner,
  Container,
  Card,
  Form,
  Row,
  Col,
  Button,
  Badge,
  Alert,
} from "react-bootstrap";
import { useTheme } from "../contexts/ThemeContext";
import { useCars } from "../contexts/CarsContext";

function UserHomePage() {
  const navigate = useNavigate();
  const { cities, loading: citiesLoading } = useCars();
  const { colors, isDark } = useTheme();

  // Get default date range (next 7 days)
  const getDefaultDates = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return {
      startDate: today.toISOString().split("T")[0],
      endDate: nextWeek.toISOString().split("T")[0],
    };
  };

  const [dateRange, setDateRange] = useState(getDefaultDates());
  const [selectedCity, setSelectedCity] = useState(null);
  const [filteredCars, setFilteredCars] = useState([]);
  const [sortedCities, setSortedCities] = useState([]);
  const [dateError, setDateError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  // Sort cities by car count and set default city
  useEffect(() => {
    if (cities.length > 0) {
      // Sort cities by number of cars (descending)
      const sorted = [...cities].sort((a, b) => b.cars.length - a.cars.length);
      setSortedCities(sorted);

      // Set default city (one with most cars)
      if (!selectedCity) {
        setSelectedCity(sorted[0].id);
        fetchAvailableCars(
          sorted[0].id,
          dateRange.startDate,
          dateRange.endDate
        );
      }
    }
  }, [cities]);

  // Fetch available cars based on city and date range
  const fetchAvailableCars = async (cityId, startDate, endDate) => {
    setLoading(true);
    setError("");

    try {
      // const response = await fetch(
      //   `http://localhost:8080/cars/public/city/${cityId}/available-by-date?startDate=${startDate}&endDate=${endDate}`
      // );
      const response = await fetch(
        `http://localhost:8080/cars/public/city/${cityId}/available`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch cars: ${response.status}`);
      }

      const data = await response.json();

      // Add city name to each car
      const cityName =
        cities.find((c) => c.id === parseInt(cityId))?.cityName || "";
      const carsWithCity = data.map((car) => ({
        ...car,
        cityName: cityName,
      }));

      setFilteredCars(carsWithCity);
      setIsFiltered(true);
    } catch (err) {
      console.error("Error fetching cars:", err);
      setError(err.message);
      setFilteredCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (field, value) => {
    setDateError("");
    const newDateRange = { ...dateRange, [field]: value };

    // Validate dates
    const start = new Date(newDateRange.startDate);
    const end = new Date(newDateRange.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      setDateError("Start date cannot be in the past");
      return;
    }

    if (end < start) {
      setDateError("End date must be after start date");
      return;
    }

    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (diffDays > 30) {
      setDateError("Booking period cannot exceed 30 days");
      return;
    }

    setDateRange(newDateRange);
  };

  const handleCityChange = (e) => {
    setSelectedCity(parseInt(e.target.value));
  };

  const handleSearch = () => {
    if (dateError) return;
    if (!selectedCity) {
      setError("Please select a city");
      return;
    }

    fetchAvailableCars(selectedCity, dateRange.startDate, dateRange.endDate);
  };

  const handleViewCar = (carId) => {
    navigate(`/car/${carId}`, {
      state: {
        dateRange,
        cityId: selectedCity,
      },
    });
  };

  const inputStyle = {
    backgroundColor: isDark ? "#404040" : "#ffffff",
    border: `2px solid ${isDark ? "#555" : "#e0e0e0"}`,
    color: colors.text,
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "16px",
    transition: "all 0.3s ease",
  };

  const focusStyle = {
    borderColor: isDark ? "#666" : "#ff8c69",
    boxShadow: `0 0 0 3px ${
      isDark ? "rgba(255,255,255,0.1)" : "rgba(255,140,105,0.2)"
    }`,
  };

  if (citiesLoading) {
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
            Loading cars...
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
        paddingTop: "40px",
        paddingBottom: "40px",
        transition: "all 0.3s ease",
      }}
    >
      <Container>
        {/* Filter Card */}
        <Card
          className="border-0 shadow-lg mb-4"
          style={{
            background: colors.carDisplayBackground,
            borderRadius: "15px",
          }}
        >
          <Card.Body className="p-4">
            <h5
              className="mb-4"
              style={{ color: colors.text, fontWeight: "600" }}
            >
              Search Available Cars
            </h5>

            <Row className="align-items-end g-3">
              {/* City Selector */}
              <Col md={3}>
                <Form.Group>
                  <Form.Label style={{ color: colors.text, fontWeight: "500" }}>
                    City
                  </Form.Label>
                  <Form.Select
                    value={selectedCity || ""}
                    onChange={handleCityChange}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  >
                    {sortedCities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.cityName} ({city.cars.length} cars)
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Start Date */}
              <Col md={3}>
                <Form.Group>
                  <Form.Label style={{ color: colors.text, fontWeight: "500" }}>
                    Start Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      handleDateChange("startDate", e.target.value)
                    }
                    min={new Date().toISOString().split("T")[0]}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </Form.Group>
              </Col>

              {/* End Date */}
              <Col md={3}>
                <Form.Group>
                  <Form.Label style={{ color: colors.text, fontWeight: "500" }}>
                    End Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      handleDateChange("endDate", e.target.value)
                    }
                    min={dateRange.startDate}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </Form.Group>
              </Col>

              {/* Search Button */}
              <Col md={3}>
                <Button
                  onClick={handleSearch}
                  disabled={loading || !!dateError}
                  style={{
                    background: colors.button.primary,
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px 24px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    width: "100%",
                  }}
                  className="hover-scale"
                >
                  {loading ? "Searching..." : "Search Cars"}
                </Button>
              </Col>
            </Row>

            {/* Duration Display & Error */}
            <Row className="mt-3">
              <Col md={9}>
                {dateError && (
                  <div className="text-danger" style={{ fontSize: "0.9rem" }}>
                    {dateError}
                  </div>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Results Summary */}
        {isFiltered && (
          <Card
            className="border-0 shadow-sm mb-4"
            style={{
              background: colors.carDisplayBackground,
              borderRadius: "12px",
            }}
          >
            <Card.Body className="p-3">
              <Row className="align-items-center">
                <Col>
                  <span style={{ color: colors.text, fontWeight: "500" }}>
                    Showing available cars in{" "}
                    <strong>
                      {
                        sortedCities.find((c) => c.id === selectedCity)
                          ?.cityName
                      }
                    </strong>{" "}
                    from{" "}
                    <strong>
                      {new Date(dateRange.startDate).toLocaleDateString()}
                    </strong>{" "}
                    to{" "}
                    <strong>
                      {new Date(dateRange.endDate).toLocaleDateString()}
                    </strong>
                  </span>
                </Col>
                <Col xs="auto">
                  <Badge
                    style={{
                      background: colors.button.success,
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                    }}
                  >
                    {filteredCars.length} Available
                  </Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Cars Grid */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: colors.text }} />
            <p className="mt-3" style={{ color: colors.text }}>
              Loading available cars...
            </p>
          </div>
        ) : filteredCars.length === 0 && isFiltered ? (
          <Card
            className="border-0 shadow-lg"
            style={{
              background: colors.carDisplayBackground,
              borderRadius: "20px",
              minHeight: "300px",
            }}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center p-5">
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🚫</div>
              <h3 style={{ color: colors.text }} className="mb-3">
                No Available Cars
              </h3>
              <p style={{ color: colors.textSecondary, fontSize: "1.1rem" }}>
                No cars are available in the selected city for your chosen
                dates. Try selecting different dates or another city.
              </p>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            {filteredCars.map((car, index) => (
              <Col lg={4} md={6} sm={12} key={car.id}>
                <Card
                  className="h-100 border-0 shadow-lg hover-lift"
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
                    {car.images && car.images.length > 0 ? (
                      <img
                        src={`/images/${car.brand}/${car.carName}/${car.images[1]}`}
                        alt={car.carName}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          if (e.target.nextSibling) {
                            e.target.nextSibling.style.display = "flex";
                          }
                        }}
                        className="hover-img"
                      />
                    ) : null}
                    <div
                      style={{
                        display:
                          car.images && car.images.length > 0 ? "none" : "flex",
                        fontSize: "4rem",
                        color: colors.textSecondary,
                      }}
                    >
                      🚗
                    </div>

                    <Badge
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: colors.button.success,
                        padding: "5px 10px",
                        borderRadius: "15px",
                        fontSize: "0.8rem",
                      }}
                    >
                      {car.count} Available
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
                          {car.cityName}
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

                    <div className="mb-3">
                      <Row className="g-2">
                        <Col xs={6}>
                          <small
                            className="d-block"
                            style={{ color: colors.textSecondary }}
                          >
                            🔧 {car.specifications?.engine || "N/A"}
                          </small>
                        </Col>
                        <Col xs={6}>
                          <small
                            className="d-block"
                            style={{ color: colors.textSecondary }}
                          >
                            ⚙️ {car.specifications?.transmission || "N/A"}
                          </small>
                        </Col>
                        <Col xs={6}>
                          <small
                            className="d-block"
                            style={{ color: colors.textSecondary }}
                          >
                            👥 {car.specifications?.seatingCapacity || "N/A"}{" "}
                            Seats
                          </small>
                        </Col>
                        <Col xs={6}>
                          <small
                            className="d-block"
                            style={{ color: colors.textSecondary }}
                          >
                            ⛽ {car.specifications?.fuelType || "N/A"}
                          </small>
                        </Col>
                      </Row>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleViewCar(car.id)}
                      style={{
                        background: colors.button.primary,
                        border: "none",
                        borderRadius: "10px",
                        padding: "8px 16px",
                        fontSize: "0.95rem",
                        width: "100%",
                      }}
                      className="hover-scale"
                    >
                      View Details & Book
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

export default UserHomePage;
