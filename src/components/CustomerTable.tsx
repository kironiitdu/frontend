// src/components/CustomerTable.tsx
import { useEffect, useState } from "react";
import axios from "axios";

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
}

interface Props {
    token: string;
}

export default function CustomerTable({ token }: Props) {
    console.log(token);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get("http://localhost:1337/api/customers", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Flatten data response
                const customers = response.data.data;
                setCustomers(customers);
            } catch (error) {
                console.error("Error fetching customers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [token]);

    return (
        <div className="container mt-5">
            <h2>Customer List</h2>
            {loading ? (
                <p>Loading...</p>
            ) : customers.length > 0 ? (
                <table className="table table-bordered mt-3">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((cust) => (
                            <tr key={cust.id}>
                                <td>{cust.id}</td>
                                <td>{cust.name}</td>
                                <td>{cust.email}</td>
                                <td>{cust.phone}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No customers found.</p>
            )}
        </div>
    );
}
