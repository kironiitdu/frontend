import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import './App.css';
import Login from "./components/Login";
import CustomerTable from "./components/CustomerTable";
import Navbar from "./components/Navbar";
import BusRoute from "./components//BusRoute";
import BookTicket from './components/BookTicket'; 



/*
===================================================
NEWER CODE FOR COMPONENT BASED DEVELOPMENT PRACTICE
===================================================


*/
function App() {
  const [token, setToken] = useState<string | null>(null);

  const handleLogout = () => {
    setToken(null);
  };
  return (
    <Router>
      <Navbar isAuthenticated={!!token} onLogout={handleLogout} />

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<h2>Welcome to Adaptation app</h2>} />
          <Route path="/routes" element={<BusRoute />} />
          <Route path="/BookTicket" element={<BookTicket />} />
          <Route
            path="/login"
            element={!token ? <Login onLoginSuccess={setToken} /> : <Navigate to="/customers" />}
          />
          <Route
            path="/customers"
            element={
              token ? (
                <>
                  <div className="alert alert-success d-flex justify-content-between align-items-center">
                    <div>
                      ✅ Login successful! Token: <code>{token}</code>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-success ms-3"
                      onClick={() => {
                        navigator.clipboard.writeText(token);
                        alert("Token copied to clipboard!");
                      }}
                    >
                      Copy Token
                    </button>
                  </div>
                  <CustomerTable token={token} />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
//   return (
//     <Router>
//       <Navbar isAuthenticated={!!token} onLogout={handleLogout} />

//       <div className="container mt-4">
//         <Routes>
//           <Route path="/" element={<h2>Welcome to Adaptation app</h2>} />
//          <Route path="/routes" element={<BusRoute />} />
//           <Route
//             path="/login"
//             element={!token ? <Login onLoginSuccess={setToken} /> : <Navigate to="/customers" />}
//           />
//           <Route
//             path="/customers"
//             element={
//               token ? (
//                 <>
//                   <div className="alert alert-success d-flex justify-content-between align-items-center">
//                     <div>
//                       ✅ Login successful! Token: <code>{token}</code>
//                     </div>
//                     <button
//                       className="btn btn-sm btn-outline-success ms-3"
//                       onClick={() => {
//                         navigator.clipboard.writeText(token);
//                         alert("Token copied to clipboard!");
//                       }}
//                     >
//                       Copy Token
//                     </button>
//                   </div>
//                   <CustomerTable token={token} />
//                 </>
//               ) : (
//                 <Navigate to="/login" />
//               )
//             }
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

export default App;




/*
========================================
OLDER CODE FOR JUST UNDERSTANDING
========================================


*/
//Strapi model
// export interface Customer {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
// }

//Starpi API
// const API_URL = 'http://localhost:1337/api/';

// function App() {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);

// useEffect(() => {
//   const fetchCustomers = async () => {
//     try {
//       const response = await axios.get(`${API_URL}customers`);
//       const data = response.data;

//       console.log("API Response:", data); //for checking
//       setCustomers(data.data); // 
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//     }
//   };

//   fetchCustomers();
// }, []);


//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//   <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Customer List</h1>

//   {loading ? (
//     <p className="text-gray-500 text-center">Loading...</p>
//   ) : customers.length > 0 ? (
//     <div className="overflow-x-auto">
//       <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//         <thead className="bg-gray-200 text-gray-700">
//           <tr>
//             <th className="text-left py-3 px-4">ID</th>
//             <th className="text-left py-3 px-4">Name</th>
//             <th className="text-left py-3 px-4">Email</th>
//             <th className="text-left py-3 px-4">Phone</th>
//           </tr>
//         </thead>
//         <tbody>
//           {customers.map((customer) => (
//             <tr key={customer.id} className="border-t">
//               <td className="py-2 px-4">{customer.id}</td>
//               <td className="py-2 px-4 font-medium">{customer.name}</td>
//               <td className="py-2 px-4">{customer.email}</td>
//               <td className="py-2 px-4">{customer.phone}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   ) : (
//     <p className="text-center text-gray-500">No customers found.</p>
//   )}
// </div>

//   );
// }


