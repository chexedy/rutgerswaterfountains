import { useEffect, useEffectEvent, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import * as basemaps from "@protomaps/basemaps";

import "./Map.css"
import Fountain from "../fountain/Fountain.jsx";
import FountainCard from "../fountaincard";

import { useTheme } from "../../context/ThemeContext";
import { useFountains } from "../../context/FountainContext.jsx";

export default function Map() {
    const { setFountains } = useFountains();
    const { theme } = useTheme();

    const mapContainer = useRef(null);
    const mapRef = useRef(null);

    const [activeFountain, setActiveFountain] = useState(null);

    const loadLayers = () => {
        if (!mapRef.current.getSource('ru-buildings')) {
            mapRef.current.addSource('ru-buildings', {
                type: 'geojson',
                data: '/ru_buildings.geojson'
            });
        }

        if (!mapRef.current.getSource('ru-parking')) {
            mapRef.current.addSource('ru-parking', {
                type: 'geojson',
                data: '/ru_parking.geojson'
            })
        }

        if (!mapRef.current.getLayer('ru-building-outline')) {
            mapRef.current.addLayer({
                id: 'ru-building-outline',
                type: 'line',
                source: 'ru-buildings',
                layout: {},
                paint: {
                    'line-color': '#CD1C18',
                    'line-width': 1
                }
            });
        }

        if (!mapRef.current.getLayer('ru-parking-outline')) {
            mapRef.current.addLayer({
                id: 'ru-parking-outline',
                type: 'line',
                source: 'ru-parking',
                layout: {},
                paint: {
                    'line-color': '#4682B4',
                    'line-width': 1,
                }
            });
        }

        if (!mapRef.current.getLayer('ru-building-labels')) {
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
                    'text-color': theme === "light" ? '#333333' : '#ffffff',
                    'text-halo-color': theme === "light" ? '#ffffff' : '#333333',
                    'text-halo-width': 1
                },
                minzoom: 15
            });
        }

        if (!mapRef.current.getLayer('ru-parking-labels')) {
            mapRef.current.addLayer({
                id: 'ru-parking-labels',
                type: 'symbol',
                source: 'ru-parking',
                layout: {
                    'text-field': ['get', 'Lot_Name'],
                    'text-font': ['Ubuntu Bold'],
                    'text-size': 12,
                    'text-anchor': 'center'
                },
                paint: {
                    'text-color': theme === "light" ? '#333333' : '#ffffff',
                    'text-halo-color': theme === "light" ? '#ffffff' : '#333333',
                    'text-halo-width': 1
                },
                minzoom: 15
            });
        }
    }

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
        setFountains(data.requests);
        data.requests.forEach((fountain) => {
            const marker = document.createElement("div");
            createRoot(marker).render(<Fountain hasBottleReFill={fountain.fountain_type === "refill" ? true : false} isPreview={false} />);
            new maplibregl.Marker({ element: marker })
                .setLngLat([fountain.longitude, fountain.latitude])
                .addTo(mapRef.current);

            marker.addEventListener('click', () => {
                setActiveFountain(fountain);
            });
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
    const [viewMode, setViewMode] = useState(false);
    const [viewModeAdmin, setViewModeAdmin] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.has("selectMode")) {
            setSelectMode(true);
        }
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        const newStyle = {
            version: 8,
            "text-font": ["Ubuntu Regular", "Ubuntu Medium", "Ubuntu Bold", "Ubuntu Light"],
            glyphs: "https://assets.chexedy.com/glyphs/{fontstack}/{range}.pbf",
            sources: {
                protomaps: {
                    type: "vector",
                    url: "pmtiles://https://assets.chexedy.com/whereisnjtransit.pmtiles",
                },
            },
            layers: basemaps.layers(
                "protomaps",
                basemaps.namedFlavor(theme === "light" ? "light" : "dark"),
                { lang: "en" }
            ),
        };

        mapRef.current.setStyle(newStyle);
        mapRef.current.once('styledata', () => loadLayers());
    }, [theme]);

    useEffect(() => {
        if (mapRef.current) return;
        const params = new URLSearchParams(window.location.search);

        const map_style = {
            "version": 8,
            "text-font": ["Ubuntu Regular", "Ubuntu Medium", "Ubuntu Bold", "Ubuntu Light"],
            "glyphs": "https://assets.chexedy.com/glyphs/{fontstack}/{range}.pbf",
            "sources": {
                "protomaps": {
                    "type": "vector",
                    "url": "pmtiles://https://assets.chexedy.com/whereisnjtransit.pmtiles",
                }
            },
            "layers": basemaps.layers(
                "protomaps",
                basemaps.namedFlavor(theme === "light" ? "light" : "dark"),
                { lang: "en" }
            ),
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
            loadLayers();

            if (params.has("viewMode")) {
                setViewMode(true);
                const longitude = parseFloat(params.get("longitude"));
                const latitude = parseFloat(params.get("latitude"));
                const type = params.get("type");

                const marker = document.createElement("div");
                createRoot(marker).render(<Fountain hasBottleReFill={type === "refill" ? true : false} isPreview={true} />);
                new maplibregl.Marker({ element: marker })
                    .setLngLat([longitude, latitude])
                    .addTo(mapRef.current);

                mapRef.current.flyTo({
                    center: [longitude, latitude],
                    zoom: 18,
                    speed: 1.2,
                    curve: 1
                });
            } else if (params.has("viewModeAdmin")) {
                setViewModeAdmin(true);
                const longitude = parseFloat(params.get("longitude"));
                const latitude = parseFloat(params.get("latitude"));
                const type = params.get("type");

                const marker = document.createElement("div");
                createRoot(marker).render(<Fountain hasBottleReFill={type === "refill" ? true : false} isPreview={true} />);
                new maplibregl.Marker({ element: marker })
                    .setLngLat([longitude, latitude])
                    .addTo(mapRef.current);

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
            const fountain_type = params.get("selectMode");
            let marker = document.createElement("div");
            createRoot(marker).render(<Fountain hasBottleReFill={fountain_type === "refill" ? true : false} isPreview={true} />);
            marker = new maplibregl.Marker({ element: marker });

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLngLat = [position.coords.longitude, position.coords.latitude];
                        const bounds = mapRef.current.getMaxBounds();

                        if (bounds && bounds.contains(userLngLat)) {
                            localStorage.setItem("coordinates", JSON.stringify({ longitude: position.coords.longitude, latitude: position.coords.latitude }));
                            marker
                                .setLngLat(userLngLat)
                                .addTo(mapRef.current);
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

            mapRef.current.on("click", (e) => {
                const { lng, lat } = e.lngLat;

                const saved = {};
                saved.longitude = lng;
                saved.latitude = lat;
                localStorage.setItem("coordinates", JSON.stringify(saved));

                if (!marker) {
                    marker.setLngLat([lng, lat]).addTo(mapRef.current);
                } else {
                    marker.setLngLat([lng, lat]).addTo(mapRef.current);
                }
            });
        }
    }, []);

    return (
        <div>
            <div ref={mapContainer} className="mapContainer" />

            {selectMode && (
                <button className="return-to-submit" onClick={() => window.location.href = "/submit"}>
                    Return to Submit
                </button>
            )}

            {viewMode && (
                <button className="return-to-submit" onClick={() => window.location.href = "/profile"}>
                    Return to Profile
                </button>
            )}

            {viewModeAdmin && (
                <button className="return-to-submit" onClick={() => window.location.href = "/admin"}>
                    Return to Admin
                </button>
            )}

            {activeFountain && (
                <FountainCard
                    {...activeFountain}
                    onClose={() => setActiveFountain(null)}
                />
            )}
        </div>
    );
}