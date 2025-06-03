import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (result.success) {
                console.log("Logged in as user_id:", result.user_id);
                navigate("/user_submit", { state: { userId: result.user_id } });
            } else {
                setMessage(result.message || "로그인 실패");
            }
        } catch (error) {
            console.error("Login error:", error);
            setMessage("서버 오류. 잠시 후 다시 시도해주세요.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-300 to-white flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-md w-80 space-y-4"
            >
                <h2 className="text-2xl font-bold text-center">로그인</h2>

                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600"
                >
                    로그인
                </button>

                {message && (
                    <div className="text-red-500 text-sm text-center">{message}</div>
                )}

                <div className="text-sm text-center">
                    계정이 없으신가요?{" "}
                    <span
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={() => navigate("/register")}
                    >
                        회원가입
                    </span>
                </div>
            </form>
        </div>
    );
}                      