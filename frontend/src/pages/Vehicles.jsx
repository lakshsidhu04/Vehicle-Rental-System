import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";
import { NavbarComp } from "../components/Navbar";

export function AdminVehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [error, setError] = useState(null);

    // Added vehicle_id in initial form state.
    const initialFormState = {
        vehicle_id: "",
        vehicleType: "",
        vehicleBrand: "",
        vehicleModel: "",
        vehicleYear: "",
        vehicleColor: "",
        vehicleRides: 0,
        vehicleLicensePlate: "",
        vehicleStatus: "avail",
        vehiclePricePerDay: "",
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const res = await fetch("http://localhost:5050/vehicles/admin", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (!res.ok) throw new Error("Failed to fetch vehicles");

            const data = await res.json();
            setVehicles(data);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            setError(error.message);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (vehicle) => {
        setSelectedVehicle(vehicle);
        setFormData({
            vehicle_id: vehicle.vehicle_id, // store vehicle_id for backend reference
            vehicleType: vehicle.vehicle_type,
            vehicleBrand: vehicle.brand,
            vehicleModel: vehicle.model,
            vehicleYear: vehicle.year,
            vehicleColor: vehicle.color,
            vehicleRides: vehicle.rides,
            vehicleLicensePlate: vehicle.license_plate,
            vehicleStatus: vehicle.status,
            vehiclePricePerDay: vehicle.price_per_day,
        });
        setShowModal(true);
    };

    const handleDelete = async (vehicle_id) => {
        if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

        try {
            const res = await fetch(`http://localhost:5050/vehicles/${vehicle_id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (!res.ok) throw new Error("Failed to delete vehicle");

            fetchVehicles();
        } catch (error) {
            console.error("Error deleting vehicle:", error);
            setError(error.message);
        }
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`http://localhost:5050/vehicles/${selectedVehicle.vehicle_id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to update vehicle");

            setShowModal(false);
            fetchVehicles();
        } catch (error) {
            console.error("Error updating vehicle:", error);
            setError(error.message);
        }
    };

    const handleAddVehicle = async () => {
        try {
            const res = await fetch("http://localhost:5050/vehicles/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                // Note: vehicle_id is ignored when adding a new vehicle because it is auto-generated.
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to add vehicle");

            setShowAddModal(false);
            setFormData(initialFormState);
            fetchVehicles();
        } catch (error) {
            console.error("Error adding vehicle:", error);
            setError(error.message);
        }
    };

    return (
        <>
            <NavbarComp />
            <div style={{ padding: "20px", color: "#fff", backgroundColor: "#181818", minHeight: "100vh" }}>
                <h2>Admin Vehicle Management</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                <Button variant="success" onClick={() => setShowAddModal(true)} style={{ marginBottom: "15px" }}>
                    Add New Vehicle
                </Button>

                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Brand</th>
                            <th>Model</th>
                            <th>Type</th>
                            <th>Year</th>
                            <th>Color</th>
                            <th>Rides</th>
                            <th>License Plate</th>
                            <th>Status</th>
                            <th>Price/Day</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle.vehicle_id}>
                                <td>{vehicle.vehicle_id}</td>
                                <td>{vehicle.brand}</td>
                                <td>{vehicle.model}</td>
                                <td>{vehicle.vehicle_type}</td>
                                <td>{vehicle.year}</td>
                                <td>{vehicle.color}</td>
                                <td>{vehicle.rides}</td>
                                <td>{vehicle.license_plate}</td>
                                <td>{vehicle.status}</td>
                                <td>${vehicle.price_per_day}</td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleEdit(vehicle)}>Edit</Button>{" "}
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(vehicle.vehicle_id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Edit Vehicle Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Vehicle</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Vehicle Type</Form.Label>
                                <Form.Control type="text" name="vehicleType" value={formData.vehicleType} disabled />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Vehicle Brand</Form.Label>
                                <Form.Control type="text" name="vehicleBrand" value={formData.vehicleBrand} disabled />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Vehicle Model</Form.Label>
                                <Form.Control type="text" name="vehicleModel" value={formData.vehicleModel} disabled />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Vehicle Year</Form.Label>
                                <Form.Control type="number" name="vehicleYear" value={formData.vehicleYear} disabled />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Vehicle Color</Form.Label>
                                <Form.Control type="text" name="vehicleColor" value={formData.vehicleColor} disabled />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Vehicle Rides</Form.Label>
                                <Form.Control type="number" name="vehicleRides" value={formData.vehicleRides} disabled />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Vehicle License Plate</Form.Label>
                                <Form.Control type="text" name="vehicleLicensePlate" value={formData.vehicleLicensePlate} disabled />
                            </Form.Group>
                            {/* Editable Fields */}
                            <Form.Group className="mb-3">
                                <Form.Label>Vehicle Price Per Day</Form.Label>
                                <Form.Control type="number" name="vehiclePricePerDay" value={formData.vehiclePricePerDay} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Vehicle Status</Form.Label>
                                <Form.Control as="select" name="vehicleStatus" value={formData.vehicleStatus} onChange={handleChange}>
                                    <option value="avail">avail</option>
                                    <option value="maintenance">maintenance</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>

                {/* Add Vehicle Modal */}
                <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Vehicle</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Vehicle Type</Form.Label>
                                <Form.Control type="text" name="vehicleType" value={formData.vehicleType} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Vehicle Brand</Form.Label>
                                <Form.Control type="text" name="vehicleBrand" value={formData.vehicleBrand} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Vehicle Model</Form.Label>
                                <Form.Control type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Vehicle Year</Form.Label>
                                <Form.Control type="number" name="vehicleYear" value={formData.vehicleYear} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Vehicle Color</Form.Label>
                                <Form.Control type="text" name="vehicleColor" value={formData.vehicleColor} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Vehicle Rides</Form.Label>
                                <Form.Control type="number" name="vehicleRides" value={formData.vehicleRides} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Vehicle License Plate</Form.Label>
                                <Form.Control type="text" name="vehicleLicensePlate" value={formData.vehicleLicensePlate} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Vehicle Status</Form.Label>
                                <Form.Control type="text" name="vehicleStatus" value={formData.vehicleStatus} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Vehicle Price Per Day</Form.Label>
                                <Form.Control type="number" name="vehiclePricePerDay" value={formData.vehiclePricePerDay} onChange={handleChange} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleAddVehicle}>Add Vehicle</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}
