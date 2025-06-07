import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleMapComponent from "../components/GoogleMapComponent";
import styles from "./MapVisualize.module.css";

export default function MapVisualize() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const travelPlan = state?.travelPlan;
    const userData = state?.userData;

    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [routeGeoJson, setRouteGeoJson] = useState(null);
    //이메일은 없고 일정저장 const [email, setEmail] = useState("");
    const [feedback, setFeedback] = useState("");
    const [loadingRoute, setLoadingRoute] = useState(false);
    const [currentPlaces, setCurrentPlaces] = useState([]);

    const getLatLngObj = (location) => ({
        lat: location?.latitude ?? 37.5665,
        lng: location?.longitude ?? 126.9780,
    });

    const getORSCoords = (list) =>
        list.map((v) => [v.location.longitude, v.location.latitude]);


    const handleSavePlan = async () => {
        const poiList = currentPlaces.map((place) => ({
            name: place.name,
            latitude: place.location.latitude,
            longitude: place.location.longitude,
        }));

        try {
            await axios.post("http://localhost:8000/api/save_py", {
                poi_list: poiList,
                filename: "my_trip.csv",
            });
            alert("일정이 저장되었습니다.");
        } catch (err) {
            console.error("일정 저장 실패", err);
            alert("저장 실패: 서버 오류");
        }
    };

    useEffect(() => {
        if (!travelPlan?.plans || travelPlan.plans.length === 0) return;

        const day = travelPlan.plans[selectedDayIndex];
        const places = day?.place_to_visit || [];

        setCurrentPlaces(places);
        setRouteGeoJson(null);

        const fetchRoute = async () => {
            if (places.length < 2) return;

            setLoadingRoute(true);
            try {
                const res = await axios.post("http://localhost:8000/api/ors_proxy", {
                    coordinates: getORSCoords(places),
                });
                setRouteGeoJson(res.data);
            } catch (err) {
                console.error("Route fetch failed", err);
                setRouteGeoJson(null);
            } finally {
                setLoadingRoute(false);
            }
        };

        fetchRoute();
    }, [selectedDayIndex, travelPlan]);

    const handleRetry = async () => {
        const updatedUserData = {
            ...userData,
            extra_request: feedback,
        };

        // ⚠️ 임시 경로로 먼저 이동 (리마운트 유도)
        navigate("/temp_reload");

        // 아주 짧은 시간 후 다시 map_loading으로 이동
            setTimeout(() => {
            navigate("/map_loading", {
                state: { userRequest: updatedUserData },
            });
            }, 10);  // 10~100ms 사이면 충분함
    };

    // 조건부 렌더링
    if (!travelPlan?.plans || travelPlan.plans.length === 0) {
        return (
            <div className={styles.errorContainer}>
                <h2>Error</h2>
                <p>No day plans found in the travel plan.</p>
                <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.title}>저기어때 – AI 여행 가이드</div>

            <div className={styles.gridContainer}>
                <div className={styles.scheduleBox}>
                    <div className={styles.sectionTitle}>일정</div>
                    <select
                        onChange={(e) => setSelectedDayIndex(Number(e.target.value))}
                        value={selectedDayIndex}
                        className={styles.daySelect}
                    >
                        {travelPlan.plans.map((day, i) => (
                            <option key={i} value={i}>
                                Day {i + 1}: {day.date}
                            </option>
                        ))}
                    </select>
                    {loadingRoute && <p>Loading route...</p>}
                </div>

                <div className={styles.mapBox}>
                    <div className={styles.sectionTitle}>지도</div>
                    {currentPlaces.length > 0 && (
                        <GoogleMapComponent
                            places={currentPlaces}
                            routeGeoJson={routeGeoJson}
                        />
                    )}
                </div>
            </div>

            <div className={styles.sectionTitle}>수정 사항</div>
            <textarea
                className={styles.feedbackBox}
                rows={3}
                placeholder="수정사항을 입력해주세요."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
            />

            <div className={styles.buttonRow}>
                <button className={styles.navButton} onClick={() => navigate("/")}>
                    메인메뉴로 돌아가기
                </button>
                <button className={styles.navButton} onClick={handleSavePlan}>
                    일정 저장하기
                </button>
            </div>

            <div className={styles.retrySection}>
                <h3 className={styles.retryTitle}>피드백 기반 재시도</h3>
                <button
                    className={styles.retryButton}
                    disabled={!feedback}
                    onClick={handleRetry}
                >
                    Retry
                </button>
            </div>
        </div>
    );
}