import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./logo.svg";
import house from "./house.jpg";
import "../style.scss";
import { Form, Button } from "react-bootstrap";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    //it works just continue redo the error handling and stor the jwt
    try {
      const response = await fetch("http://localhost/pfe/php/api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login redirect lchi page
        // you can store the JWT token in localStorage binma chafan kighadi ndiro l session
        console.log("JWT token:", data.jwt_token); //just for the test
        // Redirect to another page
      } else {
        // Login failed, display error message in conssol
        console.log(data.message);
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
            {error && <div className="error">{error}</div>}
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
                {" "}
                {/* Container for centering the button */}
                <Button className="button-sign" type="submit">
                  Se connecter
                </Button>
              </div>
            </Form>
            <a className="forgot" href="#">Mot de passe oublié?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default login;
