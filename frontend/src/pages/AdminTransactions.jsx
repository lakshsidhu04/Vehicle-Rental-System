import { useEffect, useState } from "react";
import { Table, Container, Alert, Spinner } from "react-bootstrap";
import { NavbarComp } from "../components/Navbar";

export function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5050/transactions", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                throw new Error("Failed to fetch transactions");
            }
            const data = await res.json();
            setTransactions(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <>
            <NavbarComp />
            <Container className="py-4">
                <h2 className="mb-4 text-center">Admin Transactions</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Customer ID</th>
                                <th>Booking ID</th>
                                <th>Amount</th>
                                <th>Payment Method</th>
                                <th>Transaction Type</th>
                                <th>Transaction Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((tx) => (
                                    <tr key={tx.transaction_id}>
                                        <td>{tx.transaction_id}</td>
                                        <td>{tx.customer_id}</td>
                                        <td>{tx.booking_id}</td>
                                        <td>₹{tx.amount}</td>
                                        <td>{tx.payment_method}</td>
                                        <td>{tx.transaction_type}</td>
                                        <td>{new Date(tx.transaction_at).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </Container>
        </>
    );
}
