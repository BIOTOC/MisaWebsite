// models/AppraisalFiles.js
class AppraisalFiles {
  constructor(data = []) {
    this.images = [];
    this.attachments = [];

    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const documentExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "txt", "csv"];

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
