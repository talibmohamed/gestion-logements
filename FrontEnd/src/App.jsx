import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserLogin from "./components/login/user/login";
import AdminLogin from "./components/login/admin/login";
import AdminDashboard from "./components/dashboard/admin/dashboard";
import UserDashboard from "./components/dashboard/user/dashboard";
import "./App.css";

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userRole = useSelector((state) => state.auth.role);

  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard/*"
          element={isLoggedIn ? (
            userRole === "admin" ? <AdminDashboard /> : <UserDashboard />
          ) : (
            <Navigate to="/admin" />
          )}
        />
        <Route
          path="/user"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <UserLogin />}
        />
        <Route
          path="/admin"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <AdminLogin />}
        />
      </Routes>
    </Router>
  );
}

export default App;
