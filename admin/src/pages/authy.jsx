import { Navigate, Route, Routes } from "react-router-dom";
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // must return true if token exists
};

export function ProtectedRoute({ children }) {
  const isAuth = isAuthenticated();
  return isAuth ? children : <Navigate to="/login" replace />;
}