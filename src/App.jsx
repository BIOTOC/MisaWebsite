import React, { useState, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Breadcrumb from "./components/Breadcrumb";
import { Toaster } from "react-hot-toast";

const CarMaterial = React.lazy(() => import("./pages/CarMaterial"));
import CarMaterialDetail from "./pages/CarMaterialDetail";
import CarMaterialEdit from "./pages/CarMaterialEdit";
import CarInspectionHistory from "./pages/CarInspectionHistory";
import Login from "./pages/Login";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  // Mapping breadcrumbs theo URL
  const getBreadcrumbItems = () => {
    const path = location.pathname;

    if (path.startsWith("/car-material")) {
      const parts = path.split("/").filter(Boolean);

      if (parts.length === 1) return ["Thẩm định dịch vụ", "Vật chất xe ô tô"];

      if (parts.length === 2) return ["Thẩm định dịch vụ", "Vật chất xe ô tô", "Chi tiết thẩm định dịch vụ"];

      if (parts.length === 3 && parts[2] === "edit")
        return ["Thẩm định dịch vụ", "Vật chất xe ô tô", "Chi tiết thẩm định dịch vụ"];

      if (parts.length === 3 && parts[2] === "history")
        return ["Thẩm định dịch vụ", "Vật chất xe ô tô", "Chi tiết thẩm định dịch vụ", "Lịch sử thẩm định"];

      return ["Thẩm định dịch vụ", "Vật chất xe ô tô"];
    }

    return [];
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">

      {!isLoginPage && (
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      )}

      {!isLoginPage && breadcrumbItems.length > 0 && (
        <div className="fixed top-[60px] left-0 md:left-56 right-0 bg-white z-30 px-4 py-2">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">

        {!isLoginPage && (
          <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        )}

        <div
          className={`flex-1 overflow-x-hidden ${!isLoginPage ? "p-4 mt-[100px] md:ml-56" : ""
            }`}
        >
          <Suspense fallback={<div>Đang tải...</div>}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/car-material" element={<CarMaterial />} />
              <Route path="/car-material/:id" element={<CarMaterialDetail />} />
              <Route path="/car-material/:id/edit" element={<CarMaterialEdit />} />
              <Route path="/car-material/:id/history" element={<CarInspectionHistory />} />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </div>
      </div>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
