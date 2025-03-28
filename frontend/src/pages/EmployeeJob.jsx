import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Card } from "react-bootstrap";
import { NavbarComp } from "../components/Navbar";

export function EmployeeMaintenance() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployeeJobs = async () => {
            try {
                const response = await fetch("http://localhost:5050/employees/emp/maintenance", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch maintenance jobs.");

                const data = await response.json();
                console.log("Employee Maintenance Jobs:", data);

                if (Array.isArray(data)) {
                    setJobs(data);
                } else {
                    throw new Error("Invalid response format");
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeJobs();
    }, []);

    return (
        <>
            <NavbarComp /> {/* Include Navbar */}
            <Container className="d-flex flex-column align-items-center" style={{ padding: "20px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
                <Card className="shadow-lg rounded-4 p-4 w-100" style={{ maxWidth: "900px" }}>
                    <h2 className="mb-4 text-center text-primary">My Maintenance Jobs</h2>

                    {error && <Alert variant="danger">{error}</Alert>}

                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : jobs.length === 0 ? (
                        <Alert variant="info">No maintenance jobs assigned.</Alert>
                    ) : (
                        <Table striped bordered hover responsive className="text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Vehicle Brand</th>
                                    <th>Model</th>
                                    <th>License Plate</th>
                                    <th>Maintenance Date</th>
                                    <th>Cost</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job, index) => (
                                    <tr key={job.maintenance_id}>
                                        <td className="fw-bold">{index + 1}</td>
                                        <td>{job.brand}</td>
                                        <td>{job.model}</td>
                                        <td>{job.license_plate}</td>
                                        <td>{new Date(job.maintenance_date).toLocaleDateString()}</td>
                                        <td>${job.cost}</td>
                                        <td>{job.description || "Not specified"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card>
            </Container>
        </>
    );
}

export default EmployeeMaintenance;
