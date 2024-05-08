import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./logo.svg";
import house from "./house.jpg";
import "./login.scss";
import { Form, Button } from "react-bootstrap";

const SignIn = () => {
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
    <>
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
            <h2 className="header">Sign In Account</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="username-group" controlId="formUsername">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username or email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="password-group" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <div className="button-container">
                {" "}
                {/* Container for centering the button */}
                <Button className="button" variant="primary" type="submit">
                  Sign In
                </Button>
              </div>
            </Form>
            {error && <div className="error">{error}</div>}
            <a href="#">Forgot password?</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
