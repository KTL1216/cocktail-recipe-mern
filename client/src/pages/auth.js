import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  return (
    <div className="auth">
      <Login />
      <Register />
    </div>
  );
};

const Login = () => {
  const [_, setCookies] = useCookies(["access_token"]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const loginSubmission = async (event) => {
    event.preventDefault();
    try {
      const result = await axios.post("http://localhost:3001/auth/login", {
        username,
        password,
      });
      console.log("logged in")
      setCookies("access_token", result.data.token);
      window.localStorage.setItem("userID", result.data.userID);
      navigate("/");
    } catch (error) {
      alert("Wrong Password or Username!");
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={loginSubmission}>
        <h2>Login</h2>
        <div className="forms">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username1" value={username} onChange={(event) => setUsername(event.target.value)}/>
        </div>
        <div className="forms">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password1" value={password} onChange={(event) => setPassword(event.target.value)}/>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const registerSubmission = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3001/auth/register", {
        username,
        password,
      });
      alert("You can login now!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={registerSubmission}>
        <h2>Register</h2>
        <div className="forms">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username2" value={username} onChange={(event) => setUsername(event.target.value)}/>
        </div>
        <div className="forms">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password2" value={password} onChange={(event) => setPassword(event.target.value)}/>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};