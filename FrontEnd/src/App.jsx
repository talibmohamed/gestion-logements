import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserLogin from "./components/login/user/login";
import AdminLogin from "./components/login/admin/login";
import Dashboard from "./components/dashboard/user/dashboard";
import "./App.css";


function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard/*"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/user" />}
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
