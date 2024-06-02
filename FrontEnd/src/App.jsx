import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import UserLogin from "./components/login/user/login";
import AdminLogin from "./components/login/admin/login";
import UserForm from "./components/login/FirstTime/form";
import AdminDashboard from "./components/dashboard/admin/dashboard";
import UserDashboard from "./components/dashboard/user/dashboard";
import "./App.css";

// Custom hook to get query parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

// Component to handle form route with token exception
const FormRoute = () => {
  const firstLogin = useSelector((state) => state.auth.first_login);
  const token = useSelector((state) => state.auth.token);
  const query = useQuery();
  const urlToken = query.get('login_token');

  if (firstLogin || token || urlToken) {
    return <UserForm />;
  }

  return <Navigate to="/user" />;
};

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userRole = useSelector((state) => state.auth.role);
  const firstLogin = useSelector((state) => state.auth.first_login);

  const renderDashboard = () => {
    if (!isLoggedIn) {
      return <Navigate to="/admin" />;
    }

    if (firstLogin) {
      return <Navigate to="/form" />;
    }

    return userRole === "admin" ? <AdminDashboard /> : <UserDashboard />;
  };

  const renderUserRoute = () => {
    if (isLoggedIn) {
      if (firstLogin) {
        return <Navigate to="/form" />;
      }
      return <Navigate to="/dashboard" />;
    }

    return <UserLogin />;
  };

  const renderAdminRoute = () => {
    if (isLoggedIn) {
      if (firstLogin) {
        return <Navigate to="/form" />;
      }
      return <Navigate to="/dashboard" />;
    }

    return <AdminLogin />;
  };

  const renderCatchAllRoute = () => {
    if (isLoggedIn) {
      if (firstLogin) {
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
        <Route path="/form" element={<FormRoute />} />
        <Route path="*" element={renderCatchAllRoute()} />
      </Routes>
    </Router>
  );
}

export default App;
