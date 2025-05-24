"use client";

import { useEffect, useRef } from "react";

export default function LeafletMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Only initialize if we haven't already and if we're in the browser
    if (
      typeof window !== "undefined" &&
      mapRef.current &&
      !mapInstanceRef.current
    ) {
      // Dynamically import Leaflet to avoid SSR issues
      import("leaflet")
        .then((L) => {
          // Fix for default markers in Leaflet with webpack
          delete L.Icon.Default.prototype._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
            iconUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
            shadowUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          });

          try {
            // Initialize the map with your office location
            // Coordinates: 8°30'54.7"N 4°35'22.3"E
            const map = L.map(mapRef.current).setView([8.515194, 4.589528], 15);

            // Add OpenStreetMap tiles
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution:
                '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

            // Add a marker at your office location
            L.marker([8.515194, 4.589528])
              .addTo(map)
              .bindPopup("Our Office Location<br>8°30'54.7\"N 4°35'22.3\"E")
              .openPopup();

            mapInstanceRef.current = map;
            console.log("Leaflet map initialized successfully");
          } catch (error) {
            console.error("Error initializing Leaflet map:", error);
          }
        })
        .catch((error) => {
          console.error("Error loading Leaflet:", error);
        });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      {/* Custom CSS to fix z-index issues */}
      <style jsx>{`
        .leaflet-map-container {
          z-index: 1 !important;
        }
        .leaflet-map-container .leaflet-control-container {
          z-index: 10 !important;
        }
        .leaflet-map-container .leaflet-popup {
          z-index: 20 !important;
        }
        .leaflet-map-container .leaflet-tooltip {
          z-index: 15 !important;
        }
      `}</style>
      <div
        ref={mapRef}
        className="leaflet-map-container"
        style={{
          width: "100%",
          height: "100%",
          border: "1px solid #ccc",
          borderRadius: "0.5rem",
          minHeight: "400px",
          zIndex: 1,
          position: "relative",
        }}
      ></div>
    </>
  );
}
