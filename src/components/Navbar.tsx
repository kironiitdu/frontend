import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
    isAuthenticated: boolean;
    onLogout: () => void;
}

export default function Navbar({ isAuthenticated, onLogout }: NavbarProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate("/"); // Redirect to home after logout
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
            <Link className="navbar-brand" to="/">Adaptation App</Link>

            {/* Mobile toggler if needed later on*/}
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto">
                    {!isAuthenticated && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/routes">Routes</Link>
                        </li>
                    )}
                    {isAuthenticated && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/BookTicket">Book Ticket</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/customers">Customers</Link>
                            </li>


                        </>
                    )}
                </ul>

                <ul className="navbar-nav ms-auto">
                    {!isAuthenticated ? (
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                    ) : (
                        <li className="nav-item">
                            <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}
