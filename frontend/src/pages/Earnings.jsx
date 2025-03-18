import { useState, useEffect,  } from "react";
import { Table, Container, Card, Spinner, Alert } from "react-bootstrap";
import { NavbarComp } from "../components/Navbar";
export default function AdminEarnings() {
    const [earnings, setEarnings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const fetchEarnings = async () => {
        try {
            const response = await fetch("http://localhost:5050/earnings", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch earnings");

            const data = await response.json();
            setEarnings(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEarnings();
    }, []);

    return (
        <>
            <NavbarComp />
            <Container className="d-flex flex-column align-items-center" style={{ padding: "20px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
                <Card className="shadow-lg rounded-4 p-4 w-100" style={{ maxWidth: "900px" }}>
                    <h2 className="mb-4 text-primary text-center">Company Earnings</h2>

                    {error && <Alert variant="danger">{error}</Alert>}

                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        <Table striped bordered hover responsive className="text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th>Year</th>
                                    <th>Quarter</th>
                                    <th>Total Revenue (₹)</th>
                                    <th>Total Expenses (₹)</th>
                                    <th>Net Profit (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {earnings.length > 0 ? (
                                    earnings.map((entry, index) => {
                                        const revenue = parseFloat(entry.total_revenue) || 0;
                                        const expenses = parseFloat(entry.total_expenses) || 0;
                                        const profit = revenue - expenses; // Ensure calculation is done correctly

                                        return (
                                            <tr key={index}>
                                                <td>{entry.year}</td>
                                                <td>{entry.quarter}</td>
                                                <td>{revenue.toFixed(2)}</td>
                                                <td>{expenses.toFixed(2)}</td>
                                                <td className={profit >= 0 ? "text-success" : "text-danger"}>
                                                    {profit.toFixed(2)}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5">No earnings data available.</td>
                                    </tr>
                                )}
                            </tbody>

                        </Table>
                    )}
                </Card>
            </Container>
        </>
    );
}
