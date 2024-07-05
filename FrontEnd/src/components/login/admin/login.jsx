import React, { useState } from "react";
import "../../../index.css";
import logo from "./logo.svg";
import sunset from "./sunset.jpeg";
import "../style.scss";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAdminThunk } from "../../../session/thunks/adminthunk";
import { Link, Button, Input } from "@nextui-org/react";
import { EyeFilledIcon } from "../EyeFilledIcon";
import { EyeSlashFilledIcon } from "../EyeSlashFilledIcon";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Dispatch the loginUserThunk with email and password
      const action = await dispatch(loginAdminThunk({ email, password }));
      const response = action.payload; // Extract the payload data
      console.log("2");
      console.log(response);
      console.log("2");
      if (response.status === "success") {
        console.log(response.status);
        navigate("/dashboard");
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      {/* Login container */}
      <div className="flex rounded-2xl shadow-xl max-w-7xl p-5 items-center">
        {/* Form */}
        <div className="md:w-1/2 px-14">
          <div className="flex mb-8 items-center">
            <img className="currentColor logo" src={logo} alt="Logo" />
            <p className="ml-4 font-[lato] font-extrabold text-2xl houselytics">
              Houselytics
            </p>
          </div>
          <h2 className="font-[lato] font-bold text-3xl mb-3">
            Connectez-vous à votre compte
          </h2>
          {error && <div className="error">{error}</div>}
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="email-group">
              <Input
                size="md"
                type="email"
                label="Email"
                variant="bordered"
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 mt-4"
              />
            </div>
            <div className="password-group">
              <Input
                size="md"
                label="Mot de passe"
                variant="bordered"
                onChange={(e) => setPassword(e.target.value)}
                endContent={
                  <button
                    className="visibility-toggle"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className="icon" />
                    ) : (
                      <EyeFilledIcon className="icon" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
                className="p-2 mb-2"
              />
            </div>
            <div className="button-container">
              <Button className="login" type="submit" size="md">
                Se connecter
              </Button>
            </div>
          </form>
        </div>

        {/* Image */}
        <div className="md:block hidden w-1/2">
          <img className="rounded-2xl" src={sunset} alt="Sunset" />
        </div>
      </div>
    </div>
  );
};

export default Login;
