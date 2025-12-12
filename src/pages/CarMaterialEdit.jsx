import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { File, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import { getInsuranceDetail, createVehicleUW, pushToPartner } from "../services/insuranceDetailService";
import { getSearchBoxData } from "../services/insuranceService";
import { showToast } from "../components/toastCustom";

export default function CarMaterialDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedResult, setSelectedResult] = useState("");
    const [description, setDescription] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [uwStatus, setUwStatus] = useState([]);
    const [reStatus, setReStatus] = useState([]);
    const [insurStatus, setInsurStatus] = useState([]);
    const images = selectedVehicle?.appraisalFiles?.images || [];
    const [previewIndex, setPreviewIndex] = useState(null);

    useEffect(() => {
        const fetchDropdown = async () => {
            try {
                const res = await getSearchBoxData();
                if (res?.Status === "OK") {
                    setUwStatus(res.Data.UwStatus || []);
                    setReStatus(res.Data.ReStatus || []);
                    setInsurStatus(res.Data.InsurStatus || []);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu dropdown:", error);
            }
        };

        fetchDropdown();
    }, []);

    // pagination
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const [detail, setDetail] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await getInsuranceDetail(id);
                setDetail(data);
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết bảo hiểm:", error);
            }
        };

        fetchDetail();
    }, [id]);

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

    const totalPages = Math.max(1, Math.ceil(detail.vehicles.length / itemsPerPage));
    const paginated = detail.vehicles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const confirmSubmit = async () => {
        setConfirmOpen(false);

        try {
            if (!selectedVehicle) {
                showToast("error", "Vui lòng chọn xe cần thẩm định!");
                return;
            }

            const res = await pushToPartner(
                "MISA",
                "XE",
                detail.id,
                detail.orderStatus,
                detail.handlingStatus,
                selectedVehicle?.iddt,
                selectedResult?.Code,
                description
            );

            const message =
                res?.Message?.trim() ||
                (res?.Status === "OK" ? "Gửi kết quả thành công!" : "Có lỗi xảy ra!");

            if (res?.Status === "OK") {
                showToast("success", message);
            } else {
                showToast("error", message);
            }
        } catch (error) {
            console.error(error);
            showToast("error", "Không thể gửi kết quả thẩm định!");
        }
    };

    const handleSelectVehicle = (vehicle) => {
        setSelectedVehicle(vehicle);
        setDescription(vehicle.appraisalNote || "");

        const selectedOption = uwStatus.find(opt => opt.Code === vehicle.result);
        setSelectedResult(selectedOption || null);
    };

    const handleSave = async () => {
        try {
            const res = await createVehicleUW(
                detail.id,
                detail.orderStatus,
                detail.handlingStatus,
                selectedVehicle?.iddt,
                selectedResult?.Code,
                description
            );

            const message = res?.Message?.trim() ||
                (res?.Status === "OK" ? "Lưu thành công!" : "Có lỗi xảy ra!");

            if (res?.Status === "OK") {
                showToast("success", message);
            } else {
                showToast("error", message);
            }
        } catch {
            showToast("error", "Không thể kết nối server!");
        }
    };

    return (
        <div className="p-4 text-xs">
            {/* Thông tin chung */}
            <div className="mb-2 text-xs">
                <h2 className="font-bold text-lg mb-2">CHI TIẾT THẨM ĐỊNH DỊCH VỤ</h2>
                <div className="ml-5 flex items-center gap-3 md:gap-20 flex-wrap">
                    <p>ID đơn: <b>{detail.id}</b></p>
                    <p>Trạng thái đơn: <b>{insurStatus.find(s => s.Code === detail.orderStatus)?.Name || detail.orderStatus}</b></p>
                    <p>Trạng thái xử lý: <b>{reStatus.find(s => s.Code === detail.handlingStatus)?.Name || detail.handlingStatus}</b></p>
                </div>
            </div>

            {/* Thông tin bên mua */}
            <div className="border p-4 mb-4">
                <p className="font-semibold text-brand-orange text-sm mb-1"> Thông tin bên mua bảo hiểm </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs mb-4">
                    <p>Loại khách hàng: {detail.buyer.type}</p>
                    <p>CCCD/CMND: {detail.buyer.cccd}</p>
                    <p>Email: {detail.buyer.email}</p>
                    <p>Họ và tên: {detail.buyer.name}</p>
                    <p>Địa chỉ: {detail.buyer.address}</p>
                    <p>Số điện thoại: {detail.buyer.phone}</p>
                </div>
            </div>

            {/* Danh sách xe */}
            <p className="font-semibold text-brand-orange text-sm mb-2">Danh sách xe cần thẩm định</p>
            <div className="overflow-x-auto border">
                <table className="w-full text-xs">
                    <thead className="bg-gray-100">
                        <tr className="[&>th]:border [&>th]:px-2 [&>th]:py-1 text-center">
                            <th className="min-w-[40px]">STT</th>
                            <th className="min-w-[120px]">Chủ xe</th>
                            <th className="min-w-[120px]">Biển số xe</th>
                            <th className="min-w-[120px]">Số khung</th>
                            <th className="min-w-[120px]">Số máy</th>
                            <th className="min-w-[160px]">Thời hạn bảo hiểm</th>
                            <th className="min-w-[160px]">Trạng thái thẩm định</th>
                            <th className="min-w-[140px]">Ngày thẩm định</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((v, i) => (
                            <tr
                                key={i}
                                onClick={() => handleSelectVehicle(v)}
                                className="[&>td]:border [&>td]:px-2 [&>td]:py-1 text-left cursor-pointer hover:bg-gray-50"
                            >
                                <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                <td>{v.owner}</td>
                                <td>{v.license}</td>
                                <td>{v.frame}</td>
                                <td>{v.engine}</td>
                                <td>{v.insuredPeriod}</td>
                                <td>{uwStatus.find(s => s.Code === v.result)?.Name || v.result}</td>
                                <td>{v.appraisalDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-3 flex justify-end gap-2 text-sm">
                {totalPages > 0 && (
                    <>
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 border rounded ${currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
                        >
                            <ChevronLeft size={14} />
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-brand-orange hover:bg-brand-orange-hover text-white" : "bg-white"}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 border rounded ${currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
                        >
                            <ChevronRight size={14} />
                        </button>
                    </>
                )}
            </div>

            {/* CHI TIẾT XE */}
            {selectedVehicle ? (
                <div className="mt-5 space-y-4">
                    {/* Thông tin chủ xe */}
                    <div className="border p-3">
                        <p className="font-semibold text-brand-orange text-sm mb-2">Thông tin chủ xe</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                            <div>Loại khách hàng: {selectedVehicle.ownerInfo?.type}</div>
                            <div>CCCD/CMND: {selectedVehicle.ownerInfo?.cccd}</div>
                            <div>Email: {selectedVehicle.ownerInfo?.email}</div>
                            <div>Họ và tên: {selectedVehicle.ownerInfo?.name}</div>
                            <div>Địa chỉ: {selectedVehicle.ownerInfo?.address}</div>
                            <div>Số điện thoại: {selectedVehicle.ownerInfo?.phone}</div>
                        </div>
                    </div>

                    <div className="border p-3">
                        <p className="font-semibold text-brand-orange text-sm mb-2">Thông tin thụ hưởng</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                            <p>Loại khách hàng: {selectedVehicle.beneficiary?.type}</p>
                            <p>CCCD/CMND: {selectedVehicle.beneficiary?.cccd}</p>
                            <p>Email: {selectedVehicle.beneficiary?.email}</p>
                            <p>Họ và tên: {selectedVehicle.beneficiary?.name}</p>
                            <p>Địa chỉ: {selectedVehicle.beneficiary?.address}</p>
                            <p>Số điện thoại: {selectedVehicle.beneficiary?.phone}</p>
                        </div>
                    </div>

                    {/* Thông tin xe */}
                    <div className="border p-3">
                        <p className="font-semibold text-brand-orange text-sm mb-2">Thông tin xe</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                            <div>Tính chất xe: {selectedVehicle.vehicleInfo?.usedStatus}</div>
                            <div>Hãng xe: {selectedVehicle.vehicleInfo?.brand}</div>
                            <div>Tháng/năm sản xuất: {selectedVehicle.vehicleInfo?.manufactureMonthYear}</div>
                            <div>Mục đích sử dụng: {selectedVehicle.vehicleInfo?.usagePurpose}</div>
                            <div>Hiệu xe: {selectedVehicle.vehicleInfo?.model}</div>
                            <div>Số chỗ ngồi: {selectedVehicle.vehicleInfo?.seatCount}</div>
                            <div>Loại xe: {selectedVehicle.vehicleInfo?.vehicleType}</div>
                            <div>Model code: {selectedVehicle.vehicleInfo?.modelCode}</div>
                            <div>Trọng tải: {selectedVehicle.vehicleInfo?.load}</div>
                            <div>Biển số xe: {selectedVehicle.vehicleInfo?.plate}</div>
                            <div>Số máy điện: {selectedVehicle.vehicleInfo?.electricEngine}</div>
                            <div>Hiệu lực từ: {selectedVehicle.vehicleInfo?.startDate}</div>
                            <div>Số khung: {selectedVehicle.vehicleInfo?.chassisNo}</div>
                            <div>Giá trị xe: {Number(selectedVehicle.vehicleInfo?.marketPrice).toLocaleString("vi-VN")} VND</div>
                            <div>Hiệu lực đến: {selectedVehicle.vehicleInfo?.endDate}</div>
                            <div>Số máy: {selectedVehicle.vehicleInfo?.engineNo}</div>
                            <div>Số tiền bảo hiểm: {Number(selectedVehicle.vehicleInfo?.insuredValue).toLocaleString("vi-VN")} VND</div>
                            <div>Phí bảo hiểm: {Number(selectedVehicle.vehicleInfo?.insuredAmount).toLocaleString("vi-VN")} VND</div>
                            <div>Mức khấu trừ: {Number(selectedVehicle.vehicleInfo?.deductible).toLocaleString("vi-VN")} VND</div>
                            <div>Loại hình bảo hiểm: {selectedVehicle.vehicleInfo?.insuranceType}</div>
                            <div>Điều khoản bổ sung: {selectedVehicle.vehicleInfo?.extraTerms}</div>
                        </div>
                    </div>

                    {/* Ảnh và file */}
                    <div className="border p-3">
                        <p className="font-semibold text-brand-orange text-sm mb-2">Thông tin thẩm định</p>

                        <div className="mb-2 text-xs">
                            <div className="mb-1">Ảnh xe / Đăng kiểm / Đăng ký</div>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                {(selectedVehicle.appraisalFiles?.images || []).map((img, idx) => (
                                    <div
                                        key={idx}
                                        className="border rounded overflow-hidden cursor-pointer"
                                        onClick={() => {
                                            setPreviewIndex(idx);
                                            setPreviewImage(`${img.link}?t=${new Date().getTime()}`);
                                        }}
                                    >
                                        <img
                                            src={img.link}
                                            alt={img.name || `img-${idx}`}
                                            className="w-full h-20 object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-2 text-xs">
                            <div className="mb-1">File đính kèm</div>
                            <div className="flex gap-2">
                                {(selectedVehicle.appraisalFiles?.attachments || []).map((f, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => window.open(f.link, "_blank")}
                                        className="flex items-center gap-2 border rounded px-2 py-1 cursor-pointer hover:bg-gray-100"
                                    >
                                        <File className="w-4 h-4" />
                                        <span>{f.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Kết quả thẩm định */}
                    <div className="border p-3 text-xs">
                        <p className="font-semibold text-brand-orange text-sm mb-3">Kết quả thẩm định</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                            {/* Dropdown kết quả */}
                            <div className="flex flex-col">
                                <label className="mb-1">Kết quả thẩm định</label>
                                <Listbox value={selectedResult} onChange={setSelectedResult}>
                                    <div className="relative w-full">
                                        <ListboxButton className="border rounded px-2 py-[3px] w-full text-left flex justify-between items-center">
                                            <span className="truncate">{selectedResult?.Name || "Chọn kết quả"}</span>
                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                        </ListboxButton>

                                        <ListboxOptions className="absolute mt-1 w-full bg-white border rounded shadow text-xs z-10 max-h-40 overflow-auto">
                                            {uwStatus.map((option) => (
                                                <ListboxOption
                                                    key={option.Code}
                                                    value={option}
                                                    as="li"
                                                    className={({ focus, selected }) =>
                                                        `px-2 py-1 cursor-pointer ${focus ? "bg-brand-orange text-white" : ""} ${selected ? "font-semibold" : ""}`
                                                    }
                                                >
                                                    {option.Name}
                                                </ListboxOption>
                                            ))}
                                        </ListboxOptions>
                                    </div>
                                </Listbox>
                            </div>

                            {/* Mô tả chi tiết */}
                            <div className="flex flex-col md:col-span-2">
                                <label className="mb-1">Mô tả chi tiết</label>
                                <textarea
                                    className="border rounded px-2 py-1 w-full h-20"
                                    placeholder="Nhập mô tả chi tiết..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="text-xs mb-3">
                        <Link
                            to={`/car-material/${id}/history`}
                            state={{
                                from: "edit",
                                id,
                                iddt: 1
                                // iddt: selectedVehicle.iddt
                            }}
                            className="text-blue-600 underline"
                        >
                            Lịch sử thẩm định
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-6 mt-5 text-xs">
                        <div className="flex justify-center mt-2">
                            <button
                                className="w-full md:w-auto px-6 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded"
                                onClick={() => navigate("/car-material")}
                            >
                                Quay lại
                            </button>
                        </div>

                        <div className="flex justify-center mt-2">
                            <button
                                className="w-full md:w-auto px-6 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded"
                                onClick={handleSave}
                            >
                                Lưu
                            </button>
                        </div>

                        <div className="flex justify-center mt-2">
                            <button
                                onClick={() => setConfirmOpen(true)}
                                className="w-full md:w-auto px-6 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded"
                            >
                                Gửi kết quả thẩm định
                            </button>
                        </div>

                        <ConfirmModal
                            open={confirmOpen}
                            onClose={() => setConfirmOpen(false)}
                            onConfirm={confirmSubmit}
                        />
                    </div>
                </div>
            ) : null}

            {/* Modal xem ảnh + thumbnails */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center 
        z-50 p-4 top-[60px] left-0 lg:left-[240px]"
                    onClick={() => setPreviewImage(null)}
                >
                    {/* Nút đóng */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage(null);
                            setPreviewIndex(null);
                        }}
                        className="absolute top-4 right-4 bg-black/60 text-white w-10 h-10 
            rounded-full flex items-center justify-center text-xl font-bold 
            hover:bg-black/80 transition z-50"
                    >
                        ×
                    </button>

                    {/* Ảnh lớn */}
                    <img
                        src={previewImage}
                        className="max-w-[90vw] max-h-[65vh] object-contain rounded-x0 shadow-lg mb-4"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Thumbnails */}
                    <div
                        className="flex gap-2 p-2 bg-black/40 rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {images.slice(0, 5).map((img, idx) => (
                            <img
                                key={idx}
                                src={img.link}
                                className={`w-16 h-16 object-cover cursor-pointer rounded border 
                    ${idx === previewIndex ? "border-orange-400" : "border-transparent"}`}
                                onClick={() => {
                                    setPreviewIndex(idx);
                                    setPreviewImage(`${img.link}?t=${new Date().getTime()}`);
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
