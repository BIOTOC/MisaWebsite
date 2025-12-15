import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getHistoryData } from "../services/insuranceDetailService";
import { getSearchBoxData } from "../services/insuranceService";
import Breadcrumb from "../components/Breadcrumb";

export default function CarInspectionHistoryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { from, id, iddt } = location.state || {};

  const [detail, setDetail] = useState(null);
  const [uwStatus, setUwStatus] = useState([]);

  useEffect(() => {
    const fetchDropdown = async () => {
      try {
        const res = await getSearchBoxData();
        if (res?.Status === "OK") {
          setUwStatus(res.Data.UwStatus || []);
        }
      } catch (err) {
        console.error("Lỗi lấy UW Status:", err);
      }
    };
    fetchDropdown();
  }, []);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getHistoryData(id, iddt);
        setDetail(data.auditHistory);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết lịch sử bảo hiểm:", error);
      }
    };

    fetchDetail();
  }, [id, iddt]);

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 bg-orange-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
        <p className="mt-2 text-xl text-brand-orange">Đang tải dữ liệu</p>
      </div>
    );
  }

  // Hàm quay lại
  const handleBack = () => {
    if (from === "detail") {
      navigate(`/car-material/${id}`);
    } else if (from === "edit") {
      navigate(`/car-material/${id}/edit`);
    } else {
      navigate("/car-material");
    }
  };

  return (
    <div>
      <div className="px-6 pb-6 pt-0">
        {/* TITLE */}
        <h1 className="text-brand-orange text-xl font-bold mb-4">
          Lịch sử thẩm định
        </h1>

        {/* TABLE */}
        <div className="overflow-x-auto overflow-y-auto max-h-[56vh] border border-gray-500">
          <table className="w-full border-collapse text-sm">

            {/* HEADER */}
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-200 text-gray-700">
                <th className="border border-gray-500 px-2 py-1 whitespace-nowrap min-w-[160px]">
                  Ngày xử lý
                </th>
                <th className="border border-gray-500 px-2 py-1 whitespace-nowrap min-w-[130px]">
                  Người xử lý
                </th>
                <th className="border border-gray-500 px-2 py-1 whitespace-nowrap min-w-[160px]">
                  Email xử lý
                </th>
                <th className="border border-gray-500 px-2 py-1 whitespace-nowrap min-w-[150px]">
                  Tên khách hàng
                </th>
                <th className="border border-gray-500 px-2 py-1 whitespace-nowrap min-w-[110px]">
                  Biển số xe
                </th>
                <th className="border border-gray-500 px-2 py-1 whitespace-nowrap min-w-[150px]">
                  Kết quả thẩm định
                </th>
                <th className="border border-gray-500 px-2 py-1 whitespace-nowrap min-w-[220px]">
                  Mô tả chi tiết
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {detail.map((row, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} hover:bg-gray-50`}
                >
                  <td className="border border-gray-500 px-2 py-1">{row.date}</td>
                  <td className="border border-gray-500 px-2 py-1">{row.user}</td>
                  <td className="border border-gray-500 px-2 py-1">{row.email}</td>
                  <td className="border border-gray-500 px-2 py-1">{row.customer}</td>
                  <td className="border border-gray-500 px-2 py-1">{row.plate}</td>
                  <td className="border border-gray-500 px-2 py-1">{uwStatus.find(s => s.Code === row.result)?.Name || row.result}</td>
                  <td className="border border-gray-500 px-2 py-1">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={handleBack}
            className="w-full md:w-auto px-6 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
