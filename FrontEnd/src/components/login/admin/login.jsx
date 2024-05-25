// src/components/Login.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import logo from './logo.svg';
import house from './house.jpg';
import '../style.scss';
import { Form, Button } from 'react-bootstrap';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../session/authentication';
import { useNavigate } from 'react-router-dom';
import { loginadmin } from '../../../session/services/api'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
            <h2 className="header">Connectez-vous à votre compte admin</h2>
            {error && <div className="error text-danger">{error}</div>}
            <Form className="form-sign" onSubmit={handleSubmit}>
              <Form.Group className="username-group" controlId="formUsername">
                <Box
                  component="div"
                  className="email-box"
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    label="Adresse e-mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    focused
                    InputLabelProps={{
                      className: 'email-input-label',
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
                  <TextField
                    label="Mot de passe"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    focused
                    InputLabelProps={{
                      className: 'password-input-label',
                    }}
                    className="password-input focused-border"
                  />
                </Box>
              </Form.Group>
              <div className="button-container">
                <Button className="button-sign" type="submit">
                  Se connecter
                </Button>
              </div>
            </Form>
            <a className="forgot" href="#">
              Mot de passe oublié?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
