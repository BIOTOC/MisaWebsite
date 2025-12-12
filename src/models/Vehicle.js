// models/Vehicle.js
import Customer from "./Customer"
import VehicleInfo from "./VehicleInfo"
import AppraisalFiles from "./AppraisalFiles"

class Vehicle {
  constructor(data = {}) {
    this.iddt = data.id_dt || ""
    this.owner = data.owner || ""                                   //chủ xe  
    this.license = data.license || ""                               //biển số xe
    this.frame = data.frame || ""                                   //số khung
    this.engine = data.engine || ""                                 //số máy
    this.insuredPeriod = data.insuredPeriod || ""                   //thời hạn bảo hiểm
    this.result = data.result || ""                                 //trạng thái thẩm định
    this.appraisalDate = data.appraisalDate || ""                   //ngày thẩm định
    this.appraisalNote = data.appraisalNote || ""                   //mô tả chi tiết

    this.ownerInfo = new Customer(data.ownerInfo)

    this.beneficiary = new Customer(data.beneficiary)

    this.vehicleInfo = new VehicleInfo(data.vehicleInfo)
    this.appraisalFiles = new AppraisalFiles(data.appraisalFiles)

  }
}

export default Vehicle
