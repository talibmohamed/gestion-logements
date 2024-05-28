import React, { useState } from "react";
import axios from "axios";
import logo from "./logo.svg";
import sunset from "./sunset.jpeg";
import "../style.scss";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../session/authentication";
import { useNavigate } from "react-router-dom";
import { loginuser } from "../../../session/services/api";
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
      const response = await loginuser(email, password);

      if (response.status === "success") {
        dispatch(
          loginSuccess({
            jwtToken: response.jwt_token,
            nom: response.nom,
            prenom: response.prenom,
            role: response.role,
          })
        );
        navigate("/dashboard");
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      {/* Login container */}
      <div className="flex rounded-2xl shadow-lg max-w-7xl p-5 items-center">
        {/* Form */}
        <div className="md:w-1/2 px-14">
          <div className="flex mb-8 items-center">
            <img className="currentColor logo" src={logo} alt="Logo" />
            <p className="ml-4 font-[lato] font-extrabold text-2xl houselytics">
              Houselytics
            </p>
          </div>
          <h2 className="font-[lato] font-bold text-3xl mb-3 text-center">
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

          <div className="mt-10 grid grid-cols-3 items-center">
            <hr className="border-currentColor"></hr>
            <p className="text-center">Or</p>
            <hr className="border-currentColor"></hr>
          </div>

          <div className="Google">
            <Button className="mt-5 w-full ggl" type="button" size="md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.98em"
                height="1em"
                viewBox="0 0 256 262"
              >
                <path
                  fill="#4285f4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                />
                <path
                  fill="#34a853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                />
                <path
                  fill="#fbbc05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                />
                <path
                  fill="#eb4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                />
              </svg>
              Se connecter avec Google
            </Button>
          </div>
          <div className="text-center">
            <Link className="text-[#3b82f6] mt-4 text-sm" href="#">
              Mot de passe oublié?
            </Link>
          </div>
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
