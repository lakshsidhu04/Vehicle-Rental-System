import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export function Footer() {
    return (
        <footer style={{
            backgroundColor: "#f8f9fa",  
            color: "#212529", 
            padding: "20px 0",
            width: "100%",
            margin: 0,
            boxSizing: "border-box",
            overflow: "hidden",
        }}>
            <Container fluid style={{ padding: "0", margin: "0" }}>
                <Row style={{ margin: "0", padding: "0" }}>
                    <Col md={4} className="mb-3" style={{ padding: "0 15px" }}>
                        <h5>Contact Us</h5>
                        <p>Email: support@vehiclerental.com</p>
                        <p>Phone: +91 98765 43210</p>
                        <p>Address: IIT Hyderabad, Telangana, India</p>
                    </Col>
                    <Col md={4} className="mb-3" style={{ padding: "0 15px" }}>
                        <h5>Quick Links</h5>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            <li><a href="/" style={{ color: "#007bff", textDecoration: "none" }}>Home</a></li>
                            <li><a href="/vehicles" style={{ color: "#007bff", textDecoration: "none" }}>Browse Vehicles</a></li>
                            <li><a href="/about" style={{ color: "#007bff", textDecoration: "none" }}>About Us</a></li>
                            <li><a href="/contact" style={{ color: "#007bff", textDecoration: "none" }}>Contact</a></li>
                        </ul>
                    </Col>
                    <Col md={4} className="mb-3" style={{ padding: "0 15px" }}>
                        <h5>Follow Us</h5>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ marginRight: "10px", color: "#007bff", textDecoration: "none" }}>
                            Facebook
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ marginRight: "10px", color: "#007bff", textDecoration: "none" }}>
                            Twitter
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ marginRight: "10px", color: "#007bff", textDecoration: "none" }}>
                            Instagram
                        </a>
                    </Col>
                </Row>
                <hr style={{ borderColor: "#ccc", margin: "0" }} />
                <p className="text-center" style={{ marginTop: "10px", fontSize: "14px", color: "#6c757d" }}>
                    © 2025 Vehicle Rental. All rights reserved.
                </p>
            </Container>
        </footer>
    );
}
