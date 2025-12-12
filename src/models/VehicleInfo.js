// models/VehicleInfo.js
import { formatDate } from "../utils/DateFormatter";

class VehicleInfo {
  constructor(data = {}) {
    this.usedStatus = data.vehicleStatus === "OLD" ? "Xe cũ"      //Tính chất xe
                 : data.vehicleStatus === "NEW" ? "Xe mới"
                 : "";         
    this.brand = data.vehicleBrand || ""                   //Hãng xe
    this.model = data.vehicleSubBrand || ""                   //Hiệu xe
    this.modelCode = data.modelCode || ""           //Model code
    this.manufactureMonthYear = data.manufactureMonthYear || ""    //Tháng/năm sản xuất
    this.usagePurpose = data.usePurpose || ""      //Mục đích sử dụng
    this.vehicleType = data.vehicleType || ""        //Loại xe
    this.seatCount = data.numOfSeats || ""            //Số chỗ ngồi
    this.load = data.weight != null ? data.weight : "";                   //Trọng tải
    this.plate = data.licensePlate || ""                    //Biển số xe
    this.chassisNo = data.frameNumber || ""            //Số khung
    this.engineNo = data.engineNumber || ""              //Số máy
    this.electricEngine = data.electricEngine || ""  //Số máy điện
    this.marketPrice = data.vehicleValue || ""        //Giá trị xe
    this.insuredValue = data.insuredValue || ""      //Số tiền bảo hiểm
    this.insuranceType = data.type || ""    //Loại hình bảo hiểm
    this.deductible = data.deductible || ""          //Mức khấu trừ
    this.startDate = formatDate(data.effectiveDate) || ""            //Hiệu lực từ
    this.endDate = formatDate(data.expirationDate) || ""                //Hiệu lực đến
    this.insuredAmount = data.insuredAmount || ""    //Phí bảo hiểm
    this.extraTerms = data.extraTerms || ""          //Điều khoản bổ sung
  }
}

export default VehicleInfo
