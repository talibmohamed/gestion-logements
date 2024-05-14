import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import UserLogin from "./components/login/user/login";
import AdminLogin from "./components/login/admin/login";
// import Dashboard from "./components/dashboard/user/dashboard";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user" element={<UserLogin />} />
        <Route path="/admin" element={<AdminLogin />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
