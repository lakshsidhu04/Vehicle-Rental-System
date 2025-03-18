import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export function Footer() {
    return (
        <footer style={{
            backgroundColor: "#121212",
            color: "#ffffff",
            padding: "20px 0",
            width: "100%",  // Use 100% to span full width without extra scroll width issues
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
                            <li><a href="/" style={{ color: "#bbb", textDecoration: "none" }}>Home</a></li>
                            <li><a href="/vehicles" style={{ color: "#bbb", textDecoration: "none" }}>Browse Vehicles</a></li>
                            <li><a href="/about" style={{ color: "#bbb", textDecoration: "none" }}>About Us</a></li>
                            <li><a href="/contact" style={{ color: "#bbb", textDecoration: "none" }}>Contact</a></li>
                        </ul>
                    </Col>
                    <Col md={4} className="mb-3" style={{ padding: "0 15px" }}>
                        <h5>Follow Us</h5>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ marginRight: "10px", color: "#bbb", textDecoration: "none" }}>
                            Facebook
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ marginRight: "10px", color: "#bbb", textDecoration: "none" }}>
                            Twitter
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ marginRight: "10px", color: "#bbb", textDecoration: "none" }}>
                            Instagram
                        </a>
                    </Col>
                </Row>
                <hr style={{ borderColor: "#bbb", margin: "0" }} />
            </Container>
        </footer>
    );
}
