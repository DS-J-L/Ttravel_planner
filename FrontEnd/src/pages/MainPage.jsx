import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function MainPage() {
    const navigate = useNavigate();
    const { user, setUser } = useUser();

    const handleLogout = () => {
        setUser(null);         // 사용자 정보 초기화
        navigate("/login");    // 로그인 페이지로 이동
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-300 to-white flex flex-col items-center justify-center">
            <div className="absolute top-4 right-6 flex items-center gap-4 text-lg font-semibold">
                저기어때 – AI 여행 가이드
                {user && (
                    <>
                        <span className="text-black">👤 {user.name}</span>
                        <button
                            onClick={handleLogout}
                            className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                        >
                            로그아웃
                        </button>
                    </>
                )}
            </div>
            <h1 className="text-5xl font-bold mb-4 shadow-sm">
                Welcome to <span className="text-black">저기어때!</span>
            </h1>
            <p className="mb-8 text-lg underline">
                편리한 AI 일정생성으로 저기어때와 여행을 떠나보아요!
            </p>
            <div className="flex gap-6">
                <button
                    className="px-6 py-3 border border-sky-500 rounded-lg hover:bg-sky-100"
                    onClick={() => navigate("/input")}
                >
                    일정 생성 하기
                </button>
                <button
                    className="px-6 py-3 border border-sky-500 rounded-lg hover:bg-sky-100"
                    onClick={() => navigate("/saved")}
                >
                    저장된 일정 불러오기
                </button>
            </div>
        </div>
    );
}