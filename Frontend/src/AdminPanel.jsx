import React, { useState } from "react";
import carData from "./data/cars.json";

const cities = ["Pune", "Mumbai", "Delhi", "Bangalore"];

export default function CarManager() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCar, setSelectedCar] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cityCars, setCityCars] = useState({});

  const handleAddCar = () => {
    if (!selectedCity || !selectedBrand || !selectedCar) return;

    const carInfo = carData[selectedBrand][selectedCar];

    const newCar = {
      brand: selectedBrand,
      name: selectedCar,
      ...carInfo,
      quantity,
    };

    setCityCars((prev) => {
      const carsForCity = prev[selectedCity] || [];
      return {
        ...prev,
        [selectedCity]: [...carsForCity, newCar],
      };
    });

    // reset selections
    setSelectedBrand("");
    setSelectedCar("");
    setQuantity(1);
  };

  const carSpecs = selectedBrand && selectedCar
    ? carData[selectedBrand][selectedCar]
    : null;

  return (
    <div className="p-6 max-w-5xl mx-auto container">
      <h2 className="text-2xl font-bold mb-4">Add Car</h2>

      {/* Select City */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Select City</label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">-- Select City --</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {selectedCity && (
        <div className="mb-4">
          <label className="block font-semibold mb-1">Select Brand</label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">-- Select Brand --</option>
            {Object.keys(carData).map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
      )}

      {/* Select Car */}
      {selectedBrand && (
        <div className="mb-4">
          <label className="block font-semibold mb-1">Select Car</label>
          <select
            value={selectedCar}
            onChange={(e) => setSelectedCar(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">-- Select Car --</option>
            {Object.keys(carData[selectedBrand]).map((car) => (
              <option key={car} value={car}>{car}</option>
            ))}
          </select>
        </div>
      )}

      {/* Show Car Info */}
      {carSpecs && (
        <div className="mb-4 border p-4 rounded shadow">
          <h3 className="text-xl font-bold mb-2 capitalize">{selectedCar}</h3>
          <p className="mb-2">{carSpecs.details}</p>
          <p><strong>Price/Day:</strong> ₹{carSpecs.pricePerDay}</p>
          <p><strong>Engine:</strong> {carSpecs.specifications.engine}</p>
          <p><strong>CC:</strong> {carSpecs.specifications.cc}</p>
          <p><strong>Transmission:</strong> {carSpecs.specifications.transmission}</p>
          <p><strong>Fuel Type:</strong> {carSpecs.specifications.fuelType}</p>
          <p><strong>Seats:</strong> {carSpecs.specifications.seatingCapacity}</p>

          {/* Images */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            {carSpecs.images.map((img, idx) => {
                const imagePath = `/images/${selectedBrand}/${selectedCar}/${img}`;
                console.log("Image path:", imagePath); // ✅ Debugging
                return (
                     <img
                        key={idx}
                        src={imagePath}
                        alt={`${selectedCar}-${idx}`}
                        className="rounded"
                    />
                );
            })}
          </div>

          {/* Quantity */}
          <div className="mt-3">
            <label className="block font-semibold mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="border rounded p-2 w-24"
            />
          </div>

          <button
            onClick={handleAddCar}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add Car
          </button>
        </div>
      )}

      {/* Display Cars by City */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Cars by City</h2>
        {Object.keys(cityCars).map((city) => (
          <div key={city} className="mb-6">
            <h3 className="text-xl font-semibold">{city}</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {cityCars[city].map((car, idx) => (
                <div key={idx} className="border rounded p-3 shadow">
                  <h4 className="font-bold capitalize">{car.name}</h4>
                  <p>{car.details}</p>
                  <p><strong>Qty:</strong> {car.quantity}</p>
                  <img
                    src={`../images/${car.brand}/${car.name}/${car.images[0]}`}
                    alt={car.name}
                    className="w-full h-32 object-cover mt-2 rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
