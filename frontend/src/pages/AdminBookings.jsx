import { useEffect, useState } from "react";
import { Table, Container, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { NavbarComp } from "../components/Navbar";

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAllBookings = async () => {
        try {
            const response = await fetch("http://localhost:5050/bookings/admin", {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch bookings");
            }
            
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllBookings();
    }, []);

    return (
        <>
            <NavbarComp />
            <Container className="mt-4">
                <h2 className="text-white">All Customer Bookings</h2>

                {loading && <Spinner animation="border" variant="light" />}
                {error && <Alert variant="danger">{error}</Alert>}

                <Table striped bordered hover variant="dark" className="mt-3">
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Customer</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Vehicle</th>
                            <th>License Plate</th>
                            <th>Type</th>
                            <th>Brand</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Price/Day ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan="12" className="text-center text-muted">
                                    No bookings available
                                </td>
                            </tr>
                        ) : (
                            bookings.map((booking) => (
                                <tr key={booking.booking_id}>
                                    <td>
                                        <Link
                                            to={`/admin/bookings/${booking.booking_id}`}
                                            style={{ color: "#ffc107", textDecoration: "none" }}
                                        >
                                            {booking.booking_id}
                                        </Link>
                                    </td>
                                    <td>{booking.customer_name}</td>
                                    <td>{booking.customer_email}</td>
                                    <td>{booking.phone_number}</td>
                                    <td>{booking.model}</td>
                                    <td>{booking.license_plate}</td>
                                    <td>{booking.vehicle_type}</td>
                                    <td>{booking.brand}</td>
                                    <td>{new Date(booking.start_date).toLocaleDateString()}</td>
                                    <td>{new Date(booking.end_date).toLocaleDateString()}</td>
                                    <td
                                        style={{
                                            color:
                                                booking.status === "confirmed"
                                                    ? "lightgreen"
                                                    : booking.status === "pending"
                                                        ? "yellow"
                                                        : "red",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {booking.status.toUpperCase()}
                                    </td>
                                    <td>${booking.price_per_day}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Container>
        </>
    );
}
