import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
// import { Protocol } from "pmtiles";
// import * as basemaps from "@protomaps/basemaps";

import "./Map.css"

export default function Map() {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);

    // let protocol = new Protocol();
    // maplibregl.addProtocol("pmtiles", protocol.tile);

    useEffect(() => {
        if (mapRef.current) return;

        // let map_style = {
        //     "version": 8,
        //     "text-font": ["Ubuntu Regular", "Ubuntu Medium", "Ubuntu Bold", "Ubuntu Light"],
        //     "glyphs": "https://map.whereisnjtransit.com/glyphs/{fontstack}/{range}.pbf",
        //     "sprite": "https://protomaps.github.io/basemaps-assets/sprites/v4/light",
        //     "sources": {
        //         "protomaps": {
        //             "type": "vector",
        //             "url": "pmtiles://https://map.whereisnjtransit.com/whereisnjtransit.pmtiles",
        //         }
        //     },
        //     "layers": basemaps.layers("protomaps", basemaps.namedFlavor("light"), { lang: "en" })
        // }

        const bounds = [
            [-74.494514, 40.456166],
            [-74.406796, 40.532459]
        ]

        mapRef.current = new maplibregl.Map({
            container: mapContainer.current,
            center: [-74.450655, 40.4943125],
            style: "https://tiles.openfreemap.org/styles/liberty",
            maxBounds: bounds
        });
    }, []);

    return (<div ref={mapContainer} className="mapContainer" />)
}