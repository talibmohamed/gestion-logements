import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import sunset from "./sunset.jpeg";
import "./form.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@nextui-org/react";
import { EyeFilledIcon } from "../EyeFilledIcon";
import { EyeSlashFilledIcon } from "../EyeSlashFilledIcon";
import { changePasswordThunk } from "../../../session/thunks/userthunks"; // Import the changePasswordThunk
import { checkTokenThunk } from "../../../session/thunks/userthunks"; // Import the checkTokenThunk
import { logout } from "../../../session/authentication";

const resetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const user = useSelector((state) => state.user);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmedPassword) {
      setError("Les mots de passe ne correspondent pas. Veuillez réessayer.");
      return;
    }

    try {
      const action = await dispatch(
        changePasswordThunk({ password, confirmedPassword })
      );
      const response = action.payload;
      console.log(response);

      if (response.status === "success") {
        dispatch(logout());
        localStorage.removeItem("state");
        navigate("/user?message=Password changed successfully");
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Une erreur s'est produite lors de la mise à jour du profil.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("login_token");
      console.log(token);
      if (token) {
        try {
          const action = await dispatch(checkTokenThunk(token));
          const response = action.payload;
          console.log(response);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    fetchData(); // Call the async function inside useEffect
  }, []); // Empty dependency array to run once on component mount

  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="flex rounded-2xl shadow-lg max-w-7xl p-5 items-center">
        <div className="md:w-1/2 px-14">
          <div className="flex mb-8 items-center justify-center">
            <img className="currentColor logo" src={logo} alt="Logo" />
            <p className="ml-4 font-[lato] font-extrabold text-2xl text-center houselytics">
              Houselytics
            </p>
          </div>
          <h2 className="font-[lato] font-bold text-2xl mb-3 text-center">
            Formulaire de changement de mot de passe
          </h2>
          {error && <div className="error">{error}</div>}
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            
            <div className="password-group">
              <Input
                isRequired
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
              <Input
                isRequired
                size="md"
                label="Confirmer Votre Mot de passe"
                variant="bordered"
                onChange={(e) => setConfirmedPassword(e.target.value)}
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
            <div className="btn-container">
              <Button className="mr-3 done" type="submit" size="md">
                Sauvegarder
              </Button>
            </div>
          </form>
        </div>
        <div className="md:block hidden w-1/2">
          <img className="rounded-2xl" src={sunset} alt="Sunset" />
        </div>
      </div>
    </div>
  );
};

export default resetPassword;
