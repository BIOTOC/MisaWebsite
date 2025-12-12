// models/Customer.js
class Customer {
  constructor(data = {}) {
    this.type = data.type || ""         //Loại khách hàng
    this.name = data.name || ""         //Họ và tên
    this.cccd = data.identity || ""         //CCCD/CMND
    this.address = data.address || ""   //Địa chỉ
    this.email = data.email || ""       //Email
    this.phone = data.phone || ""       //Số điện thoại
  }
}

export default Customer
