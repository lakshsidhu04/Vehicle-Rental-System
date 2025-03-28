import React, { use, useEffect, useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link ,useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

// Function to get user role from token
const GetRole = () => {
    const token = localStorage.getItem("token");
    if (!token) return "guest";
    
    try {
        const decoded = jwtDecode(token);
        return decoded.role || "guest";
    } catch (err) {
        console.error("Invalid token:", err);
        return "guest";
    }
};

const GetId = () => {
    const token = localStorage.getItem("token");
    if (!token) return "";
    
    try {
        const decoded = jwtDecode(token);
        return decoded.id || "";
    } catch (err) {
        console.error("Invalid token:", err);
        return "";
    }
}

export function NavbarComp() {
    const [role, setRole] = useState(GetRole());
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [id, setId] = useState(GetId());

    const nav = useNavigate();

    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem("token");
            setIsLoggedIn(!!token);
            setRole(GetRole()); // Update role on token change
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

                        {isLoggedIn && role === "customer" && (
                            <>
                                <Nav.Link as={Link} to="/bookings" className="mx-1">
                                    My Bookings
                                </Nav.Link>
                                <Nav.Link as={Link} to="/bookings/history" className="mx-1">
                                    Booking History
                                </Nav.Link>
                                <Nav.Link as={Link} to="/fines" className="mx-1">
                                    Fines
                                </Nav.Link>

                                <Nav.Link as={Link} to={`/customer/${id}`} className="mx-1">
                                    Profile
                                </Nav.Link>
                            </>
                        
                        )}
                        {isLoggedIn && role === "admin" && (
                            <>
                                <Nav.Link as={Link} to="/admin/earnings" className="mx-1">
                                    Earnings
                                </Nav.Link>
                                <Nav.Link as={Link} to="/admin/all-bookings" className="mx-1">
                                    All Bookings
                                </Nav.Link>
                                <Nav.Link as={Link} to="/admin/vehicles" className="mx-1">
                                    Vehicles
                                </Nav.Link>
                                <Nav.Link as={Link} to="/admin/employees" className="mx-1">
                                    Employees
                                </Nav.Link>
                                <Nav.Link as={Link} to="/admin/maintenance" className="mx-1">
                                    Maintenance
                                </Nav.Link>
                            </>
                        )}
                        {isLoggedIn && role === "employee" && (
                            <>
                                <Nav.Link as={Link} to={`/employee/${id}`} className="mx-1">
                                    Profile
                                </Nav.Link>
                                <Nav.Link as={Link} to="/employee/maintenance" className="mx-1">
                                    Maintenance Jobs
                                </Nav.Link>
                            </>
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
                                    setRole("guest"); // Reset role on logout
                                    nav("/");
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
