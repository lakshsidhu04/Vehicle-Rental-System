import { useEffect, useState } from "react";
import { Table, Alert, Spinner, Container, Button, Card, Modal, Form } from "react-bootstrap";
import { NavbarComp } from "../components/Navbar";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function AdminEmployees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [adding, setAdding] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const fetchAllEmployees = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5050/employees", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to fetch employees");

            const data = await res.json();
            setEmployees(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllEmployees();
    }, []);
    
    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setShowEditModal(true);
    };
    
    const handleDeleteClick = (employee) => {
        setSelectedEmployee(employee);
        setShowDeleteModal(true);
    };
    
    const handleChange = (e) => {
        setSelectedEmployee({ ...selectedEmployee, [e.target.name]: e.target.value });
    };
    
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`http://localhost:5050/employees/${selectedEmployee.employee_id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(selectedEmployee),
            });

            if (!res.ok) throw new Error("Failed to update employee");

            setEmployees((prev) =>
                prev.map((emp) => (emp.employee_id === selectedEmployee.employee_id ? selectedEmployee : emp))
            );

            setShowEditModal(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };
    
    const handleDelete = async () => {
        setDeleting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5050/employees/${selectedEmployee.employee_id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to delete employee");

            fetchAllEmployees();
            setShowDeleteModal(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setDeleting(false);
        }
    };

    const [newEmployee, setNewEmployee] = useState({
        name: "",
        email: "",
        phone_number: "",
        role: "staff",
        salary: "",
    });
    
    const handleAddChange = (e) => {
        setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
    };
    
    const handleAddEmployee = async (e) => {
        e.preventDefault();
        setAdding(true);

        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5050/employees", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newEmployee),
            });

            if (!res.ok) throw new Error("Failed to add employee");
            
            fetchAllEmployees();

            setShowAddModal(false);
            setNewEmployee({
                name: "",
                email: "",
                phone_number: "",
                role: "staff",
                salary: "",
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setAdding(false);
        }
    };

    return (
        <>
            <NavbarComp />

            <Container>
                <Card>
                    <div className="d-flex justify-content-between">
                        <h2>Employee Management</h2>
                        <Button variant="success" onClick={() => setShowAddModal(true)}>
                            <FaPlus /> Add Employee
                        </Button>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    {loading ? (
                        <Spinner animation="border" />
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Salary</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp.employee_id}>
                                        <td>{emp.employee_id}</td>
                                        <td>{emp.name}</td>
                                        <td>{emp.email}</td>
                                        <td>{emp.phone_number}</td>
                                        <td>{emp.role}</td>
                                        <td>{emp.salary}</td>
                                        <td>
                                            <Button variant="warning" onClick={() => handleEdit(emp)}>
                                                <FaEdit /> Edit
                                            </Button>
                                            <Button variant="danger" onClick={() => handleDeleteClick(emp)}>
                                                <FaTrash /> Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card>
            </Container>
            
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
    <Modal.Header closeButton>
        <Modal.Title>Add New Employee</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form onSubmit={handleAddEmployee}>
            {/* Employee Name */}
            <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control 
                    type="text" 
                    name="name" 
                    value={newEmployee.name} 
                    onChange={handleAddChange} 
                    required 
                    placeholder="Enter full name"
                />
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                    type="text" 
                    name="username" 
                    value={newEmployee.username} 
                    onChange={handleAddChange} 
                    required 
                    placeholder="Enter username"
                />
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password" 
                    name="password" 
                    value={newEmployee.password} 
                    onChange={handleAddChange} 
                    required 
                    placeholder="Enter password"
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control 
                    type="email" 
                    name="email" 
                    value={newEmployee.email} 
                    onChange={handleAddChange} 
                    required 
                    placeholder="Enter email"
                />
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control 
                    type="text" 
                    name="phone_number" 
                    value={newEmployee.phone_number} 
                    onChange={handleAddChange} 
                    placeholder="Enter phone number"
                />
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select 
                    name="role" 
                    value={newEmployee.role} 
                    onChange={handleAddChange} 
                    required
                >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                    <option value="mechanic">Mechanic</option>
                </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label>Salary (₹)</Form.Label>
                <Form.Control 
                    type="number" 
                    name="salary" 
                    value={newEmployee.salary} 
                    onChange={handleAddChange} 
                    required 
                    placeholder="Enter salary amount"
                />
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label>Hire Date</Form.Label>
                <Form.Control 
                    type="date" 
                    name="hire_date" 
                    value={newEmployee.hire_date} 
                    onChange={handleAddChange} 
                    required 
                />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => setShowAddModal(false)}>
                    Cancel
                </Button>
                <Button type="submit" variant="success" disabled={adding}>
                    {adding ? "Adding..." : "Add Employee"}
                </Button>
            </div>
        </Form>
    </Modal.Body>
</Modal>
            
            
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
    <Modal.Header closeButton>
        <Modal.Title>Edit Employee Details</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control 
                    type="text" 
                    name="name" 
                    value={selectedEmployee?.name || ""} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter full name"
                />
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control 
                    type="email" 
                    name="email" 
                    value={selectedEmployee?.email || ""} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter email"
                />
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control 
                    type="text" 
                    name="phone_number" 
                    value={selectedEmployee?.phone_number || ""} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter phone number"
                />
            </Form.Group>

            {/* Role Selection */}
            <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select 
                    name="role" 
                    value={selectedEmployee?.role || ""} 
                    onChange={handleChange} 
                    required
                >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                    <option value="mechanic">Mechanic</option>
                </Form.Select>
            </Form.Group>

            {/* Salary */}
            <Form.Group className="mb-3">
                <Form.Label>Salary (₹)</Form.Label>
                <Form.Control 
                    type="number" 
                    name="salary" 
                    value={selectedEmployee?.salary || ""} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter salary amount"
                />
            </Form.Group>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => setShowEditModal(false)}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={updating}>
                    {updating ? "Updating..." : "Update Employee"}
                </Button>
            </div>
        </Form>
    </Modal.Body>
</Modal>
            
            
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
                <Modal.Body>Are you sure you want to delete {selectedEmployee?.name}?</Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleDelete}>{deleting ? "Deleting..." : "Delete"}</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
