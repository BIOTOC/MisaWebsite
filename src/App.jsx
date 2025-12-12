import React, { useState, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
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

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">

      {!isLoginPage && (
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      )}

      <div className="flex flex-1 overflow-hidden">

        {!isLoginPage && (
          <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        )}

        <div className={`flex-1 overflow-x-hidden ${!isLoginPage ? "p-4 mt-[60px] md:ml-56" : ""
          }`}>

          <Suspense fallback={<div>Đang tải...</div>}>

            <Routes>
              {/* === LOGIN PAGE === */}
              <Route path="/login" element={<Login />} />

              {/* === MAIN PAGES === */}
              <Route path="/car-material" element={<CarMaterial />} />
              <Route path="/car-material/:id" element={<CarMaterialDetail />} />
              <Route path="/car-material/:id/edit" element={<CarMaterialEdit />} />
              <Route path="/car-material/:id/history" element={<CarInspectionHistory />} />

              {/* Đường dẫn mặc định → tự chuyển về login nếu chưa login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>

          </Suspense>

        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
