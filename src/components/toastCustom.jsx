import React from "react";
import toast from "react-hot-toast";

export const showToast = (type, message) => {
    toast.custom(
        (t) => (
            <div
                className={`
                    ${t.visible ? "animate-enter" : "animate-leave"}
                    max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 flex
                    ${type === "success" ? "bg-green-600 text-white" : ""}
                    ${type === "error" ? "bg-red-600 text-white" : ""}
                    ${type === "warning" ? "bg-yellow-500 text-white" : ""}
                    ${type === "info" ? "bg-blue-600 text-white" : ""}
                `}
            >
                <div className="flex-1 w-0 p-4">
                    <p className="text-sm font-semibold tracking-wide">
                        {type.toUpperCase()}
                    </p>

                    <p className="mt-1 text-sm opacity-90">
                        {message}
                    </p>
                </div>

                <div className="flex border-l border-white/30">
                    <button
                        onClick={() => toast.remove(t.id)}
                        className="w-full rounded-none rounded-r-lg p-4 flex items-center justify-center 
                            text-sm font-medium text-white hover:bg-black/20"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        ),
        { duration: 2000 } 
    );
};