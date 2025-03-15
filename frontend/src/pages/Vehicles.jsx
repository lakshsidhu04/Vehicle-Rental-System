import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";

export function AdminVehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [models, setModels] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [formData, setFormData] = useState({
        model: "",
        year: "",
        color: "",
        rides: 0,
        rating: 0.0,
        license_plate: "",
        status: "avail",
        price_per_day: ""
    });

    // Fetch Vehicles
    const fetchVehicles = async () => {
        try {
            const res = await fetch("http://localhost:5050/vehicles");
            const data = await res.json();
            setVehicles(data);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        }
    };
    
    // Fetch Vehicle Models (For Dropdown)
    const fetchModels = async () => {
        try {
            const res = await fetch("http://localhost:5050/vehicle/models");
            const data = await res.json();
            setModels(data);
        } catch (error) {
            console.error("Error fetching vehicle models:", error);
        }
    };
    
    useEffect(() => {
        fetchVehicles();
        fetchModels();
    }, []);
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleEdit = (vehicle) => {
        setSelectedVehicle(vehicle);
        setFormData(vehicle);
        setShowModal(true);
    };
    
    const handleDelete = async (vehicle_id) => {
        if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
        try {
            await fetch(`http://localhost:5050/vehicles/${vehicle_id}`, { method: "DELETE" });
            fetchVehicles();
        } catch (error) {
            console.error("Error deleting vehicle:", error);
        }
    };
    
    const handleSave = async () => {
        try {
            await fetch(`http://localhost:5050/vehicles/${selectedVehicle.vehicle_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            setShowModal(false);
            fetchVehicles();
        } catch (error) {
            console.error("Error updating vehicle:", error);
        }
    };

    return (
        <div style={{ padding: "20px", color: "#fff", backgroundColor: "#181818", minHeight: "100vh" }}>
            <h2>Admin Vehicle Management</h2>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Model</th>
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
                            <td>{vehicle.model}</td>
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

            {/* Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Vehicle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Model</Form.Label>
                            <Form.Control as="select" name="model" value={formData.model} onChange={handleChange}>
                                {models.map((m) => (
                                    <option key={m.model} value={m.model}>{m.brand} - {m.model}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Year</Form.Label>
                            <Form.Control type="number" name="year" value={formData.year} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Color</Form.Label>
                            <Form.Control type="text" name="color" value={formData.color} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Rides</Form.Label>
                            <Form.Control type="number" name="rides" value={formData.rides} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Rating</Form.Label>
                            <Form.Control type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>License Plate</Form.Label>
                            <Form.Control type="text" name="license_plate" value={formData.license_plate} disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Status</Form.Label>
                            <Form.Control as="select" name="status" value={formData.status} onChange={handleChange}>
                                <option value="avail">Available</option>
                                <option value="booked">Booked</option>
                                <option value="maintenance">Maintenance</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price/Day</Form.Label>
                            <Form.Control type="number" name="price_per_day" value={formData.price_per_day} onChange={handleChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
