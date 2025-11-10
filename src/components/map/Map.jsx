import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import * as basemaps from "@protomaps/basemaps";

import "./Map.css"
import Fountain from "../fountain";
import { useTheme } from "../../context/ThemeContext";

export default function Map() {
    const { theme } = useTheme();
    const mapContainer = useRef(null);
    const mapRef = useRef(null);

    const ZoomToUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLngLat = [position.coords.longitude, position.coords.latitude];
                    const bounds = mapRef.current.getMaxBounds();

                    if (bounds && bounds.contains(userLngLat)) {
                        mapRef.current.flyTo({
                            center: userLngLat,
                            zoom: 16,
                            speed: 1.2,
                            curve: 1
                        });
                    } else {
                        console.log('User location is out of map bounds.');
                    }
                },
                (error) => {
                    console.error('Error getting user location:', error);
                },
                {
                    enableHighAccuracy: true
                }
            );
        }
    }

    const loadFountains = async () => {
        const response = await fetch("https://ruwaterfountains-api.ayaan7m.workers.dev/fountains", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            alert("Failed to fetch fountain data, try refreshing. If the error persists, contact me on Github.");
            return;
        }

        const data = await response.json();
        console.log(data);
        data.requests.forEach((fountain) => {
            const marker = document.createElement("div");
            createRoot(marker).render(<Fountain hasBottleReFill={fountain.fountain_type === "refill" ? true : false} theme={theme} />);
            new maplibregl.Marker({ element: marker })
                .setLngLat([fountain.longitude, fountain.latitude])
                .addTo(mapRef.current);
        });
    }

    useEffect(() => {
        let protocol = new Protocol();
        maplibregl.addProtocol("pmtiles", protocol.tile);
        return () => {
            maplibregl.removeProtocol("pmtiles");
        }
    }, []);

    const [selectMode, setSelectMode] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.has("selectMode")) {
            setSelectMode(true);
        }
    }, []);

    useEffect(() => {
        if (mapRef.current) return;
        const params = new URLSearchParams(window.location.search);

        const map_style = {
            "version": 8,
            "text-font": ["Ubuntu Regular", "Ubuntu Medium", "Ubuntu Bold", "Ubuntu Light"],
            "glyphs": "https://map.whereisnjtransit.com/glyphs/{fontstack}/{range}.pbf",
            "sources": {
                "protomaps": {
                    "type": "vector",
                    "url": "pmtiles://https://map.whereisnjtransit.com/whereisnjtransit.pmtiles",
                }
            },
            "layers": basemaps.layers("protomaps", basemaps.namedFlavor("light"), { lang: "en" })
        }

        const bounds = [
            [-74.494514, 40.456166],
            [-74.406796, 40.532459]
        ]

        mapRef.current = new maplibregl.Map({
            container: mapContainer.current,
            center: [-74.450655, 40.4943125],
            style: map_style,
            maxBounds: bounds,
            attributionControl: false,
        });

        mapRef.current.on('load', function () {
            mapRef.current.addSource('ru-buildings', {
                type: 'geojson',
                data: '/ru_buildings.geojson'
            });

            mapRef.current.addLayer({
                id: 'ru-building-outline',
                type: 'line',
                source: 'ru-buildings',
                layout: {},
                paint: {
                    'line-color': '#333333',
                    'line-width': 1
                }
            });

            mapRef.current.addLayer({
                id: 'ru-building-labels',
                type: 'symbol',
                source: 'ru-buildings',
                layout: {
                    'text-field': ['get', 'BldgName'],
                    'text-font': ['Ubuntu Bold'],
                    'text-size': 12,
                    'text-anchor': 'center'
                },
                paint: {
                    'text-color': '#333333',
                    'text-halo-color': '#ffffff',
                    'text-halo-width': 1
                },
                minzoom: 15
            });

            if (params.has("viewMode")) {
                const longitude = parseFloat(params.get("longitude"));
                const latitude = parseFloat(params.get("latitude"));
                const type = params.get("type");

                const marker = document.createElement("div");
                createRoot(marker).render(<Fountain hasBottleReFill={type === "refill" ? true : false} theme={theme} />);
                new maplibregl.Marker({ element: marker })
                    .setLngLat([longitude, latitude])
                    .addTo(mapRef.current);

                marker.addEventListener('click', () => {
                    marker.remove();
                });

                mapRef.current.flyTo({
                    center: [longitude, latitude],
                    zoom: 18,
                    speed: 1.2,
                    curve: 1
                });
            } else {
                loadFountains();
                mapRef.current.addControl(
                    new maplibregl.GeolocateControl({
                        positionOptions: {
                            enableHighAccuracy: true
                        },
                        trackUserLocation: true
                    }),
                    'bottom-right'
                );
                ZoomToUserLocation();
            }
        });

        if (params.has("selectMode")) {
            let marker = null;
            mapRef.current.on("click", (e) => {
                const { lng, lat } = e.lngLat;

                const saved = JSON.parse(localStorage.getItem("currentSubmission")) || {};
                saved.longitude = lng;
                saved.latitude = lat;
                localStorage.setItem("currentSubmission", JSON.stringify(saved));

                if (!marker) {
                    marker = new maplibregl.Marker({ color: "red" })
                        .setLngLat([lng, lat])
                        .addTo(mapRef.current);
                } else {
                    marker.setLngLat([lng, lat]);
                }
            });
        }
    }, []);

    // useEffect(() => {
    //     const map_style = mapRef.current.getStyle();
    //     console.log(map_style);
    //     if (theme === "dark") {
    //         map_style.layers = basemaps.layers("protomaps", basemaps.namedFlavor("dark"), { lang: "en" });
    //     } else {
    //         map_style.layers = basemaps.layers("protomaps", basemaps.namedFlavor("light"), { lang: "en" });
    //     }
    //     mapRef.current.setStyle(map_style);
    // }, [theme]);

    return (
        <div>
            <div ref={mapContainer} className="mapContainer" />

            {selectMode && (
                <button className="return-to-submit" onClick={() => window.location.href = "/submit"}>
                    Return to Submit
                </button>
            )}
        </div>
    );
}