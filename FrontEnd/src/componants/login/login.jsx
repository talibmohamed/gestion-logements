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
    // Add sign-in logic here send it to the api : http://pfe.test/PHP/api/login.php with a post request 
    //u will get a response with the json data of the user containing for now "statue" and "jwt" store it ghadi nhtajouh manba3d
    //for more info about the api check php folder 
    //comment the code plz
    //ps am using 123456789 as Database password and houslytics as name you may wanna change it to your own or use that wne u create the database
    //u will find the database that i used in the root folder of the project
    console.log("Username:", username);
    console.log("Password:", password);
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
