import React, { useState } from "react";
import axios from "axios";
import logo from "./logo.svg";
import sunset from "./sunset.jpeg";
import "./form.scss";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../session/authentication";
import { useNavigate } from "react-router-dom";
import { loginadmin } from "../../../session/services/api";
import { Button, Input } from "@nextui-org/react";
import { EyeFilledIcon } from "../EyeFilledIcon";
import { EyeSlashFilledIcon } from "../EyeSlashFilledIcon";
import { Select, SelectItem } from "@nextui-org/react";

const Form = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profession, setProfession] = useState("");
  const [cin, setCin] = useState("");
  const [telephone, setTelephone] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const proType = [
    { label: "Ouvrier", value: "ouvrier" },
    { label: "Agent de maitrise", value: "agent de maitrise" },
    { label: "Cadre", value: "cadre" },
  ];

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //to check if pwd matches
    if (password !== confirmPassword) {
      setError("Ces mots de passe ne correspondent pas. Veuillez réessayer.");
    }

    try {
      const response = await updateTenant(email, cin, profession, telephone, password);

      if (response.status === "success") {
        dispatch(
          updateTenant({
            jwtToken: response.jwt_token,
            email: response.email,
            cin: response.cin,
            telephone: response.telephone,
            profession: response.profession,
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
          <div className="flex mb-8 items-center justify-center">
            <img className="currentColor logo" src={logo} alt="Logo" />
            <p className="ml-4 font-[lato] font-extrabold text-2xl text-center houselytics">
              Houselytics
            </p>
          </div>
          <h2 className="font-[lato] font-bold text-2xl mb-3 text-center">
          Formulaire d'Activation de Compte
          </h2>
          {error && <div className="error">{error}</div>}
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="general-info-group">
              <Input
                isRequired
                size="md"
                type="email"
                label="Email"
                variant="bordered"
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 mb-2"
              />
              <Input
                isRequired
                size="md"
                type="cin"
                label="Cin"
                variant="bordered"
                onChange={(e) => setCin(e.target.value)}
                className="p-2 mb-2"
              />
              <Input
                isRequired
                size="md"
                type="telephone"
                label="Telephone"
                variant="bordered"
                onChange={(e) => setTelephone(e.target.value)}
                className="p-2 mb-2"
              />
              <Select
                isRequired
                size="md"
                type="profession"
                label="Profession"
                variant="bordered"
                onChange={(e) => setProfession(e.target.value)}
                className="p-2 mb-2"
              >
                {proType.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
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

        {/* Image */}
        <div className="md:block hidden w-1/2">
          <img className="rounded-2xl" src={sunset} alt="Sunset" />
        </div>
      </div>
    </div>
  );
};

export default Form;
