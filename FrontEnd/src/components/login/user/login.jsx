// src/components/Login.jsx
import React, { useState } from 'react';
import '../../../index.css';
import axios from 'axios';
import logo from './logo.svg';
import house from './house.jpg';
import '../style.scss';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../session/authentication';
import { useNavigate } from 'react-router-dom';
import { loginadmin } from '../../../session/services/api';
import { Link, Button, Input } from "@nextui-org/react";
import { EyeFilledIcon } from "../EyeFilledIcon";
import { EyeSlashFilledIcon } from "../EyeSlashFilledIcon";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginadmin(email, password);

      if (response.status === 'success') {
        dispatch(
          loginSuccess({
            jwtToken: response.jwt_token,
            nom: response.nom,
            prenom: response.prenom,
            role: response.role,
          })
        );
        navigate('/dashboard');
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="left-side align-center">
        <div className="align-center align-item-center">
          <img className="logo" src={logo} alt="Logo" />
          <p className="houselytics">Houselytics</p>
        </div>
        <div className="col-auto p-0">
          <img className="house" src={house} alt="House" />
        </div>
      </div>
      <div className="right-side">
        <h2 className="header">Connectez-vous à votre compte</h2>
        {error && <div className="error">{error}</div>}
        <form className="form-sign" onSubmit={handleSubmit}>
          <div className='email-group'>
            <Input
              size="lg"
              type="email"
              label="Email"
              variant="bordered"
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>
          <div className='password-group'>
            <Input
              size="lg"
              label="Mot de passe"
              variant="bordered"
              onChange={(e) => setPassword(e.target.value)}
              endContent={
                <button className="visibility-toggle" type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <EyeSlashFilledIcon className="icon" />
                  ) : (
                    <EyeFilledIcon className="icon" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              className="input"
            />
          </div>
          <Link className="forgot" href="#">
          Mot de passe oublié?
        </Link>
          <div className="button-container">
            <Button className="button-sign" type="submit" size="lg">
              Se connecter
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
