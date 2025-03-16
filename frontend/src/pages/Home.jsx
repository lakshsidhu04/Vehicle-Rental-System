import { useState, useEffect } from "react";
import { NavbarComp } from "../components/Navbar";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import carImage from "../assets/car.jpg";
import bikeImage from "../assets/bike.jpg";

const GetRole = () => {
    const token = localStorage.getItem("token");
    if (!token) return "guest";

    try {
        const decoded = jwtDecode(token);
        return decoded.role || "guest";
    } catch (err) {
        console.error("Invalid token:", err);
        return "guest";
    }
};

export function Home() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(GetRole());
    const nav = useNavigate();

    // Booking modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchVehicleData = async () => {
        try {
            const response = await fetch("http://localhost:5050/vehicles", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setVehicles(data);
            } else {
                console.error("Failed to fetch data");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const handleBooking = (vehicle) => {

        console.log("vehicle: ", vehicle);
        if (role === "customer") {
            setSelectedVehicle(vehicle);
            setShowModal(true);
        } else {
            nav("/");
        }
    };
    
    const handleSubmitBooking = async () => {
        if (!startDate || !endDate) {
            alert("Please select start and end dates.");
            return;
        }

        console.log("Booking vehicle:", selectedVehicle.vehicle_id, startDate, endDate);

        try {
            const response = await fetch("http://localhost:5050/bookings/add-booking", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    vehicleId: selectedVehicle.vehicle_id,
                    startDate,
                    endDate,
                }),
            });

            if (response.ok) {
                alert("Booking successful!");
                setShowModal(false);
                setStartDate("");
                setEndDate("");
            } else {
                const errorData = await response.json();
                alert(`Booking failed: ${errorData.error}`);
            }
        } catch (err) {
            console.error("Error booking vehicle:", err);
            alert("Something went wrong. Try again later.");
        }
    };

    useEffect(() => {
        fetchVehicleData();
    }, []);

    return (
        <>
            <NavbarComp />
            <div className="container mt-5 pt-5">
                <h1 className="mb-4 text-center">Available Vehicles</h1>

                {loading ? (
                    <div className="text-center">
                        <span className="spinner-border text-primary" role="status"></span>
                        <p>Loading vehicles...</p>
                    </div>
                ) : (
                    <div className="row">
                        {vehicles.map((vehicle) => (
                            <div key={vehicle._id} className="col-md-4 mb-4">
                                <div className="card shadow-lg border-0 rounded-3">
                                    <img
                                        src={vehicle.vehicle_type === "Car" ? carImage : bikeImage}
                                        alt={`${vehicle.brand} ${vehicle.model}`}
                                        className="card-img-top"
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{vehicle.brand} {vehicle.model}</h5>
                                        <p className="card-text">
                                            <strong>License Plate:</strong> {vehicle.license_plate} <br />
                                            <strong>Price per Day:</strong> ₹{vehicle.price_per_day}
                                        </p>
                                        <button
                                            className="btn btn-primary w-100"
                                            onClick={() => handleBooking(vehicle)}
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Book Vehicle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedVehicle && (
                        <>
                            <h5>{selectedVehicle.brand} {selectedVehicle.model}</h5>
                            <p><strong>License Plate:</strong> {selectedVehicle.license_plate}</p>
                            <p><strong>Price per Day:</strong> ₹{selectedVehicle.price_per_day}</p>

                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </Form.Group>
                            </Form>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmitBooking}>
                        Confirm Booking
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
