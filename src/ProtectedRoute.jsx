// src/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    // Not logged in → send back to login
    return <Navigate to="/Login" replace />;
  }
  return children;
}
