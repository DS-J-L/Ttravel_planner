import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (result.success) {
                console.log("register success!");
                navigate("/login");
            } else {
                setMessage(result.message || "회원가입 실패");
            }
        } catch (error) {
            console.error("Register error:", error);
            setMessage("서버 오류. 잠시 후 다시 시도해주세요.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-300 to-white flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-md w-80 space-y-4"
            >
                <h2 className="text-2xl font-bold text-center">회원가입</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="이메일"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />

                <button
                    type="submit"
                    className="w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600"
                >
                    회원가입
                </button>

                {message && (
                    <div className="text-red-500 text-sm text-center">{message}</div>
                )}

                <div className="text-sm text-center">
                    이미 계정이 있으신가요?{" "}
                    <span
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
                        로그인
                    </span>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;