import { useState, useEffect } from "react";
import { NavbarComp } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Container, Row, Col, Card, Table, Alert, Spinner } from "react-bootstrap";
import carImage from "../assets/car.jpg";
import bikeImage from "../assets/bike.jpg";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import fifty from "../assets/fifty.png";
import forty from "../assets/forty.png";

const styles = {
    homeContainer: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
    },
    contentWrapper: {
        flex: "1 0 auto",
        width: "100%",
    },
    headerSection: {
        width: "100%",
        padding: "2rem 0",
        backgroundColor: "#f8f9fa",
    },
    searchForm: {
        margin: "1rem 0 2rem",
        padding: "1.5rem",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    vehiclesContainer: {
        width: "100%",
        paddingBottom: "2rem",
    },
    footer: {
        width: "100%",
        flexShrink: 0,
    }
};

const GetRole = () => {
    const token = localStorage.getItem("token");
    if (!token) return "guest";
    try {
        // Note: use your jwt-decode library correctly
        const decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded.role || "guest";
    } catch (err) {
        console.error("Invalid token:", err);
        return "guest";
    }
};

function CouponsAds() {
    const coupons = [
        { code: "SAVE10", discount: "10%", description: "Save 10% on your booking" },
        { code: "SUMMER15", discount: "15%", description: "Summer Special discount of 15%" },
        { code: "FESTIVE20", discount: "20%", description: "Festive season offer: 20% off" },
    ];

    const ads = [
        { image: fifty, link: "https://example.com/ad1", title: "Ad 1" },
        { image: forty, link: "https://example.com/ad2", title: "Ad 2" },
    ];

    return (
        <>
            <h2 className="text-center mt-5">Exclusive Coupons at our Stores</h2>
            <Row className="mt-3">
                {coupons.map((coupon, idx) => (
                    <Col key={idx} md={4} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>{coupon.code}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{coupon.discount} Off</Card.Subtitle>
                                <Card.Text>{coupon.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <h2 className="text-center mt-5">Advertisements</h2>
            <Row className="mt-3">
                {ads.map((ad, idx) => (
                    <Col key={idx} md={6} className="mb-3">
                        <a href={ad.link} target="_blank" rel="noreferrer">
                            <Card>
                                <Card.Img variant="top" src={ad.image} alt={ad.title} style={{ height: '200px', width: '100%', objectFit: 'contain' }} />
                                {/* <Card.Body>
                                    <Card.Title>{ad.title}</Card.Title>
                                </Card.Body> */}
                            </Card>
                        </a>
                    </Col>
                ))}
            </Row>
        </>
    );
}

export function Home() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState(GetRole());
    const nav = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        const styleTag = document.createElement('style');
        styleTag.innerHTML = `
            body {
                margin: 0;
                padding: 0;
                overflow-x: hidden;
            }
            .container-fluid {
                width: 100%;
                max-width: 100%;
                padding-right: 0;
                padding-left: 0;
            }
        `;
        document.head.appendChild(styleTag);
        return () => {
            document.head.removeChild(styleTag);
        };
    }, []);

    const fetchAvailableVehicles = async () => {
        if (!startDate || !endDate) {
            alert("Please select start and end dates.");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5050/vehicles/available?startDate=${startDate}&endDate=${endDate}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setVehicles(data);
            } else {
                console.error("Failed to fetch available vehicles");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = (vehicle) => {
        if (role === "customer") {
            setSelectedVehicle(vehicle);
            setShowModal(true);
        } else {
            setShowLoginModal(true);
        }
    };

    const handleLoginRedirect = () => {
        setShowLoginModal(false);
        nav("/");
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? <AiFillStar key={i} color="#ffd700" size={20} /> : <AiOutlineStar key={i} color="#ffd700" size={20} />);
        }
        return stars;
    };

    const handleDateChange = (type, value) => {
        const today = new Date().toISOString().split("T")[0];
        if (type === "start") {
            if (value < today) {
                alert("Start date cannot be in the past.");
                setStartDate("");
            } else {
                setStartDate(value);
                if (endDate && value > endDate) {
                    alert("Start date cannot be after the end date.");
                    setEndDate("");
                }
            }
        } else if (type === "end") {
            if (value < today) {
                alert("End date cannot be in the past.");
                setEndDate("");
            } else if (startDate && value < startDate) {
                alert("End date cannot be before the start date.");
                setEndDate("");
            } else {
                setEndDate(value);
            }
        }
    };

    const confirmBooking = async () => {
        if (!selectedVehicle || !startDate || !endDate) {
            alert("Invalid booking details.");
            return;
        }
        try {
            const response = await fetch("http://localhost:5050/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    vehicle_id: selectedVehicle.vehicle_id,
                    start_date: startDate,
                    end_date: endDate,
                }),
            });
            if (response.ok) {
                alert("Booking confirmed!");
                setShowModal(false);
                setSelectedVehicle(null);
                fetchAvailableVehicles();
            } else {
                alert("Failed to book vehicle.");
            }
        } catch (err) {
            console.error("Error booking vehicle:", err);
        }
    };

    useEffect(() => {
        // This useEffect was added earlier, but make sure to remove unnecessary calls.
    }, [startDate, endDate]);

    return (
        <div style={styles.homeContainer}>
            <NavbarComp />
            <div style={styles.contentWrapper}>
                <div style={styles.headerSection}>
                    <h1 className="mb-4 text-center">Find Available Vehicles</h1>
                </div>
                <Container>
                    <Form className="mb-4" style={styles.searchForm}>
                        <Row>
                            <Col md={5}>
                                <Form.Group>
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="date" value={startDate} onChange={(e) => handleDateChange("start", e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col md={5}>
                                <Form.Group>
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type="date" value={endDate} onChange={(e) => handleDateChange("end", e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col md={2} className="d-flex align-items-end">
                                <Button className="w-100" style={styles.searchBtn} onClick={fetchAvailableVehicles}>Search</Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
                <Container fluid style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                    {loading ? (
                        <div style={styles.spinnerContainer}>
                            <span className="spinner-border text-primary" role="status"></span>
                            <p>Loading vehicles...</p>
                        </div>
                    ) : (
                        <Row>
                            {vehicles.map((vehicle) => (
                                <Col key={vehicle.vehicle_id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                                    <div
                                        className="card shadow-lg border-0 rounded-3 h-100"
                                        style={styles.vehicleCard}
                                        onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                                        onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                                    >
                                        <img
                                            src={vehicle.vehicle_type === "Bike" ? bikeImage : carImage}
                                            alt={`${vehicle.brand} ${vehicle.model}`}
                                            className="card-img-top"
                                            style={{ height: "200px", width: "100%", objectFit: "contain" }}
                                        />
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">{vehicle.brand} {vehicle.model}</h5>
                                            <p className="card-text">
                                                <strong>License Plate:</strong> {vehicle.license_plate} <br />
                                                <strong>Price per Day:</strong> ₹{vehicle.price_per_day} <br />
                                                <strong>Total Price: ₹{vehicle.price_per_day * (1 + (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))}</strong> <br />
                                                <strong>Rating: </strong> {renderStars(vehicle.rating || 0)}
                                            </p>
                                            <button
                                                className="btn btn-primary w-100 mt-auto"
                                                style={styles.bookBtn}
                                                onClick={() => handleBooking(vehicle)}
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Container>
                <Container className="mt-5">
                    <CouponsAds />
                </Container>
            </div>
            <Footer />
            <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Login Required</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You must be logged in as a customer to book a vehicle.</p>
                    <p>Do you want to go to the login page?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLoginModal(false)}>Stay Here</Button>
                    <Button variant="primary" onClick={handleLoginRedirect}>Go to Login</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Booking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedVehicle && (
                        <>
                            <p><strong>Vehicle:</strong> {selectedVehicle.brand} {selectedVehicle.model}</p>
                            <p><strong>License Plate:</strong> {selectedVehicle.license_plate}</p>
                            <p><strong>Price per Day:</strong> ₹{selectedVehicle.price_per_day}</p>
                            <p><strong>Booking Period:</strong> {startDate} to {endDate}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={confirmBooking}>Confirm Booking</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Home;
