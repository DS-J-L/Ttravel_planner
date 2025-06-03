import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleMapComponent from "../components/GoogleMapComponent";


export default function MapVisualize() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const travelPlan = state.travelPlan;
  const userData = state.userData;

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [routeGeoJson, setRouteGeoJson] = useState(null);
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [currentPlaces, setCurrentPlaces] = useState([]);

  if (!travelPlan?.dayplan || travelPlan.dayplan.length === 0) {
    return (
      <div className="p-8">
        <h2>Error</h2>
        <p>No day plans found in the travel plan.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const getLatLngObj = (location) => ({
    lat: location?.latitude ?? 37.5665,
    lng: location?.longitude ?? 126.9780,
});

  const getORSCoords = (list) =>
    list.map((v) => [v.location.longitude, v.location.latitude]);

  useEffect(() => {
    const day = travelPlan.dayplan[selectedDayIndex];
    const places = day?.place_to_visit || [];

    setCurrentPlaces(places);
    setRouteGeoJson(null);

    if (places.length < 2) return;

    setLoadingRoute(true);
    axios
      .post("http://localhost:8000/api/ors_proxy", {
        coordinates: getORSCoords(places),
      })
      .then((res) => setRouteGeoJson(res.data))
      .catch((err) => {
        console.error("Route fetch failed", err);
        setRouteGeoJson(null);
      })
      .finally(() => setLoadingRoute(false));
  }, [selectedDayIndex, travelPlan]);

  const handleRetry = async () => {
    const updatedUserData = {
      ...userData,
      extra_request: feedback,
    };
    navigate("/map_loading", { state: { userInput: updatedUserData } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-white px-6 py-4">
      <div className="text-lg font-semibold mb-4">저기어때 – AI 여행 가이드</div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border border-sky-400 rounded-3xl p-4 h-96 overflow-y-auto">
          <div className="mb-2 font-semibold">일정</div>
          <select
            onChange={(e) => setSelectedDayIndex(Number(e.target.value))}
            value={selectedDayIndex}
            className="border rounded px-2 py-1 mb-2"
          >
            {travelPlan.dayplan.map((day, i) => (
              <option key={i} value={i}>
                Day {i + 1}: {day.date}
              </option>
            ))}
          </select>
          {loadingRoute && <p>Loading route...</p>}
        </div>

        <div className="border border-sky-400 rounded-3xl p-4 h-96">
        <div className="mb-2 font-semibold">지도</div>
          {currentPlaces.length > 0 && (
            <GoogleMapComponent
          places={currentPlaces}
          routeGeoJson={routeGeoJson}
            />
          )}
        </div>
        </div>

      <div className="mb-2 font-semibold">수정 사항</div>
      <textarea
        className="w-full border border-sky-400 rounded-2xl p-3 mb-4"
        rows={3}
        placeholder="수정사항을 입력해주세요."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />

      <div className="flex justify-between">
        <button
          className="border border-sky-500 px-4 py-2 rounded hover:bg-sky-100"
          onClick={() => navigate("/")}
        >
          메인메뉴로 돌아가기
        </button>
        <button
          className="border border-sky-500 px-4 py-2 rounded hover:bg-sky-100"
          onClick={handleSendEmail}
          disabled={!email}
        >
          일정 저장하기
        </button>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-1">피드백 기반 재시도</h3>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!feedback}
          onClick={handleRetry}
        >
          Retry
        </button>
      </div>
    </div>
  );
}
