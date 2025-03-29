import { useState, useEffect } from "react";
import { NavbarComp } from "../components/Navbar";
import { Card, Container, Row, Col, Badge, Button, Modal, Form } from "react-bootstrap";

export function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showBillModal, setShowBillModal] = useState(false);
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
        setShowPaymentModal(true);
    };

    const confirmPayment = async () => {
        if (!selectedBooking) return;

        try {
            // Calculate total amount based on days of booking
            const days = (new Date(selectedBooking.end_date) - new Date(selectedBooking.start_date)) / (1000 * 60 * 60 * 24);
            const amount = selectedBooking.price_per_day * days;

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
                    b.booking_id === selectedBooking.booking_id ? { ...b, status: "confirmed", total_amount: amount } : b
                ));
                setShowPaymentModal(false);
                // Show bill modal after successful payment confirmation
                setShowBillModal(true);
            } else {
                console.error("Failed to confirm payment");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancelPayment = async (booking) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        if(booking.status==="pending"){
            // just remove the booking
            console.log('removing pending booking');
            const response = await fetch(`http://localhost:5050/bookings/pending/cancel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    booking_id: booking.booking_id,
                }),
            });
            setBookings(bookings.filter(b => b.booking_id !== booking.booking_id));
            return;
        }
        try {
            const response = await fetch(`http://localhost:5050/bookings/cancel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    booking_id: booking.booking_id,
                }),
            });
            if (response.ok) {
                setBookings(bookings.map(b =>
                    b.booking_id === booking.booking_id ? { ...b, status: "cancelled" } : b
                ));
            } else {
                console.error("Failed to cancel booking");
            }
        } catch (err) {
            console.error(err);
        }
    };
    
    const handlePrintBill = () => {
        window.print();
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
                                            <>
                                                <Button variant="primary" className="mt-3 w-100" onClick={() => handlePaymentClick(booking)}>
                                                    Make Payment
                                                </Button>
                                            </>
                                        )}
                                        {booking.status === "confirmed" && (
                                            <>
                                                <Button variant="info" className="mt-3 w-100" onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setShowBillModal(true);
                                                }}>
                                                    View Bill
                                                </Button>
                                                <Button variant="danger" className="mt-2 w-100" onClick={() => handleCancelPayment(booking)}>
                                                    Cancel Booking
                                                </Button>
                                            </>
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

            {/* Payment Confirmation Modal */}
            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
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
                    <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={confirmPayment}>
                        Confirm Payment
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Bill Modal */}
            <Modal show={showBillModal} onHide={() => setShowBillModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Booking Bill</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBooking ? (
                        <div>
                            <h5>
                                {selectedBooking.brand} {selectedBooking.model}
                            </h5>
                            <p>
                                <strong>License Plate:</strong> {selectedBooking.license_plate}
                            </p>
                            <p>
                                <strong>Booking Dates:</strong> {new Date(selectedBooking.start_date).toLocaleDateString()} - {new Date(selectedBooking.end_date).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Price per Day:</strong> ₹{selectedBooking.price_per_day}
                            </p>
                            <p>
                                <strong>Total Amount:</strong> ₹{selectedBooking.price_per_day * ((new Date(selectedBooking.end_date) - new Date(selectedBooking.start_date)) / (1000 * 60 * 60 * 24)+1)}
                            </p>
                            <p>
                                <strong>Pick-up Location:</strong> <a href="https://www.google.com/maps/@17.3799846,78.5514121,790m/data=!3m1!1e3?entry=ttu&g_ep=EgoyMDI1MDMyNS4xIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer">View on Map</a>
                            </p>
                        </div>
                    ) : (
                        <p>No booking selected</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowBillModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handlePrintBill}>
                        Print Bill
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
