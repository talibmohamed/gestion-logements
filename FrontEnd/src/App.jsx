import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import UserLogin from "./components/login/user/login";
import AdminLogin from "./components/login/admin/login";
import UserForm from "./components/login/FirstTime/form";
import AdminDashboard from "./components/dashboard/admin/dashboard";
import UserDashboard from "./components/dashboard/user/dashboard";
import "./App.css";

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userRole = useSelector((state) => state.auth.role);
  const first_login = useSelector((state) => state.auth.first_login);
  const token = useSelector((state) => state.auth.token); 

  const renderDashboard = () => {
    if (!isLoggedIn) {
      return <Navigate to="/admin" />;
    }

    if (first_login) {
      return <Navigate to="/form" />;
    }

    return userRole === "admin" ? <AdminDashboard /> : <UserDashboard />;
  };

  const renderUserRoute = () => {
    if (isLoggedIn) {
      if (first_login) {
        return <Navigate to="/form" />;
      }
      return <Navigate to="/dashboard" />;
    }

    return <UserLogin />;
  };

  const renderAdminRoute = () => {
    if (isLoggedIn) {
      if (first_login) {
        return <Navigate to="/form" />;
      }
      return <Navigate to="/dashboard" />;
    }

    return <AdminLogin />;
  };

  const renderFormRoute = () => {
    if (first_login || token) {
      return <UserForm />;
    }

    return <Navigate to="/user" />; // or redirect to another route if necessary
  };

  const renderCatchAllRoute = () => {
    if (isLoggedIn) {
      if (first_login) {
        return <Navigate to="/form" />;
      }
      return <Navigate to="/dashboard" />;
    }

    return <Navigate to="/user" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/dashboard/*" element={renderDashboard()} />
        <Route path="/user" element={renderUserRoute()} />
        <Route path="/admin" element={renderAdminRoute()} />
        <Route path="/form" element={renderFormRoute()} />
        <Route path="*" element={renderCatchAllRoute()} />
      </Routes>
    </Router>
  );
}

export default App;
