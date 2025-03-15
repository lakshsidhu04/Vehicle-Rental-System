import { useState, useEffect } from "react";
import { NavbarComp } from "../components/Navbar";

export function Home() {
    const [vehicles, setVehicles] = useState([]);
    
    const fetchVehicles = async () => {
        try {
            const response = await fetch("http://localhost:5050/vehicles");
            const data = await response.json();
            setVehicles(data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleClick = async (id) => {
        try {
            
        } catch (error) {
            console.error(error);
        }
    }

    
    useEffect(() => {
        fetchVehicles();
    },
    []);

    return (
        <div style={{ backgroundColor: "#181818", minHeight: "100vh", padding: "20px", color: "#e0e0e0" }}>
            <NavbarComp />
            <h1 style={{ textAlign: "center", marginTop: "80px" }}>Available Vehicles</h1>

            <div
                style={{
                    display: "flex",
                    justifyItems: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    width: "100%", 
                    padding: "20px",
                    gap: "15px"
                }}
            >
                {vehicles.map((vehicle) => (
                    <div
                        key={vehicle._id}
                        style={{
                            flexBasis: "300px",
                            maxWidth: "400px", 
                            backgroundColor: "#242424",
                            padding: "20px",
                            borderRadius: "8px",
                            textAlign: "center",
                            boxShadow: "0px 2px 5px rgba(0,0,0,0.2)"
                        }} onclick={() => handleClick(vehicle._id)}
                    >
                        <strong style={{ color: "#f0f0f0", fontSize: "1.2rem" }}>
                            {vehicle.type} {vehicle.brand} {vehicle.model}
                        </strong>
                    </div>
                ))}
            </div>
        </div>
    );
}
