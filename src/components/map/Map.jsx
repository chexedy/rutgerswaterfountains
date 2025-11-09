import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import * as basemaps from "@protomaps/basemaps";

import "./Map.css"

export default function Map() {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);

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

        let map_style = {
            "version": 8,
            "text-font": ["Ubuntu Regular", "Ubuntu Medium", "Ubuntu Bold", "Ubuntu Light"],
            "glyphs": "https://map.whereisnjtransit.com/glyphs/{fontstack}/{range}.pbf",
            "sprite": "https://protomaps.github.io/basemaps-assets/sprites/v4/light",
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
            maxBounds: bounds
        });

        mapRef.current.on('load', function () {
            mapRef.current.addSource('ru-buildings', {
                type: 'geojson',
                data: '/src/util/ru_buildings.geojson'
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
        });

        const params = new URLSearchParams(window.location.search);

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