"use client";
import { ReactNode, useCallback, useEffect, useState } from "react";
import "./globals.css";
import {
  AdvancedMarker,
  APIProvider,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
type Poi = { key: string; location: google.maps.LatLngLiteral };
const api = "AIzaSyAERpuLNoqLOK9Kp02Qi7WkX3n6uFM9ezA";
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <APIProvider
          apiKey={api}
          onLoad={() => {
            console.log("API Running");
          }}
        >
          {children}
        </APIProvider>
      </body>
    </html>
  );
}
export const PoiMarkers = () => {
  const [locations, setLocations] = useState<Poi[]>([]);
  const [distance, setDistance] = useState<string | null>(null);
  const [radius, setRadius] = useState<string | null>(null);
  const [diameter, setDiameter] = useState<string | null>(null);
  const map = useMap();

  useEffect(() => {
    if (map) {
      const listener = map.addListener(
        "click",
        (ev: google.maps.MapMouseEvent) => {
          if (!ev.latLng) return;
          const newLocation: Poi = {
            key: `poi-${Date.now()}`,
            location: ev.latLng.toJSON(),
          };
          setLocations((prevLocations) => {
            const updatedLocations = [...prevLocations, newLocation];
            if (updatedLocations.length > 2) {
              updatedLocations.shift();
            }
            return updatedLocations;
          });
        }
      );
      return () => {
        google.maps.event.removeListener(listener);
      };
    }
  }, [map]);

  const calculateRouteMetrics = useCallback(() => {
    if (locations.length < 2) return;
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: locations[0].location,
        destination: locations[1].location,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          const route = result.routes[0];
          if (route && route.legs.length > 0) {
            const distanceText = route.legs[0].distance?.text;
            console.log("text", distanceText);
            const distanceValue = route.legs[0].distance?.value;
            console.log("value", distanceValue);
            if (distanceValue) {
              const diameterValue = distanceValue;
              const radiusValue = diameterValue / 2;
              setDistance(distanceText || null);
              setRadius(`${(radiusValue / 1000).toFixed(2)} km`);
              setDiameter(`${(diameterValue / 1000).toFixed(2)} km`);
            } else {
              console.error("Distance not found.");
            }
          } else {
            console.error("Route not found in result.");
          }
        } else {
          console.error("Directions request failed ", status);
        }
      }
    );
  }, [locations]);

  useEffect(() => {
    calculateRouteMetrics();
  }, [locations, calculateRouteMetrics]);
  return (
    <>
      {locations.map((poi: Poi) => (
        <AdvancedMarker key={poi.key} position={poi.location}>
          <Pin
            background={"#FBBC04"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker>
      ))}
      {distance && (
        <div>
          <p>Замын урт: {distance}</p>
          <p>Радиус: {radius}</p>
          <p>Диаметер: {diameter}</p>
        </div>
      )}
    </>
  );
};
