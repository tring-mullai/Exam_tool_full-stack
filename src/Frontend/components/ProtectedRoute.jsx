import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  console.log("Checking Protected Route. Token:", token);

  if (!token) {
    console.log("No token found. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  console.log("Token found. Access granted.");
  return children;
};

export default ProtectedRoute;

