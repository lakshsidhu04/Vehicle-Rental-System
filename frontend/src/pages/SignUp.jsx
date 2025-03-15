import React, { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

export function SignupForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        age: "",
        phoneNumber: "",
        address: "",
        licenseNumber: ""
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password || !formData.licenseNumber) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5050/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Signup successful!");
                navigate("/");
            } else {
                setError(data.message || "Signup failed.");
            }
        } catch (err) {
            setError("Error connecting to server.");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card style={{ width: "400px", padding: "20px", borderRadius: "10px" }}>
                <Card.Title className="text-center">Sign Up</Card.Title>
                {error && <p className="text-danger text-center">{error}</p>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" placeholder="Enter full name" value={formData.name} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Age</Form.Label>
                        <Form.Control type="number" name="age" placeholder="Enter age" value={formData.age} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="text" name="phoneNumber" placeholder="Enter phone number" value={formData.phoneNumber} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" name="address" placeholder="Enter address" value={formData.address} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>License Number</Form.Label>
                        <Form.Control type="text" name="licenseNumber" placeholder="Enter license number" value={formData.licenseNumber} onChange={handleChange} required />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        Sign Up
                    </Button>

                    <p className="text-center mt-3">
                        Already have an account? <Link to="/">Login here</Link>
                    </p>
                </Form>
            </Card>
        </Container>
    );
}
