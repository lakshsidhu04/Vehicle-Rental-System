import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export function NavbarComp() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
        
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
        };

        window.addEventListener("storage", handleStorageChange);
        
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <Navbar expand="lg" bg="dark" variant="dark" fixed="top" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/home" className="fw-bold">
                    VRS
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/home" className="mx-1">
                            Home
                        </Nav.Link>
                        {isLoggedIn && (
                            <Nav.Link as={Link} to="/bookings" className="mx-1">
                                My Bookings
                            </Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                        {!isLoggedIn ? (
                            <Button as={Link} to="/" variant="outline-light" className="px-4">
                                Login
                            </Button>
                        ) : (
                            <Button
                                variant="outline-light"
                                className="px-4"
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    setIsLoggedIn(false);
                                }}
                            >
                                Logout
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}