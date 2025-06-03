import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SavePage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/list_csv");
        const data = await res.json();
        setFiles(data);
      } catch (err) {
        console.error("Failed to load saved files", err);
      }
    };
    fetchFiles();
  }, []);

  const handleDownload = () => {
    if (!selected) return;
    const link = document.createElement("a");
    link.href = `http://localhost:8000/api/download_csv?filename=${selected}`;
    link.setAttribute("download", selected);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-white px-6 py-4">
      <div className="text-lg font-semibold mb-6">저기어때 – AI 여행 가이드</div>

      <h2 className="text-center text-xl font-bold mb-6">〈저장된 일정 확인하기〉</h2>

      <div className="flex flex-col items-center gap-4 mb-6">
        {files.length > 0 ? (
          files.map((filename, idx) => (
            <button
              key={idx}
              className={`border border-sky-500 px-6 py-2 rounded w-full max-w-xl text-center hover:bg-sky-100 ${
                selected === filename ? "bg-sky-200" : ""
              }`}
              onClick={() => setSelected(filename)}
            >
              {idx + 1}. {filename.replace(".csv", "")}
            </button>
          ))
        ) : (
          <p className="text-center text-gray-600">저장된 일정이 없습니다.</p>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/")}
          className="border border-sky-500 px-4 py-2 rounded hover:bg-sky-100"
        >
          메인메뉴로 돌아가기
        </button>
        <button
          onClick={handleDownload}
          disabled={!selected}
          className="border border-sky-500 px-4 py-2 rounded hover:bg-sky-100 disabled:opacity-50"
        >
          일정 다운로드하기
        </button>
      </div>
    </div>
  );
}
