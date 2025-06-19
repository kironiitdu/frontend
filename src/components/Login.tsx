import { useState } from "react";
import axios from "axios";

//Defining interface
interface LoginProps {
    onLoginSuccess: (token: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
    //Defining component state
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    //Form submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:1337/api/auth/local", {
                identifier,
                password,
            });

            const token = response.data.jwt;
            // Storing token in local storage for next uses
            localStorage.setItem("token", token);
            onLoginSuccess(token);
        } catch (err) {
            console.error("Login failed:", err);
            setError("Invalid credentials. Please try again.");
        }
    };


    return (
        <div className="container mt-5">
            <h2 className="mb-4">Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email or Username</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter username or email"
                        value={identifier}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setIdentifier(e.target.value)
                        }
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setPassword(e.target.value)
                        }
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Login
                </button>
            </form>
        </div>
    );
}
