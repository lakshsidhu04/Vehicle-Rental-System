import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export function NavbarComp() {
    return (
        <Navbar expand="lg" style={{ backgroundColor: "#121212" }} variant="dark" fixed="top">
            <Container>
                <Navbar.Brand as={Link} to="/" style={{ color: "#e0e0e0", fontWeight: "bold" }}>
                    VRS
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/" style={{ color: "#b0b0b0" }}>Home</Nav.Link>
                        <Nav.Link as={Link} to="/about" style={{ color: "#b0b0b0" }}>About</Nav.Link>
                        <Nav.Link as={Link} to="/vehicles" style={{ color: "#b0b0b0" }}>Vehicles</Nav.Link>
                    </Nav>
                    <Nav>
                        <Button as={Link} to="/" variant="outline-light" style={{ borderColor: "#b0b0b0", color: "#b0b0b0" }}>
                            Login
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
