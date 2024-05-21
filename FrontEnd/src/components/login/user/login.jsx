import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import logo from "./logo.svg";
import house from "./house.jpg";
import "../style.scss";
import { Form, Button } from "react-bootstrap";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost/pfe/php/api/login.php",
        {
          email,
          password,
        }
      );

      if (response.data.status === "success") {
        // Successful login, store the JWT token and redirect
        console.log("JWT token:", response.data.jwt_token); // Just for testing
        localStorage.setItem("jwt_token", response.data.jwt_token);
        window.location.href = "/dashboard";
      } else {
        // Login failed, display error message
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while processing your request");
    }
  };

  return (
    <div className="app">
      <div className="container-fluid">
        <div className="row page">
          <div className="col-sm-12 col-md-4 full-height stack-on-small">
            <div className="row justify-content-center align-items-center">
              <div className="row align-items-center justify-content-center title">
                <div className="col-auto p-0">
                  <img className="img-fluid" src={logo} alt="Logo" />
                </div>
                <div className="col-auto p-0">
                  <p className="houselytics mb-0">Houselytics</p>
                </div>
              </div>
              <div className="row p-0 m-0">
                <img
                  src={house}
                  className="img-fluid align-content-center p-0"
                  alt="House"
                />
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-8 d-flex justify-content-center align-items-center flex-column right">
            <h2 className="header">Connectez-vous à votre compte</h2>
            {error && <div className="error text-danger">{error}</div>}
            <Form className="form-sign" onSubmit={handleSubmit}>
              <Form.Group className="username-group" controlId="formUsername">
                <Box
                  component="div"
                  className="email-box"
                  noValidate
                  autoComplete="off"
                >
                  {/* Added email-input class */}
                  <TextField
                    label="Adresse e-mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    focused
                    InputLabelProps={{
                      className: "email-input-label",
                    }}
                    className="email-input focused-border"
                  />
                </Box>
              </Form.Group>
              <Form.Group className="password-group" controlId="formPassword">
                <Box
                  component="div"
                  className="password-box"
                  noValidate
                  autoComplete="off"
                >
                  {/* Added password-input class */}
                  <TextField
                    label="Mot de passe"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    focused
                    InputLabelProps={{
                      className: "password-input-label",
                    }}
                    className="password-input focused-border"
                  />
                </Box>
              </Form.Group>
              <div className="button-container">
                <Button className="button-sign" type="submit">
                  Se connecter
                </Button>
              </div>
            </Form>
            <a className="forgot" href="#">
              Mot de passe oublié?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
