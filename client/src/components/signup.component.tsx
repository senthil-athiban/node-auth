import React from "react";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import useAxios from "../services/useAxios";

const Signup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const axiosPrivate = useAxios();

  const { setAuth } = useAuth();
  const handleGoogleLogin = async () => {
    const res = window.open("http://localhost:8080/google-login", "_self");
  };

  const handleSubmit = async () => {
    const res = await axios.post("/api/v1/user/signup", {
      username: name,
      password,
    });
    alert(res);
    console.log(res);
  };

  const handleLogin = async () => {
    const res = await axios.post("/api/v1/user/login", {
      username: name,
      password,
    });
    const data = res.data;
    setAuth({accessToken: data.accessToken, user: data.user.username});
  };


  return (
    <div>
      <form action="" style={{ display: "flex", flexDirection: "column" }}>
        <input
          type="text"
          name=""
          id=""
          placeholder="username"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          name=""
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={handleSubmit}>
          Sign up
        </button>
      </form>
      <button onClick={handleLogin}>login </button>
      {/* <button onClick={handleClick}>Verify </button> */}
      <button onClick={handleGoogleLogin}>Login in using google</button>
    </div>
  );
};

export default Signup;
