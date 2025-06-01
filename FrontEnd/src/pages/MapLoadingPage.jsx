import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function MapLoading() {
  const location = useLocation();
  const navigate = useNavigate();
  const userInput = location.state?.userInput;

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Starting map generation...");

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setProgress(10);
        setStatus("Fetching POIs...");

        const getPoisRes = await fetch("http://localhost:3000/api/get_pois", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userInput),
        });

        const poisData = await getPoisRes.json();
        const userData = poisData.user_data;

        setProgress(50);
        setStatus("Optimizing route...");

        const routeOptimRes = await fetch("http://localhost:3000/api/route_optim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        const routeData = await routeOptimRes.json();
        const travelPlan = routeData.travel_plan;

        setProgress(100);
        setStatus("Map ready! Redirecting...");

        setTimeout(() => {
          navigate("/map_visualize", {
            state: {
              userData: routeData.user_data,
              travelPlan: travelPlan,
            },
          });
        }, 1000);

      } catch (err) {
        console.error("Failed to fetch data:", err);
        alert("⚠️ Internal server error occurred. Please try again later.");
        navigate("/", { state: { userInput: userInput } });
      }
    };

    fetchMapData();
  }, [userInput, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-white flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-bold mb-2">🗺️ Generating Your Travel Map</h2>
      <p className="mb-6 text-lg">{status}</p>

      <div className="w-full max-w-md bg-gray-200 rounded-full h-5 overflow-hidden">
        <div
          className="bg-green-500 h-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
