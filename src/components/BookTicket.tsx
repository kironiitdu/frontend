import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from 'jwt-decode';


interface Station {
    id: number;
    name: string;
    location: string;
}

interface Route {
    id: number;
    name: string;
    price: number;
}

interface JwtPayload {
    exp: number;
}

const BookTicket: React.FC = () => {
    const [stations, setStations] = useState<Station[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [origin, setOrigin] = useState<number | "">("");
    const [destination, setDestination] = useState<number | "">("");
    const [travelDate, setTravelDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [customerName, setCustomerName] = useState("");

    const [adult, setAdult] = useState(0);
    const [senior, setSenior] = useState(0);
    const [child, setChild] = useState(0);

    const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

    const getToken = () => {
        const token = localStorage.getItem("token");
        console.log(token);
        if (!token) return null;

        try {
            //   //const decoded = jwt_decode<JwtPayload>(token);
            //   if (decoded.exp * 1000 < Date.now()) {
            //     console.warn("Token expired");
            //     localStorage.removeItem("token");
            //     return null;
            //   }
            return token;
        } catch {
            return null;
        }
    };

    //Will be using this while need to call endpoint with token. 
    const fetchWithToken = async (url: string) => {
        const token = getToken();
        if (!token) throw new Error("No valid token found");

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.data;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    
                    console.error("No token found.");
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const [stationRes, routeRes] = await Promise.all([
                    axios.get("http://localhost:1337/api/stations", { headers }),
                    axios.get("http://localhost:1337/api/routes"),
                ]);

                //Checking token
                console.log(headers);
                // Response rebinding for station and route data 
                const stationData = stationRes.data.data;
                const routeData = routeRes.data.data;
                console.log(stationData);
                setStations(stationData);
                setRoutes(routeData.filter((r: any) => r.price !== null));
            } catch (err) {
                console.error("Authentication or data fetch error:", err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (origin && destination) {
            const originName = stations.find((s) => s.id === origin)?.location.trim();
            const destName = stations.find((s) => s.id === destination)?.location.trim();

            const match = routes.find(
                (r) =>
                    r.name.includes(originName || "") &&
                    r.name.includes(destName || "")
            );
            setSelectedRoute(match || null);
        } else {
            setSelectedRoute(null);
        }
    }, [origin, destination, routes, stations]);

    const totalTickets = adult + senior + child;
    const totalPrice = selectedRoute ? selectedRoute.price * totalTickets : 0;

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <form
                className="max-w-xl mx-auto bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-8"
                onSubmit={async (e) => {
                    e.preventDefault();

                    if (!origin || !destination || !travelDate || !selectedRoute || !customerName) {
                        alert("Please fill in all required fields including customer name.");
                        return;
                    }

                    const bookingPayload = {
                        originId: origin,
                        destinationId: destination,
                        routeName: selectedRoute.name,
                        travelDate,
                        returnDate: returnDate || null,
                        customerName,
                        totalTickets,
                        totalPrice,
                    };

                    try {
                        const token = localStorage.getItem("token");
                        const response = await axios.post("http://localhost:1337/api/bookTicket", bookingPayload, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        alert("Booking successful!");
                        console.log("Response:", response.data);
                    } catch (error) {
                        console.error("Booking failed", error);
                        alert("Booking failed. See console for details.");
                    }
                }}
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Ticket Booking</h2>

                {/* Customer Name */}
                <label className="block mb-2 font-medium">Customer Name:</label>
                <input
                    type="text"
                    placeholder="Enter a name"
                    className="w-full border p-2 mb-4 rounded"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                />

                {/* Origin Station */}
                <label className="block mb-2 font-medium">Origin</label>
                <select
                    title="Select a Origin"
                    className="w-full border p-2 mb-4 rounded"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value === "" ? "" : Number(e.target.value))}
                >
                    <option value="">Select Origin</option>
                    {stations.map((s) => (
                        <option key={s.id} value={s.id} disabled={s.id === destination}>
                            {s.location}
                        </option>
                    ))}
                </select>

                {/* Destination Station */}
                <label className="block mb-2 font-medium">Destination</label>
                <select
                    title="Select a destination"
                    className="w-full border p-2 mb-4 rounded"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value === "" ? "" : Number(e.target.value))}
                >
                    <option value="">Select Destination</option>
                    {stations.map((s) => (
                        <option key={s.id} value={s.id} disabled={s.id === origin}>
                            {s.location}
                        </option>
                    ))}
                </select>

                {/* Travel Date */}
                <label className="block mb-2 font-medium">Travel Date:</label>
                <input
                    type="date"
                    className="w-full border p-2 mb-4 rounded"
                    placeholder="Select travel date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    required
                />

                {/* Return Date */}
                <label className="block mb-2 font-medium">Return Date (optional):</label>
                <input
                    type="date"
                    className="w-full border p-2 mb-4 rounded"
                    placeholder="Select return date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                />

                {/* Loading Route Info */}
                {selectedRoute && (
                    <>
                        <p className="font-medium mb-2 text-gray-700">
                            Route: <strong>{selectedRoute.name}</strong>
                        </p>
                        <p className="mb-4 text-gray-600">Price per ticket: ${selectedRoute.price}</p>
                    </>
                )}

                {/* Ticket Counters */}
                <div className="space-y-3 mb-6">
                    {([
                        ["Adult", adult, setAdult],
                        ["Senior", senior, setSenior],
                        ["Child", child, setChild],
                    ] as [string, number, React.Dispatch<React.SetStateAction<number>>][]).map(
                        ([label, count, setter]) => (
                            <div className="flex justify-between items-center" key={label}>
                                <span className="font-medium">{label}</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setter((prev) => Math.max(0, prev - 1))}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        -
                                    </button>
                                    <span className="mx-2">{count}</span>
                                    <button
                                        type="button"
                                        onClick={() => setter((prev) => prev + 1)}
                                        className="btn btn-primary btn-sm"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* Cart Summary */}
                <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-800">Cart Summary</h3>
                    <p>Tickets: {totalTickets}</p>
                    <p>Total Price: ${totalPrice.toFixed(2)}</p>
                </div>

                {/* Confirm Button */}
                <button type="submit" className="btn btn-success mt-6 w-full">
                    Confirm Booking
                </button>
            </form>
        </div>
    );

};


export default BookTicket;
