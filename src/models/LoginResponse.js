// models/LoginResponse.js
class LoginResponse {
  constructor(data = {}) {
    this.id = data.id || "";
    this.userName = data.user_name || "";
    this.staffName = data.ten_cb || "";
    this.token = data.token || "";
    this.staffCode = data.ma_cb || "";
    this.unitCode = data.ma_dvi || "";
    this.success = data.success || false;
    this.message = data.message || "";
    this.errorCode = data.error_code || "";
  }
}

export default LoginResponse;
