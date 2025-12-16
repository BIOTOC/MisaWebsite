import { Menu, LayoutGrid, HelpCircle, Bell, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";

export default function Header({ menuOpen, setMenuOpen }) {

    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    function getAvatarText(name) {
        if (!name) return "?";

        const parts = name.trim().split(" ");
        if (parts.length === 1) {
            return parts[0].slice(0, 2).toUpperCase();
        }

        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    function getAvatarColor(name) {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        const hue = Math.abs(hash) % 360;
        return `hsl(${hue}, 65%, 55%)`;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    const avatarText = getAvatarText(user?.staffName);
    const avatarColor = getAvatarColor(avatarText);

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
                            <div
                                className="
                                    h-8 w-8 rounded-full 
                                    flex items-center justify-center
                                    text-white font-semibold text-sm
                                    border border-gray-300
                                    select-none
                                "
                                style={{ backgroundColor: avatarColor }}
                                title={avatarText}
                            >
                                {avatarText}
                            </div>


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