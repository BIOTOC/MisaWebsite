// utils/dateFormatter.js
export function formatDate(dateString) {
  if (!dateString) return "null";

  const d = new Date(dateString);

  if (isNaN(d)) return "null"; // nếu API trả về format lạ

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}
