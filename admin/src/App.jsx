import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import axios from "./api";
import {ProtectedRoute}from "./pages/authy";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/settings";
import Products from "./pages/products";

function App() {
  const [adminExists, setAdminExists] = useState(null);

  useEffect(() => {
    axios.get("/exists")
      .then(res => setAdminExists(res.data.exists))
      .catch(() => setAdminExists(true)); // fallback to login
  }, []);

  if (adminExists === null) return <p>Loading...</p>;

  return (
    <BrowserRouter>
          <Routes>
      {!adminExists && (
        <>
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/register" replace />} />
        </>
      )}

      {adminExists && (
        <>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
    </BrowserRouter>
  );
}

export default App;
