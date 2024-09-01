// "use client";
// import { ReactNode, useEffect, useState, useCallback } from "react";
// import "./globals.css";
// import {
//   AdvancedMarker,
//   APIProvider,
//   Map,
//   Pin,
//   useMap,
// } from "@vis.gl/react-google-maps";

// type Poi = { key: string; location: google.maps.LatLngLiteral };

// const initialLocations: Poi[] = [];

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body>
//         <APIProvider
//           apiKey={"AIzaSyAERpuLNoqLOK9Kp02Qi7WkX3n6uFM9ezA"}
//           onLoad={() => {
//             console.log("API Loaded");
//           }}
//         >
//           <Map
//             className="w-screen h-[80vh]"
//             defaultZoom={13}
//             defaultCenter={{ lat: 47.919999, lng: 106.917999 }}
//             mapId="DEMO_MAP_ID"
//           >
//             <PoiMarkers />
//           </Map>
//         </APIProvider>
//       </body>
//     </html>
//   );
// }

// const PoiMarkers = () => {
//   const [locations, setLocations] = useState<Poi[]>(initialLocations);
//   const [distance, setDistance] = useState<string | null>(null);
//   const map = useMap();

//   useEffect(() => {
//     if (map) {
//       const listener = map.addListener(
//         "click",
//         (ev: google.maps.MapMouseEvent) => {
//           if (!ev.latLng) return;

//           const newLocation: Poi = {
//             key: `poi${locations.length + 1}`,
//             location: ev.latLng.toJSON(),
//           };

//           setLocations([...locations, newLocation]);
//           console.log("New marker added at:", ev.latLng.toString());
//         }
//       );

//       return () => {
//         google.maps.event.removeListener(listener);
//       };
//     }
//   }, [map, locations]);

//   // Function to calculate the route distance
//   const calculateRouteDistance = useCallback(() => {
//     if (locations.length < 2) return;

//     const directionsService = new google.maps.DirectionsService();

//     directionsService.route(
//       {
//         origin: locations[0].location,
//         destination: locations[1].location,
//         travelMode: google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === google.maps.DirectionsStatus.OK && result) {
//           const route = result.routes[0];
//           if (route && route.legs.length > 0) {
//             const distance = route.legs[0].distance?.text;
//             if (distance) {
//               setDistance(distance);
//               console.log("Distance from A to B:", distance);
//             } else {
//               console.error("Distance not found in route legs.");
//             }
//           } else {
//             console.error("Route or route legs not found in result.");
//           }
//         } else {
//           console.error("Directions request failed due to", status);
//         }
//       }
//     );
//   }, [locations]);

//   useEffect(() => {
//     calculateRouteDistance();
//   }, [locations, calculateRouteDistance]);

//   return (
//     <>
//       {locations.map((poi: Poi) => (
//         <AdvancedMarker key={poi.key} position={poi.location} clickable={true}>
//           <Pin
//             background={"#FBBC04"}
//             glyphColor={"#000"}
//             borderColor={"#000"}
//           />
//         </AdvancedMarker>
//       ))}
//       {distance && <div>Distance from A to B: {distance}</div>}
//     </>
//   );
// };
