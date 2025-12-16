import React, { useState, Suspense, useRef, useLayoutEffect } from "react";
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

  // ===== Breadcrumb height handling =====
  const breadcrumbRef = useRef(null);
  const [breadcrumbHeight, setBreadcrumbHeight] = useState(0);

  // Mapping breadcrumbs theo URL
  const getBreadcrumbItems = () => {
    const path = location.pathname;

    if (path.startsWith("/car-material")) {
      const parts = path.split("/").filter(Boolean);

      if (parts.length === 1)
        return ["Thẩm định dịch vụ", "Vật chất xe ô tô"];

      if (parts.length === 2)
        return [
          "Thẩm định dịch vụ",
          "Vật chất xe ô tô",
          "Chi tiết thẩm định dịch vụ",
        ];

      if (parts.length === 3 && parts[2] === "edit")
        return [
          "Thẩm định dịch vụ",
          "Vật chất xe ô tô",
          "Chi tiết thẩm định dịch vụ",
        ];

      if (parts.length === 3 && parts[2] === "history")
        return [
          "Thẩm định dịch vụ",
          "Vật chất xe ô tô",
          "Chi tiết thẩm định dịch vụ",
          "Lịch sử thẩm định",
        ];

      return ["Thẩm định dịch vụ", "Vật chất xe ô tô"];
    }

    return [];
  };

  const breadcrumbItems = getBreadcrumbItems();

  // ===== THEO DÕI THAY ĐỔI KÍCH THƯỚC BREADCRUMB =====
  useLayoutEffect(() => {
    if (!breadcrumbRef.current) return;

    const updateHeight = () => {
      setBreadcrumbHeight(breadcrumbRef.current.offsetHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(breadcrumbRef.current);

    return () => observer.disconnect();
  }, [breadcrumbItems]);

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      {/* ===== HEADER ===== */}
      {!isLoginPage && (
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      )}

      {/* ===== BREADCRUMB ===== */}
      {!isLoginPage && breadcrumbItems.length > 0 && (
        <div
          ref={breadcrumbRef}
          className="fixed top-[60px] left-0 md:left-56 right-0 bg-white z-30 px-4 py-2"
        >
          <Breadcrumb items={breadcrumbItems} />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* ===== SIDEBAR ===== */}
        {!isLoginPage && (
          <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        )}

        {/* ===== MAIN CONTENT ===== */}
        <div
          className={`flex-1 overflow-x-hidden p-4 ${
            !isLoginPage ? "md:ml-56" : ""
          }`}
          style={{
            marginTop: !isLoginPage ? 60 + breadcrumbHeight : 0,
          }}
        >
          <Suspense fallback={null}>

            <Routes>

              <Route path="/login" element={<Login />} />
     
              <Route path="/car-material" element={<CarMaterial />} />
              <Route
                path="/car-material/:id"
                element={<CarMaterialDetail />}
              />
              <Route
                path="/car-material/:id/edit"
                element={<CarMaterialEdit />}
              />
              <Route
                path="/car-material/:id/history"
                element={<CarInspectionHistory />}
              />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>

          </Suspense>

        </div>
      </div>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
