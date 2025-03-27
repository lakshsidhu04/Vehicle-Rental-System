import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Table, Alert } from "react-bootstrap";

export function Fines() {
    const [fines, setFines] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFines = async () => {
            try {
                const response = await fetch(`http://localhost:5050/fines`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch fines");
                }

                setFines(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchFines();
    }, [customerId]);

    return (
        <Container className="mt-4">
            <h2>Fines</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            {fines.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Fine ID</th>
                            <th>Vehicle</th>
                            <th>License Plate</th>
                            <th>Amount</th>
                            <th>Reason</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fines.map((fine) => (
                            <tr key={fine.fine_id}>
                                <td>{fine.fine_id}</td>
                                <td>{fine.model}</td>
                                <td>{fine.license_plate}</td>
                                <td>₹{fine.amount}</td>
                                <td>{fine.reason}</td>
                                <td>{new Date(fine.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No fines found.</p>
            )}
        </Container>
    );
}
