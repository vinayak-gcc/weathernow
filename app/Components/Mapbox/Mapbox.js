export const dynamic = 'force-dynamic'

import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useGlobalContext } from "@/app/context/globalContext";
import { Skeleton } from "@/components/ui/skeleton";

function FlyToActiveCity({ activeCityCords }) {
  const map = useMap();

  useEffect(() => {
    if (activeCityCords) {
      const zoomLev = 11;
      const flyToOptions = {
        duration: .5,
      };

      map.flyTo(
        [activeCityCords.lat, activeCityCords.lon],
        zoomLev,
        flyToOptions
      );
    }
  }, [activeCityCords, map]);

  return null;
}

function Mapbox() {
  const { forecast } = useGlobalContext(); // Your coordinates

  const activeCityCords = forecast?.coord;

  if (!forecast || !forecast.coord ) {
    return (
    <Skeleton className="h-[20rem] w-full md:w-[21.5rem]"></Skeleton>
    );
  }

  return (
    <div className="flex-1 basis-[50%] h-[24rem] border rounded-lg">
      <MapContainer
        center={[activeCityCords.lat, activeCityCords.lon]}
        zoom={44}
        scrollWheelZoom={false}
        className="rounded-lg m-4"
        style={{ height: "100% ", width: "100% " }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <FlyToActiveCity activeCityCords={activeCityCords} />
      </MapContainer>
    </div>
  );
}

export default Mapbox;
