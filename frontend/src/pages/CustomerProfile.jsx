import { useEffect, useState } from "react";
import { Card, Container, Spinner, Alert, Button, Form, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { NavbarComp } from "../components/Navbar";
export default function CustomerProfile() {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [totalBookings, setTotalBookings] = useState(0); // NEW STATE
    const [updatedProfile, setUpdatedProfile] = useState({
        name: "",
        phone_number: "", // Consistent with API response
    });

    useEffect(() => {
        fetchCustomerProfile();
        fetchTotalBookings(); // Fetch total bookings on mount
    }, []);

    const fetchCustomerProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5050/customers/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to fetch profile");

            const data = await res.json();
            setCustomer(data);
            setUpdatedProfile({ name: data.name, phone_number: data.phone_number });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchTotalBookings = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5050/customers/count", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to fetch total bookings");

            const data = await res.json();
            setTotalBookings(data.total_bookings); // Save total bookings in state
        } catch (error) {
            console.error(error);
            setTotalBookings(0);
        }
    };

    const handleEditClick = () => {
        setShowModal(true);
    };

    const handleChange = (e) => {
        setUpdatedProfile({ ...updatedProfile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5050/customer/update", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedProfile),
            });

            if (!res.ok) throw new Error("Failed to update profile");

            setCustomer((prev) => ({ ...prev, ...updatedProfile }));
            setShowModal(false);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <NavbarComp />
            <Container className="py-4">
                <h2 className="mb-4 text-center">Customer Profile</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <Card className="shadow-lg p-4">
                        <Card.Body>
                            <h4>{customer.name}</h4>
                            <p><strong>Email:</strong> {customer.email}</p>
                            <p><strong>Phone:</strong> {customer.phone_number || "Not Provided"}</p>
                            <p><strong>Total Bookings:</strong> {totalBookings}</p>
                            <p><strong>Average Rating Given:</strong> {customer.avg_rating ? customer.avg_rating.toFixed(1) : "N/A"}</p>
                            <Button variant="primary" onClick={handleEditClick}>Edit Profile</Button>
                        </Card.Body>
                    </Card>
                )}

                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={updatedProfile.name}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="phone_number"
                                    value={updatedProfile.phone_number}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
}
