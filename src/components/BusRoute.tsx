import React, { useEffect, useState } from "react";
import axios from "axios";

interface Route {
    id: number;
    name: string;
    duration_mins: string;
    price: number;
    documentId: string;
}

export default function RoutesPage() {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await axios.get("http://localhost:1337/api/routes");
                // Extracting and filter the data
                const allRoutes = response.data.data;
                const routesWithPrice = allRoutes.filter((route: any) => route.price !== null);

                //Checking in console
                console.log(routesWithPrice);

                // Setting state with only priced routes
                setRoutes(routesWithPrice);
            } catch (err) {
                console.error("Error fetching routes:", err);
                setError("Failed to fetch routes.");
            } finally {
                setLoading(false);
            }
        };

        fetchRoutes();
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Available Routes</h2>

            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <div className="spinner-border text-primary large-spinner" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="alert alert-danger text-center">{error}</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th>Bus Route Name</th>
                                <th>Duration</th>
                                <th>Ticket Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {routes.map((route) => (
                                <tr key={route.id}>
                                    <td>{route.name}</td>
                                    <td>{route.duration_mins}</td>
                                    <td>{route.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
