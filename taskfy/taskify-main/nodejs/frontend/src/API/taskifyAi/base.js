import axios from "axios";
import TokenService from "./tokenService";

class BaseApi {
  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:5000/api",
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        const token = TokenService.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = TokenService.getRefreshToken();
            const response = await axios.post("/api/user/refresh-token", {
              refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } =
              response.data;
            TokenService.setTokens(accessToken, newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.api(originalRequest);
          } catch (error) {
            TokenService.clearTokens();
            window.location.href = "/signin";
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

export default BaseApi;
