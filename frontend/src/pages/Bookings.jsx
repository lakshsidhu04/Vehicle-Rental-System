import { useState, useEffect } from "react";
import { NavbarComp } from "../components/Navbar";
import { Card, Container, Row, Col, Badge } from "react-bootstrap";

export function Bookings() {
    const [bookings, setBookings] = useState([]);

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
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p className="text-muted text-center">No bookings found.</p>
                    )}
                </Row>
            </Container>
        </>
    );
}
