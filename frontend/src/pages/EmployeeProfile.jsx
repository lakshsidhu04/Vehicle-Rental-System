import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Alert, Spinner, Container, Row, Col } from "react-bootstrap";
import { NavbarComp } from "../components/Navbar";
import profile from "../assets/profile.png";

export default function EmployeeProfile() {
    const { id } = useParams();  // Get employee ID from URL
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchEmployee = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5050/employees/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to fetch employee details");

            const data = await res.json();
            setEmployee(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployee();
    }, [id]);

    return (
        <>
            <NavbarComp />
            <Container style={{ padding: "20px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
                <h2 className="text-center mb-4">Employee Profile</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    employee && (
                        <Card className="shadow-lg p-4 rounded-4" style={{ maxWidth: "600px", margin: "auto" }}>
                            <Row className="align-items-center">
                                <Col xs={4} className="text-center">
                                    <img
                                        src={profile}
                                        alt="Profile"
                                        className="rounded-circle border"
                                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                    />
                                </Col>
                                <Col xs={8}>
                                    <Card.Body>
                                        <Card.Title className="text-primary fw-bold" style={{ fontSize: "1.5rem" }}>
                                            {employee.name}
                                        </Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            {employee.username}
                                        </Card.Subtitle>
                                        <hr />
                                        <Card.Text className="text-dark">
                                            <strong>Email:</strong> {employee.email} <br />
                                            <strong>Phone:</strong> {employee.phone_number} <br />
                                            <strong>Joining Date:</strong> {new Date(employee.hire_date).toLocaleDateString()}
                                        </Card.Text>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    )
                )}
            </Container>
        </>
    );
}
