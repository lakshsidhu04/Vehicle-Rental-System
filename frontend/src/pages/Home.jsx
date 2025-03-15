import { useState, useEffect } from "react";
import { NavbarComp } from "../components/Navbar";

export function Home() {
    const [vehicles, setVehicles] = useState([]);
    
    const fetchVehicleData = async () => {
        try {
            const response = await fetch("http://localhost:5050/vehicles");
            if (response.ok) {
                const data = await response.json();
                setVehicles(data);
            } else {
                console.error("Failed to fetch data");
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchVehicleData();
    }, []);

    return (
        <>
            <NavbarComp />
            <div className="container mt-5 pt-5">
                <h1 className="mb-4">Available Vehicles</h1>
                <div className="list-group">
                    {vehicles.map((vehicle) => (
                        <div key={vehicle._id} className="list-group-item list-group-item-action">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">
                                    {vehicle.brand} {vehicle.model}
                                </h5>
                                <small className="text-muted">{vehicle.type}</small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}