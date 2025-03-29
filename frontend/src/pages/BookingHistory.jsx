import { useEffect, useState } from "react";
import { Table, Alert, Spinner, Container, Button, Modal, Form } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { NavbarComp } from "../components/Navbar";

export default function BookingHistory() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState({});
    const [feedback, setFeedback] = useState("");
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const fetchBookingHistory = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5050/bookings/history", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to fetch booking history");

            const data = await res.json();
            setBookings(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookingHistory();
    }, []);

    const handleRateClick = (booking) => {
        setSelectedBooking(booking);
        setRating({ [booking.booking_id]: booking.rating || 0 });
        setShowRatingModal(true);
    };

    const handleRatingChange = (newRating) => {
        setRating({ ...rating, [selectedBooking.booking_id]: newRating });
    };

    const handleSubmitRating = async () => {
        try {
            const token = localStorage.getItem("token");
            const ratingValue = rating[selectedBooking.booking_id];

            const res = await fetch(`http://localhost:5050/bookings/rating`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    vehicle_id: selectedBooking.vehicle_id,
                    rating: ratingValue,
                    booking_id: selectedBooking.booking_id,
                }),
            });

            if (!res.ok) throw new Error("Failed to update rating");

            setBookings((prev) =>
                prev.map((b) =>
                    b.booking_id === selectedBooking.booking_id
                        ? { ...b, rating: ratingValue, status: "rated" }
                        : b
                )
            );
            setShowRatingModal(false);
        } catch (err) {
            setError(err.message);
        }
    };
    
    const handleFeedbackClick = (booking) => {
        setSelectedBooking(booking);
        setFeedback(booking.feedback || "");
        setShowFeedbackModal(true);
    };

    const handleSubmitFeedback = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5050/bookings/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    booking_id: selectedBooking.booking_id,
                    feedback: feedback,
                }),
            });

            if (!res.ok) throw new Error("Failed to update feedback");

            setBookings((prev) =>
                prev.map((b) =>
                    b.booking_id === selectedBooking.booking_id
                        ? { ...b, feedback: feedback }
                        : b
                )
            );
            setShowFeedbackModal(false);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <NavbarComp />
            <Container className="py-4">
                <h2 className="mb-4 text-center">Booking History</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th>Booking ID</th>
                                <th>Vehicle</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Rating</th>
                                <th>Feedback</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <tr key={booking.booking_id}>
                                        <td>{booking.booking_id}</td>
                                        <td>
                                            {booking.vehicle_model} ({booking.license_plate})
                                        </td>
                                        <td>{new Date(booking.start_date).toLocaleDateString()}</td>
                                        <td>{new Date(booking.end_date).toLocaleDateString()}</td>
                                        <td>
                                            <span
                                                className={`badge bg-${booking.status === "rated"
                                                        ? "info"
                                                        : booking.status === "completed"
                                                            ? "success"
                                                            : "secondary"
                                                    }`}
                                            >
                                                {booking.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>{booking.rating ? `${booking.rating} / 5` : "Not Rated"}</td>
                                        <td>{booking.feedback ? booking.feedback : "No Feedback"}</td>
                                        <td>

                                            {booking.status !== "ongoing" &&
                                                booking.status !== "cancelled" && (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleRateClick(booking)}
                                                    >
                                                        {booking.rating ? "Update Rating" : "Rate Booking"}
                                                    </Button>
                                                )}
                                            {/* Show feedback option for any booking that is not ongoing or cancelled */}
                                            {booking.status !== "ongoing" &&
                                                booking.status !== "cancelled" && (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => handleFeedbackClick(booking)}
                                                        style={{ marginLeft: "5px" }}
                                                    >
                                                        {booking.feedback ? "Update Feedback" : "Add Feedback"}
                                                    </Button>
                                                )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center text-muted">
                                        No past bookings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
                
                <Modal
                    show={showRatingModal}
                    onHide={() => setShowRatingModal(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {selectedBooking?.status === "rated"
                                ? "Update Rating"
                                : "Rate Booking"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedBooking && (
                            <div className="text-center">
                                <h5>
                                    Vehicle: {selectedBooking.vehicle_model} (
                                    {selectedBooking.license_plate})
                                </h5>
                                <div className="mt-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            size={30}
                                            className="mx-1"
                                            color={
                                                star <= rating[selectedBooking.booking_id]
                                                    ? "gold"
                                                    : "black"
                                            }
                                            onClick={() => handleRatingChange(star)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setShowRatingModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmitRating}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>
                
                <Modal
                    show={showFeedbackModal}
                    onHide={() => setShowFeedbackModal(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {selectedBooking && selectedBooking.feedback
                                ? "Update Feedback"
                                : "Add Feedback"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="feedback">
                                <Form.Label>Your Feedback</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setShowFeedbackModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmitFeedback}>
                            Submit Feedback
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
}
