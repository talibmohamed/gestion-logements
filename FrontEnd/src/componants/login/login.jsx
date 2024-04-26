import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./logo.svg";
import house from "./house.jpg";
import "./login.css";

function SignIn() {
  return (
    <>
      <div className="row">
        <div className="col-sm-4 col-xs-12 position-fixed top-0 start-0 h-100 rounded-start-5 ">
          <div className="row">
            <div className="col d-flex align-items-center justify-content-center title">
              <img className="img-fluid" src={logo} />
              <p className="houselytics mb-0 ml-2">houselytics</p>
            </div>
          </div>
          <div className="row">
            <img
              src={house}
              className="img-fluid rounded-start-5 align-content-center "
            />
          </div>
        </div>
        <div
          className="col-sm-8 col-xs-12 position-fixed top-0 end-0 h-100  rounded-start-5 "
          style={{ backgroundColor: "white" }}
        >
          <div className="row">
            <div className="col d-flex align-items-center justify-content-center">
              <p className="login">Login</p>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex align-items-center justify-content-center">
              <input type="text" className="form-control" placeholder="Email" />
            </div>
          </div>
          <div className="row">
            <div className="col d-flex align-items-center justify-content-center">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="row">
            <div className="col d-flex align-items-center justify-content-center">
              <button className="btn btn-primary">Login</button>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex align-items-center justify-content-center">
              <p className="forgot">Forgot Password?</p>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex align-items-center justify-content-center">
              <p className="forgot">Don't have an account? Sign Up</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
