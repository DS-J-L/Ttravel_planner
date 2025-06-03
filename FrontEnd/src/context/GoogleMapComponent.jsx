// src/components/GoogleMapComponent.jsx
import { useEffect, useRef } from "react";

export default function GoogleMapComponent({ places }) {
    const mapRef = useRef(null);

    const getLatLngObj = (location) => ({
        lat: location?.latitude ?? 37.5665,
        lng: location?.longitude ?? 126.9780,
    });

    useEffect(() => {
        if (!places || places.length === 0) return;

        const loadGoogleMaps = () => {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${AIzaSyDAh8X5z5tkUEqhWHu4TJ3jrSvkF67vDO8}`;
            script.async = true;
            script.defer = true;
            script.onload = drawMap;
            document.head.appendChild(script);
        };

        const drawMap = () => {
            const map = new window.google.maps.Map(mapRef.current, {
                center: getLatLngObj(places[0].location),
                zoom: 13,
            });

            places.forEach((place) => {
                const marker = new window.google.maps.Marker({
                    position: getLatLngObj(place.location),
                    map,
                    title: place.name,
                });

                const infoWindow = new window.google.maps.InfoWindow({
                    content: `
                        <div>
                            <strong>${place.name}</strong><br/>
                            Concept: ${place.concept}<br/>
                            Address: ${place.address || "N/A"}
                        </div>
                    `,
                });

                marker.addListener("click", () => {
                    infoWindow.open(map, marker);
                });
            });
        };

        if (!window.google || !window.google.maps) {
            loadGoogleMaps();
        } else {
            drawMap();
        }
    }, [places]);

    return (
        <div
            ref={mapRef}
            style={{ width: "100%", height: "300px" }}
            className="rounded shadow"
        />
    );
}