
import { useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import { axiosPrivate } from "../api/axios";

export const useAxios = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          console.log("changing access token : ", auth.accessToken);
          config.headers["Authorization"] = `${auth.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log("error in res : ", error);
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          console.log("new access token: ", newAccessToken);
          prevRequest.headers["Authorization"] = `${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxios;
