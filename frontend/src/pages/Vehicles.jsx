import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";
import { NavbarComp } from "../components/Navbar";

export function AdminVehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [models, setModels] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [error, setError] = useState(null);

    const initialFormState = {
        vehicleType: "",
        vehicleBrand: "",
        vehicleModel: "",
        vehicleYear: "",
        vehicleColor: "",
        vehicleRides: 0,
        vehicleRating: 0.0,
        vehicleLicensePlate: "",
        vehicleStatus: "avail",
        vehiclePricePerDay: "",
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchVehicles();
        fetchModels();
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

    const fetchModels = async () => {
        try {
            const res = await fetch("http://localhost:5050/vehicles/admin/models", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (!res.ok) throw new Error("Failed to fetch models");

            const data = await res.json();
            setModels(data);
        } catch (error) {
            console.error("Error fetching models:", error);
            setError(error.message);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (vehicle) => {
        setSelectedVehicle(vehicle);
        setFormData({
            vehicleType: vehicle.vehicle_type,
            vehicleBrand: vehicle.brand,
            vehicleModel: vehicle.model,
            vehicleYear: vehicle.year,
            vehicleColor: vehicle.color,
            vehicleRides: vehicle.rides,
            vehicleRating: vehicle.rating,
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
                            <th>Rating</th>
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
                                <td>{vehicle.rating}</td>
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
                            <Form.Group>
                                <Form.Label>Brand</Form.Label>
                                <Form.Control type="text" name="vehicleBrand" value={formData.vehicleBrand} disabled />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Model</Form.Label>
                                <Form.Control as="select" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange}>
                                    {models.map((m) => (
                                        <option key={m.model} value={m.model}>{m.model}</option>
                                    ))}
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
                            {Object.keys(initialFormState).map((key) => (
                                <Form.Group className="mb-3" key={key}>
                                    <Form.Label>{key.replace("vehicle", "")}</Form.Label>
                                    <Form.Control type="text" name={key} value={formData[key]} onChange={handleChange} />
                                </Form.Group>
                            ))}
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
