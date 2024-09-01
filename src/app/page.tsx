"use client";

import { Map } from "@vis.gl/react-google-maps";
import { PoiMarkers } from "./layout";

export default function Home() {
  return (
    <main className="flex justify-center items-center w-screen h-screen">
      <Map
        className="w-[80vw] h-[80vh]"
        defaultZoom={13}
        defaultCenter={{ lat: 47.919999, lng: 106.917999 }}
        mapId="DEMO_MAP_ID"
      >
        <PoiMarkers />
      </Map>
    </main>
  );
}
