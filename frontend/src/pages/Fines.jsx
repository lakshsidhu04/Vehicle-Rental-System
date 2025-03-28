import React, { useEffect, useState } from "react";
import { Container, Table, Alert, Button, Modal, Form } from "react-bootstrap";
import { NavbarComp } from "../components/Navbar";

export function Fines() {
    const [fines, setFines] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedFine, setSelectedFine] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("Credit Card");

    const fetchFines = async () => {
        try {
            const response = await fetch(`http://localhost:5050/fines`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch fines");
            }

            setFines(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchFines();
    }, []);

    const handlePayFineClick = (fine) => {
        setSelectedFine(fine);
        setShowModal(true);
    };

    const handleConfirmPayment = async () => {
        if (!selectedFine) return;

        try {
            setSuccessMessage("");
            setError("");

            const response = await fetch(`http://localhost:5050/fines/payFine`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    booking_id: selectedFine.booking_id,
                    payment_method: paymentMethod,
                    amount : selectedFine.cost
                }),
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Payment failed");
            }

            setSuccessMessage(`Fine for ${selectedFine.model} (₹${selectedFine.cost}) paid successfully!`);
            
            setFines((prevFines) => prevFines.filter((fine) => fine.fine_id !== selectedFine.fine_id));

            // Close modal
            setShowModal(false);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container className="mt-4">
            <NavbarComp />
            <h2>Fines</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            {fines.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Vehicle</th>
                            <th>License Plate</th>
                            <th>Amount</th>
                            <th>Reason</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fines.map((fine, index) => (
                            <tr key={fine.fine_id}>
                                <td>{index + 1}</td>
                                <td>{fine.model}</td>
                                <td>{fine.license_plate}</td>
                                <td>₹{fine.cost}</td>
                                <td>{fine.description}</td>
                                <td>
                                    <Button variant="success" onClick={() => handlePayFineClick(fine)}>
                                        Pay Fine
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No fines found.</p>
            )}

            {/* Payment Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Pay Fine</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <strong>Vehicle:</strong> {selectedFine?.model}
                    </p>
                    <p>
                        <strong>License Plate:</strong> {selectedFine?.license_plate}
                    </p>
                    <p>
                        <strong>Amount:</strong> ₹{selectedFine?.cost}
                    </p>

                    <Form>
                        <Form.Group>
                            <Form.Label>Select Payment Method</Form.Label>
                            <Form.Control
                                as="select"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option>Credit Card</option>
                                <option>Debit Card</option>
                                <option>UPI</option>
                                <option>Net Banking</option>
                                <option>Cash</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirmPayment}>
                        Confirm Payment
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
