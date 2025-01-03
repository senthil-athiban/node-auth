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

  const handleGithubLogin = async () => {
    const res = window.open("http://localhost:8080/auth/github", "_self");
    console.log("res : ", res);
  }

  const handleSlackLogin = () => {
    const res = window.open("http://localhost:8080/auth/slack", "_self");
  }

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


  const handleLogout = async () => {
    const res = await axios.get("/auth/github/logout");
    console.log("res" , res);
  }
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
      <button onClick={handleGithubLogin}>Login in using github</button>
      <button onClick={handleSlackLogin}>Login in using Slack</button>
      <button onClick={handleLogout}>Logout</button>
      <a href="https://slack.com/oauth/v2/authorize?client_id=8209065264739.8221208121687&scope=channels:join,channels:read,chat:write,groups:read,incoming-webhook,team:read,users:read,im:read,mpim:read&user_scope="><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>
      {/* <a href="https://slack.com/oauth/v2/authorize?client_id=8209065264739.8221208121687&scope=channels:read,chat:write,team:read,users:read,groups:read,incoming-webhook&user_scope="><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a> */}
      {/* <a href="https://slack.com/oauth/v2/authorize?client_id=8209065264739.8221208121687&scope=channels:read,chat:write,team:read,users:read,groups:read&user_scope="><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a> */}
      {/* <a href="https://slack.com/oauth/v2/authorize?client_id=8209065264739.8221208121687&scope=channels:read&user_scope=admin"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a> */}
      {/* <a href="https://slack.com/oauth/v2/authorize?client_id=8209065264739.8221851186833&scope=chat:write,chat:write.public,incoming-webhook,channels:read,groups:read,mpim:read,im:read&user_scope="><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a> */}
    </div>
  );
};

export default Signup;
