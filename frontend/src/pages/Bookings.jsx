import { useState, useEffect } from "react";
import { NavbarComp } from "../components/Navbar";
import { Card, Container, Row, Col, Badge, Button, Modal, Form } from "react-bootstrap";

export function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("credit_card");

    const fetchBookingData = async () => {
        try {
            const response = await fetch("http://localhost:5050/bookings", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            } else {
                console.error("Failed to fetch data");
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchBookingData();
    }, []);

    const handlePaymentClick = (booking) => {
        setSelectedBooking(booking);
        setShowModal(true);
    };

    const confirmPayment = async () => {
        if (!selectedBooking) return;

        try {
            const amount = selectedBooking.price_per_day * (new Date(selectedBooking.end_date) - new Date(selectedBooking.start_date)) / (1000 * 60 * 60 * 24);

            const response = await fetch(`http://localhost:5050/bookings/confirm`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    booking_id: selectedBooking.booking_id,
                    amount: amount,
                    payment_method: paymentMethod,
                }),
            });
            
            if (response.ok) {
                setBookings(bookings.map(b =>
                    b.booking_id === selectedBooking.booking_id ? { ...b, status: "confirmed" } : b
                ));
                setShowModal(false);
            } else {
                console.error("Failed to confirm payment");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <NavbarComp />
            <Container className="mt-5 pt-5">
                <h1 className="mb-4 text-center">My Bookings</h1>
                <Row className="g-4">
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <Col key={booking.booking_id} md={6} lg={4}>
                                <Card className="shadow-sm">
                                    <Card.Body>
                                        <h5 className="fw-bold">
                                            {booking.brand} {booking.model} - {booking.license_plate}
                                        </h5>
                                        <p className="mb-1 text-muted">
                                            {booking.color}, {booking.year}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Booking Dates:</strong> {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Price per Day:</strong> ₹{booking.price_per_day}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Booked By:</strong> {booking.customer_name} ({booking.customer_email})
                                        </p>
                                        <Badge
                                            bg={
                                                booking.status === "confirmed" ? "success"
                                                    : booking.status === "pending" ? "warning"
                                                        : booking.status === "cancelled" ? "danger"
                                                            : "secondary"
                                            }
                                            className="p-2"
                                        >
                                            {booking.status.toUpperCase()}
                                        </Badge>

                                        {booking.status === "pending" && (
                                            <Button variant="primary" className="mt-3 w-100" onClick={() => handlePaymentClick(booking)}>
                                                Make Payment
                                            </Button>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p className="text-muted text-center">No bookings found.</p>
                    )}
                </Row>
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to confirm the payment for this booking?</p>
                    <Form>
                        <Form.Group controlId="paymentMethod">
                            <Form.Label>Select Payment Method</Form.Label>
                            <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option value="credit_card">Credit Card</option>
                                <option value="debit_card">Debit Card</option>
                                <option value="netbanking">Net Banking</option>
                                <option value="upi">UPI</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={confirmPayment}>
                        Confirm Payment
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
