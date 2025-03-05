"use client"
import dynamic from "next/dynamic";

const Mapbox = dynamic(()=>import ('../Components/Mapbox/Mapbox'), 
  {  
  ssr:false,
  }
);

export default function MapboxWrapper() {
  return <Mapbox />;
}
