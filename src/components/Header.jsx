import { Menu, LayoutGrid, HelpCircle, Bell, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";

export default function Header({ menuOpen, setMenuOpen }) {

    var image = "data:image/png;base64,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";
    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setAvatarMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            {/* HEADER */}
            <div className="fixed top-0 left-0 right-0 h-[55px] bg-white shadow z-[999] flex items-center justify-between px-4">

                {/* <button
                    className="md:hidden"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <Menu size={28} />
                </button> */}

                <div className="flex items-center gap-2">
                    <img
                        src="/logo-bsh.png"
                        alt="BSH"
                        className="h-7 object-contain"
                    />
                </div>

                <div className="flex items-center gap-5 text-gray-500">
                    <button>
                        <LayoutGrid size={28} className="text-brand-orange" fill="currentColor" />
                    </button>

                    <div className="w-[1.5px] h-10 bg-gray-300 hidden md:block" />

                    <button>
                        <HelpCircle size={24} />
                    </button>

                    <button>
                        <Bell size={24} fill="currentColor" />
                    </button>

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                            className="focus:outline-none"
                        >
                            <img
                                src={image}
                                className="h-8 w-8 rounded-full object-cover border-2 border-gray-400"
                                alt="User Avatar"
                            />
                        </button>

                        {/* Dropdown menu */}
                        <div
                            className={`
                                absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg z-50 
                                transition-all duration-200 origin-top
                                ${avatarMenuOpen
                                    ? "scale-100 opacity-100 pointer-events-auto"
                                    : "scale-95 opacity-0 pointer-events-none"
                                }
                            `}
                        >

                            <button
                                className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-5 w-5 text-brand-orange" />

                                Đăng xuất
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* FLOATING BUTTON — MOBILE */}
            {!menuOpen && (
                <button
                    onClick={() => setMenuOpen(true)}
                    className="
                    md:hidden
                    fixed top-[65px] left-3
                    w-10 h-10
                  bg-white 
                  text-gray-700
                    rounded-full 
                    shadow-md
                    border border-gray-300
                    flex items-center justify-center
                    z-[999]
                    "
                >
                    <Menu size={21} />
                </button>
            )}


        </>
    );
}