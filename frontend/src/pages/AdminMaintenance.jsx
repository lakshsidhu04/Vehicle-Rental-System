import { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Button, Card, Modal, Form } from "react-bootstrap";
import { NavbarComp } from "../components/Navbar";
import { FaPlus } from "react-icons/fa";

export function MaintenanceVehicles() {
    const [maint, setMaint] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMaintenance, setNewMaintenance] = useState({
        vehicle_id: "",
        description: "",
        cost: "",
        maintenance_date: "",
    });
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState(null);

    const fetchMaintenanceVehicles = async () => {
        try {
            const response = await fetch("http://localhost:5050/maintenance", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch maintenance vehicles.");

            const data = await response.json();
            setMaint(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaintenanceVehicles();
    }, []);

    const handleChange = (e) => {
        setNewMaintenance({ ...newMaintenance, [e.target.name]: e.target.value });
    };

    const handleAddMaintenance = async (e) => {
        e.preventDefault();
        setAdding(true);
        setAddError(null);

        try {
            const response = await fetch("http://localhost:5050/maintenance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({newMaintenance}),
            });

            if (!response.ok) throw new Error("Failed to add maintenance record.");

            setShowAddModal(false);
            fetchMaintenanceVehicles(); // Refresh the list
        } catch (err) {
            setAddError(err.message);
        } finally {
            setAdding(false);
        }
    };

    return (
        <>
            <NavbarComp />
            <Container className="d-flex flex-column align-items-center" style={{ padding: "20px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
                <Card className="shadow-lg rounded-4 p-4 w-100" style={{ maxWidth: "900px" }}>
                    <h2 className="mb-4 text-center text-primary">Vehicles Under Maintenance</h2>

                    <Button variant="success" className="mb-3" onClick={() => setShowAddModal(true)}>
                        <FaPlus /> Add Maintenance
                    </Button>

                    {error && <Alert variant="danger">{error}</Alert>}

                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : maint.length === 0 ? (
                        <Alert variant="info">No vehicles are currently under maintenance.</Alert>
                    ) : (
                        <Table striped bordered hover responsive className="text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>License Plate</th>
                                    <th>Cost</th>
                                    <th>Maintenance Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {maint.map((m, index) => (
                                    <tr key={m.maintenance_id}>
                                        <td className="fw-bold">{index + 1}</td>
                                        <td>{m.brand}</td>
                                        <td>{m.model}</td>
                                        <td>{m.license_plate}</td>
                                        <td>{m.cost}</td>
                                        <td>{m.description || "Not specified"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card>
            </Container>

            {/* Add Maintenance Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Maintenance Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {addError && <Alert variant="danger">{addError}</Alert>}
                    <Form onSubmit={handleAddMaintenance}>
                        <Form.Group className="mb-3">
                            <Form.Label>Vehicle ID</Form.Label>
                            <Form.Control
                                type="number"
                                name="vehicle_id"
                                value={newMaintenance.vehicle_id}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={newMaintenance.description}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Cost</Form.Label>
                            <Form.Control
                                type="number"
                                name="cost"
                                value={newMaintenance.cost}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Maintenance Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="maintenance_date"
                                value={newMaintenance.maintenance_date}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100" disabled={adding}>
                            {adding ? "Adding..." : "Add Maintenance"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}
