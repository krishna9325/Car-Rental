import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import CarList from "../components/CarList";
import { useTheme } from "../contexts/ThemeContext";
import { useCars } from "../contexts/CarsContext";

function ListAllCars() {
  const navigate = useNavigate();
  const { loading } = useCars();
  const { colors } = useTheme();

  const handleEditCar = (carId) => {
    navigate(`/admin/edit/${carId}`);
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
              color: colors.text,
            }}
          />
          <p className="mt-3 fs-5" style={{ color: colors.text }}>
            Loading cars for management...
          </p>
        </div>
      </div>
    );
  }

  return (
    <CarList
      actionType="admin" // Shows Edit
      onCarAction={handleEditCar}
      showAlert={true}
    />
  );
}

export default ListAllCars;
