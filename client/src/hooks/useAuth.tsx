import React, { useContext, useDebugValue } from 'react'
import AuthContext from '../context/authProvider'

const useAuth = () => {
  const { auth } = useContext(AuthContext);
  useDebugValue(auth, auth => auth?.user ? "Logged in" : "Logged out");
  return useContext(AuthContext);
}

export default useAuth