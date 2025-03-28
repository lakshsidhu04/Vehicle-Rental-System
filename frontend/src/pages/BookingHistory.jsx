import { useEffect, useState } from "react";
import { Table, Alert, Spinner, Container, Button, Modal } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { NavbarComp } from "../components/Navbar";

export default function BookingHistory() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState({});
    const [showModal, setShowModal] = useState(false);
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
        setShowModal(true);
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

            setShowModal(false);
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
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <tr key={booking.booking_id}>
                                        <td>{booking.booking_id}</td>
                                        <td>{booking.vehicle_model} ({booking.license_plate})</td>
                                        <td>{booking.start_date}</td>
                                        <td>{booking.end_date}</td>
                                        <td>
                                            <span className={`badge bg-${booking.status === 'rated' ? 'info' : booking.status === 'completed' ? 'success' : 'secondary'}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td>{booking.rating ? `${booking.rating} / 5` : "Not Rated"}</td>
                                        <td>
                                            {booking.status !== "ongoing" && booking.status !== "cancelled" && (
                                                <Button variant="primary" size="sm" onClick={() => handleRateClick(booking)}>
                                                    {booking.status === "rated" ? "Update Rating" : "Rate Booking"}
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center text-muted">No past bookings found.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}

                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedBooking?.status === "rated" ? "Update Rating" : "Rate Booking"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedBooking && (
                            <div className="text-center">
                                <h5>Vehicle: {selectedBooking.vehicle_model} ({selectedBooking.license_plate})</h5>
                                <div className="mt-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            size={30}
                                            className="mx-1"
                                            color={star <= rating[selectedBooking.booking_id] ? "gold" : "black"}
                                            onClick={() => handleRatingChange(star)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmitRating}>Submit</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
}
