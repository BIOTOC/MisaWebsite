// models/InsuranceDetail.js
import Vehicle from "./Vehicle"
import AuditHistory from "./AuditHistory"
import Customer from "./Customer"

class InsuranceDetail {
  constructor(data = {}) {
    this.id = data.id || ""                               //id đơn
    this.orderStatus = data.orderStatus || ""             //trạng thái đơn
    this.handlingStatus = data.handlingStatus || ""       //trạng thái xử lý

    this.buyer = new Customer(data.buyer)
    this.beneficiary = new Customer(data.beneficiary)

    this.vehicles = (data.vehicles || []).map(v => new Vehicle(v))
    this.auditHistory = (data.auditHistory || []).map(a => new AuditHistory(a))
  }
}

export default InsuranceDetail
