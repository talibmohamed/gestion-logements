import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./logo.svg";
import house from "./house.jpg";
import "./login.scss";
import { Form, Button } from "react-bootstrap";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://pfe.test/PHP/api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username, // Assuming username field is used for email
          password: password,
        }),
      });

      const data = await response.json();

      console.log("Response:", response);

      if (response.ok) {
        // If login successful, handle the response
        console.log("Login successful:", data);
        // Redirect or perform other actions as needed
      } else {
        // If login failed, handle the error
        console.error("Login failed:", data.message);
        // Display error message to the user
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network errors or other exceptions
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
                <Form.Label>Username or Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
            <a href="#">Forgot password?</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
