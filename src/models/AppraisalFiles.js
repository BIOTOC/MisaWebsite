// models/AppraisalFiles.js
// class AppraisalFiles {
//   constructor(data = {}) {
//     this.images = data.images || []                 //ảnh
//     this.attachments = data.attachments || []       //file đính kèm
//   }
// }

// export default AppraisalFiles

// models/AppraisalFiles.js
class AppraisalFiles {
  constructor(data = []) {
    // data là mảng appraisalFiles từ API
    this.images = [];
    this.attachments = [];

    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const documentExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "txt"];

    data.forEach(file => {
      const ext = file.name.split(".").pop().toLowerCase();

      if (imageExtensions.includes(ext)) {
        this.images.push(file);
      } else if (documentExtensions.includes(ext)) {
        this.attachments.push(file);
      } else {
        this.attachments.push(file);
      }
    });
  }
}

export default AppraisalFiles;
