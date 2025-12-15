import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react";
import { login } from "../services/authService";

export default function Login() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const passwordInputRef = useRef(null);

    const [username, setUsername] = useState("");
    const [ma_dvi, setMaDvi] = useState("");
    const [error, setError] = useState("");

    // ==== NEW INPUT REFS ====
    const maDviRef = useRef(null);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const handleLogin = async () => {
        setError("");

        if (!ma_dvi || !username || !password) {
            setError("Vui lòng nhập đầy đủ mã đơn vị, tên đăng nhập và mật khẩu.");
            return;
        }

        const result = await login(username, password, ma_dvi);

        if (!result) {
            setError("Tên đăng nhập hoặc mật khẩu không đúng.");
            return;
        }

        localStorage.setItem("user", JSON.stringify(result));
        navigate("/car-material");
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
        passwordInputRef.current?.focus();
    };

    return (
        <div className="w-full h-screen flex flex-col md:flex-row bg-white">

            {/* LEFT FORM */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-32 py-10">
                <h1 className="text-3xl font-semibold text-center mb-2">Đăng nhập</h1>
                <p className="text-center text-gray-500 mb-5">
                    Hệ thống quản lý tập trung của hệ sinh thái BSH
                </p>

                {/* Error message */}
                {error && (
                    <div className="w-full flex justify-center mb-2">
                        <p className="text-red-500 text-sm mt-1 text-center">
                            {error}
                        </p>
                    </div>
                )}

                <div className="flex flex-col gap-4">

                    {/* Mã đơn vị */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Mã đơn vị</label>
                        <input
                            ref={maDviRef}
                            type="text"
                            value={ma_dvi}
                            onChange={(e) => setMaDvi(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") usernameRef.current?.focus();
                            }}
                            placeholder="Nhập mã đơn vị"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-brand-orange"
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
                        <input
                            ref={usernameRef}
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") passwordRef.current?.focus();
                            }}
                            placeholder="Nhập tên đăng nhập"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-brand-orange"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                        <div className="relative flex items-center">
                            <input
                                ref={passwordRef}
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleLogin();
                                }}
                                placeholder="Nhập mật khẩu"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 outline-brand-orange"
                            />

                            <button
                                type="button"
                                onClick={toggleShowPassword}
                                className="absolute right-3 h-full flex items-center justify-center text-gray-600 hover:text-gray-800"
                            >
                                {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Login button */}
                    <button
                        className="bg-brand-orange hover:bg-brand-orange-hover text-white font-medium py-2 rounded-lg mt-5"
                        onClick={handleLogin}
                    >
                        Đăng nhập
                    </button>

                </div>

                <div className="text-center text-gray-400 text-xs mt-10">
                    <span className="inline-flex items-center justify-center gap-1">
                        Liên hệ hỗ trợ Hotline: 18006085
                    </span>
                </div>
            </div>

            {/* RIGHT IMAGE AREA */}
            <div className="hidden md:flex w-1/2 relative items-center justify-center">
                <div className="relative z-10 text-center">
                    <img
                        src="/login-side-image.png"
                        alt="BSH Login Side"
                        className="w-[580px] mx-auto"
                    />
                </div>
            </div>
        </div>
    );
}