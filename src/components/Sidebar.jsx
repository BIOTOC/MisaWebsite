//Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Sidebar({ menuOpen, setMenuOpen }) {
  const location = useLocation();

  const [submenuOpen, setSubmenuOpen] = useState(true);

  const menuItems = [
    { name: "Vật chất xe ô tô", path: "/car-material" },
  ];

  return (
    <>
      {/* --- OVERLAY MOBILE --- */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-50"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <div
        className={`
          fixed top-[60px] left-0 
          h-[calc(100vh-55px)] 
          bg-white shadow-lg p-3 text-base 
          w-56 z-[999] transition-transform duration-300
          rounded-r-2xl overflow-hidden
          md:translate-x-0     
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="space-y-2">
          {/* --- SUBMENU HEADER --- */}
          <button
            onClick={() => setSubmenuOpen(!submenuOpen)}
            className="w-full text-left px-2 py-2 rounded hover:bg-gray-200 
                       flex justify-between items-center"
          >
            <span>Thẩm định dịch vụ</span>
            <span>{submenuOpen ? "▲" : "▼"}</span>
          </button>

          {/* --- MENU ITEMS --- */}
          {submenuOpen && (
            <div className="ml-3 mt-1 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 768) setMenuOpen(false);
                  }}
                  // location.pathname === item.path
                  className={`block w-full px-2 py-1 rounded hover:bg-gray-200
                    ${location.pathname.startsWith(item.path)
                      ? "bg-orange-100 text-orange-500 font-semibold"
                      : ""
                    }
                  `}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
