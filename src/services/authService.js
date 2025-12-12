// services/authService.js
import LoginRequest from "../models/LoginRequest";
import LoginResponse from "../models/LoginResponse";

export const login = async (username, password, ma_dvi) => {
  try {
    const payload = new LoginRequest({
      user_name: username,
      password: password,
      ma_dvi: ma_dvi
    });

    const response = await fetch(
      "https://aut.bshc.com.vn/api/cms-auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const raw = await response.json();

    const data = new LoginResponse(raw);

    if (!data.success) {
      throw new Error(data.message || "Đăng nhập thất bại");
    }

    return data;
  } catch (err) {
    console.error("Login API error:", err);
    return null;
  }
};
