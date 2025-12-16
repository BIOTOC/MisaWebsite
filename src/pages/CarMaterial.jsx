import SearchBox from "../components/Searchbox";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"
import { getInsuranceOrders } from "../services/insuranceService"
import fontNormal from "../fonts/Roboto-Regular-normal";
import fontBold from "../fonts/Roboto-Bold-normal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getSearchBoxData } from "../services/insuranceService"
import { ChevronLeft, ChevronRight } from "lucide-react";



const TableSkeleton = () => {
    return (
        <>
            {[...Array(5)].map((_, i) => (
                <tr key={i}>
                    {[...Array(13)].map((_, j) => (
                        <td key={j} className="px-2 py-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
};

export default function CarMaterial() {
    const navigate = useNavigate();

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStr = lastMonth.toISOString().split("T")[0];

    const [filters, setFilters] = useState({
        fromDate: lastMonthStr,
        toDate: todayStr,
        channel: "MISA",
        customer: "",
        vehicle: "",
        handlingStatus: "",
        orderStatus: "",
        result: "",
    });

    const [data, setData] = useState([])
    const [pageLoading, setPageLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [dropdownData, setDropdownData] = useState({
        uwStatus: [],
        reStatus: [],
        insurStatus: []
    });
    const [searchInputs, setSearchInputs] = useState({
        customer: "",
        vehicle: ""
    });

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        async function loadData() {
            setPageLoading(true);

            try {

                const [orders, dropdown] = await Promise.all([
                    getInsuranceOrders(filters),
                    getSearchBoxData()
                ]);

                setData(orders);

                if (dropdown?.Status === "OK") {
                    setDropdownData({
                        uwStatus: dropdown.Data.UwStatus ?? [],
                        reStatus: dropdown.Data.ReStatus ?? [],
                        insurStatus: dropdown.Data.InsurStatus ?? []
                    });
                }
            } catch (e) {
                console.error(e);
            } finally {
                setPageLoading(false);
            }
        }

        loadData();
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */

    const handleSearch = async () => {
        const updatedFilters = { ...filters, ...searchInputs };
        setFilters(updatedFilters);
        setTableLoading(true);

        try {
            const orders = await getInsuranceOrders(updatedFilters);
            setData(orders);
            setCurrentPage(1);
        } catch (err) {
            console.error(err);
        } finally {
            setTableLoading(false);
        }
    };

    const statusMaps = {
        orderStatus: dropdownData.insurStatus.reduce((acc, x) => {
            acc[x.Name] = x.Code;
            return acc;
        }, {}),
        handlingStatus: dropdownData.reStatus.reduce((acc, x) => {
            acc[x.Name] = x.Code;
            return acc;
        }, {})
    };


    const handleRowClick = (item) => {
        const orderCode = statusMaps.orderStatus[item.orderStatus];
        const handlingCode = statusMaps.handlingStatus[item.handlingStatus];

        const isCompleted =
            (orderCode === "D" || orderCode === "T") &&
            (handlingCode === "Completed" || handlingCode === "PendingCallback");

        if (isCompleted) {
            navigate(`/car-material/${item.id}`);
        } else {
            navigate(`/car-material/${item.id}/edit`);
        }
    };

    const itemsPerPage = 7;
    const [currentPage, setCurrentPage] = useState(1);

    const filteredData = data.filter(
        (row) =>
            (!filters.customer || row.customer.includes(filters.customer)) &&
            (!filters.vehicle || row.license.includes(filters.vehicle))
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getPageNumbers = () => {
        const maxButtons = 5;
        const pages = [];

        let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let end = start + maxButtons - 1;

        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - maxButtons + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const exportPDF = () => {
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "pt",
            format: "a4"
        });
        doc.addFileToVFS("Roboto-Regular-normal.ttf", fontNormal);
        doc.addFont("Roboto-Regular-normal.ttf", "Roboto", "normal");

        doc.addFileToVFS("Roboto-Bold-normal.ttf", fontBold);
        doc.addFont("Roboto-Bold-normal.ttf", "Roboto", "bold");

        doc.setFont("Roboto", "bold");
        doc.setFontSize(14);
        doc.text("Danh sách Vật chất xe", 40, 40);

        const columns = [
            "ID đơn", "Tên KH", "Biển số", "Số khung", "Số máy",
            "Loại BH", "STBH", "Phí BH", "Ngày tạo",
            "Trạng thái đơn", "Người xử lý", "Trạng thái xử lý", "Kết quả"
        ];

        const rows = filteredData.map(row => [
            row.id,
            row.customer,
            row.license,
            row.frame,
            row.engine,
            row.type,
            row.insuredValue.toLocaleString(),
            row.fee.toLocaleString(),
            row.createdAt,
            row.orderStatus,
            row.processor,
            row.handlingStatus,
            row.result
        ]);

        autoTable(doc, {
            startY: 60,
            head: [columns],
            body: rows,
            styles: {
                font: "Roboto",
                fontSize: 8,
            },
            headStyles: {
                fillColor: [230, 230, 230],
                textColor: 20,
                fontStyle: "bold"
            },
            theme: "grid"
        });

        doc.save("vat-chat-xe.pdf");
    };

        if (pageLoading) {
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


    return (
        <div>
            {/* Search Box */}
            <SearchBox
                filters={filters}
                setFilters={setFilters}
                dropdownData={dropdownData}
                searchInputs={searchInputs}
                setSearchInputs={setSearchInputs}
                onSearch={handleSearch}
                onReset={async () => {
                    const resetFilters = {
                        fromDate: lastMonthStr,
                        toDate: todayStr,
                        channel: "MISA",
                        customer: "",
                        vehicle: "",
                        handlingStatus: "",
                        orderStatus: "",
                        result: "",
                    };
                    setFilters(resetFilters);
                    setSearchInputs({ customer: "", vehicle: "" });
                    setCurrentPage(1);

                    // Lấy lại dữ liệu toàn bộ
                    setTableLoading(true);
                    try {
                        const orders = await getInsuranceOrders(resetFilters);
                        setData(orders);
                    } catch (err) {
                        console.error(err);
                    } finally {
                        setTableLoading(false);
                    }
                }}
            />

            {/* Table */}
            <div className="overflow-x-auto overflow-y-auto max-h-[70vh] border rounded shadow-sm text-xs">
                <table className="w-full border border-gray-300 table-auto">
                    <thead className="bg-gray-100">
                        <tr className="[&>th]:border [&>th]:px-2 [&>th]:py-2 [&>th]:whitespace-nowrap font-semibold text-center">
                            <th className="min-w-[90px]">ID đơn</th>
                            <th className="min-w-[130px]">Tên khách hàng</th>
                            <th className="min-w-[110px]">Biển số xe</th>
                            <th className="min-w-[120px]">Số khung</th>
                            <th className="min-w-[120px]">Số máy</th>
                            <th className="min-w-[130px]">Loại hình BH</th>
                            <th className="min-w-[100px]">STBH</th>
                            <th className="min-w-[90px]">Phí BH</th>
                            <th className="min-w-[110px]">Ngày tạo</th>
                            <th className="min-w-[130px]">Trạng thái đơn</th>
                            <th className="min-w-[120px]">Người xử lý</th>
                            <th className="min-w-[130px]">Trạng thái xử lý</th>
                            <th className="min-w-[120px]">Kết quả</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tableLoading ? (
                            <TableSkeleton />
                        ) : (
                            paginatedData.map((row, i) => (
                                <tr
                                    key={i}
                                    onClick={() => handleRowClick(row)}
                                    className="[&>td]:border [&>td]:px-2 [&>td]:py-1 hover:bg-orange-100 text-left">
                                    <td>{row.id}</td>
                                    <td>{row.customer}</td>
                                    <td>{row.license}</td>
                                    <td>{row.frame}</td>
                                    <td>{row.engine}</td>
                                    <td>{row.type}</td>
                                    <td>{Number(row.insuredValue).toLocaleString("vi-VN")}</td>
                                    <td>{Number(row.fee).toLocaleString("vi-VN")}</td>
                                    <td>{row.createdAt}</td>
                                    <td>{row.orderStatus}</td>
                                    <td>{row.processor}</td>
                                    <td>{row.handlingStatus}</td>
                                    <td>{row.result}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3">
                <button
                    onClick={exportPDF}
                    className="bg-brand-orange hover:bg-brand-orange-hover text-white px-4 py-1 rounded shadow text-xs">
                    Export PDF
                </button>

                <div className="flex gap-2 text-sm">
                    {totalPages > 0 && (
                        <>
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={`hidden md:flex items-center justify-center w-8 h-8 border rounded ${currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
                            >
                                <ChevronLeft size={14} />
                            </button>

                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 border rounded ${currentPage === page ? "bg-brand-orange hover:bg-brand-orange-hover text-white" : "bg-white"}`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className={`hidden md:flex items-center justify-center w-8 h-8 border rounded ${currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
                            >
                                <ChevronRight size={14} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}