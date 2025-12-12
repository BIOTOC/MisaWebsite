// models/AuditHistory.js

class AuditHistory {
  constructor(data = {}) {

    this.date = this.formatHistoryDate(data.date) || ""
    this.user = data.user || "";               // người thực hiện
    this.email = data.email || "";         // email người xử lý
    this.customer = data.customer || "";   // tên khách hàng
    this.plate = data.plate || "";         // biển số xe
    this.result = data.result || "";       // kết quả thẩm định
    this.description = data.description || ""; // mô tả chi tiết
  }

  formatHistoryDate(isoString) {
    if (!isoString) return "";

    const d = new Date(isoString);

    const pad = (n) => String(n).padStart(2, "0");

    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());

    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  }
}

export default AuditHistory