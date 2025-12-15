import { formatDate } from "../utils/DateFormatter";

class InsuranceOrder {
  constructor(data = {}) {
    this.id = data.id || ""                         // id đơn
    this.customer = data.customer || ""             // Tên khách hàng
    this.license = data.license || ""               // Biển số xe
    this.frame = data.frame || ""                   // Số khung
    this.engine = data.engine || ""                 // Số máy
    this.type = data.type || ""                     // Loại hình bảo hiểm
    this.insuredValue = data.insuredValue || 0      // STBH
    this.fee = data.fee || 0                        // Phí BH

    this.createdAt = formatDate(data.createdAt) || ""

    this.orderStatus = data.orderStatus || ""       // Trạng thái đơn
    this.processor = data.processor || ""           // Người xử lý
    this.handlingStatus = data.handlingStatus || "" // Trạng thái xử lý
    this.result = data.result || ""                 // Kết quả
  }
}

export default InsuranceOrder
