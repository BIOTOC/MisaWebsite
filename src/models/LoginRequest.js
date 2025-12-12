// models/LoginRequest.js
class LoginRequest {
  constructor({ user_name = "", password = "", ma_dvi = ""}) {
    this.user_name = user_name;
    this.password = password;
    this.ma_dvi = ma_dvi;
  }
}

export default LoginRequest;