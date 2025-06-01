import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserData } from "../components/user_data";

export default function InputForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedTheme = location.state?.selectedTheme || "";

  const [form, setForm] = useState({
    name: "",
    region: "",
    date: "",
    theme: selectedTheme,
    people: 1,
    budget: 0,
    location: "",
    durationStart: "",
    durationEnd: "",
    companions: "",
    concept: "",
    extra_request: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = new UserData();
    userData.name = form.name;
    userData.region = form.region;
    userData.date = form.date;
    userData.theme = form.theme;
    userData.people = form.people;
    userData.budget = form.budget;
    userData.location = form.location;
    userData.duration = {
      start: form.durationStart,
      end: form.durationEnd,
    };
    userData.companions = form.companions;
    userData.concept = form.concept;
    userData.extra_request = form.extra_request;

    navigate("/result", { state: { userInput: userData.toJSON() } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-white flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 w-full max-w-lg space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">여행 정보 입력</h2>

        {[
          { label: "이름", name: "name", type: "text" },
          { label: "지역", name: "region", type: "text" },
          { label: "날짜", name: "date", type: "date" },
          { label: "인원수", name: "people", type: "number" },
          { label: "예산", name: "budget", type: "number" },
          { label: "테마", name: "theme", type: "text" },
          { label: "여행 위치", name: "location", type: "text" },
          { label: "시작일", name: "durationStart", type: "date" },
          { label: "종료일", name: "durationEnd", type: "date" },
          { label: "동행자", name: "companions", type: "text" },
          { label: "여행 컨셉", name: "concept", type: "text" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block font-medium mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>
        ))}

        <div>
          <label className="block font-medium mb-1">추가 요청사항</label>
          <textarea
            name="extra_request"
            value={form.extra_request}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-4"
        >
          다음
        </button>
      </form>
    </div>
  );
}
