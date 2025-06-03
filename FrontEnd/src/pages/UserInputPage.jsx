import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserData } from "../components/user_data";
import styles from "./InputForm.module.css";

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
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>여행 정보 입력</h2>

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
          <div key={name} className={styles.inputGroup}>
            <label className={styles.label}>{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
        ))}

        <div className={styles.inputGroup}>
          <label className={styles.label}>추가 요청사항</label>
          <textarea
            name="extra_request"
            value={form.extra_request}
            onChange={handleChange}
            className={styles.textarea}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          다음
        </button>
      </form>
    </div>
  );
}