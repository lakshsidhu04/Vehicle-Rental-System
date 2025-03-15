import React, { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

export function AdminLoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5050/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password, role: 'admin' }),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                nav("/home");
            }
            else {
                console.error("Failed to login");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const redirectLogin = async () => {
        nav("/");
    }


    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card style={{ width: "350px", padding: "20px", borderRadius: "10px" }}>
                <Card.Title className="text-center">Employee Login</Card.Title>
                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        Login as Admin
                    </Button>

                    <Button variant="secondary" className="w-100 mt-2" onClick={redirectLogin} >
                        Login as Customer
                    </Button>
                </Form>
            </Card>
        </Container>
    );
}
