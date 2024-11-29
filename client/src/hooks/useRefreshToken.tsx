import React, { useContext } from 'react'
import AuthContext from '../context/authProvider';
import axios from '../api/axios';

const useRefreshToken = () => {
  const { setAuth } = useContext(AuthContext);
  const refreshToken = async () => {
    const res = await axios.get<{accessToken: string, refresToken: string}>("/api/v1/user/refreshToken", {
        withCredentials: true
    });
    setAuth({accessToken: res.data.accessToken, user: ""});
    console.log("res.data.accessToken: ", res.data.refresToken);
    return res.data.accessToken;
  };

  return refreshToken;
}

export default useRefreshToken