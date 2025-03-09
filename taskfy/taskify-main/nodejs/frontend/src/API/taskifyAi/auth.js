import BaseApi from "./base";
import TokenService from "./tokenService";

class AuthApi extends BaseApi {
  async signin(email, password) {
    try {
      const { data } = await this.api.post("/user/signin", {
        email,
        password,
      });

      if (data.success) {
        TokenService.setTokens(data.accessToken, data.refreshToken);
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Bağlantı hatası",
      };
    }
  }

  async signup(userData) {
    try {
      const { data } = await this.api.post("/user/signup", userData);
      return data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Kayıt başarısız",
      };
    }
  }

  async refreshToken() {
    try {
      const refreshToken = TokenService.getRefreshToken();
      const { data } = await this.api.post("/user/refresh-token", {
        refreshToken,
      });

      if (data.success) {
        TokenService.setTokens(data.accessToken, data.refreshToken);
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: "Token yenileme başarısız",
      };
    }
  }

  logout() {
    TokenService.clearTokens();
  }
}

export default new AuthApi();
