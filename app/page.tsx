"use client";
import AirPollution from "./Components/AirPollution/AirPollution";
import DailyForecast from "./Components/DailyForecast/DailyForecast";
import FeelsLike from "./Components/FeelsLike/FeelsLike";
import Humidity from "./Components/Humidity/Humidity";
import Navbar from "./Components/Navbar";
import Population from "./Components/Population/Population";
import Pressure from "./Components/Pressure/Pressure";
import Sunset from "./Components/Sunset/Sunset";
import Temperature from "./Components/Temperature/Temperature";
import UvIndex from "./Components/UvIndex/UvIndex";
import Visibility from "./Components/Visibility/Visibility";
import Wind from "./Components/Wind/Wind";
import { useGlobalContextUpdate } from "./context/globalContext"; 
import dynamic from "next/dynamic";
import { lazy } from "react";
import Topcities from "./utils/Topcities";

const FiveDayForecast = lazy(() =>  import("./Components/FiveDayForecast/FiveDayForecast"));

const DynamicMapbox = dynamic(
  ()=>import ('./Components/Mapbox/Mapbox'), 
  {  
  ssr:false,
  }
);

export default function Home() {
  const { setActiveCityCoords } = useGlobalContextUpdate();

  const getClickedCityCords = (lat: number, lon: number) => {
    setActiveCityCoords([lat, lon]);

      window.scrollTo({
        top: 0,
        behavior: "smooth",   
    
    });
  };

  return (
    <main className="mx-[1rem] box-border lg:mx-[2rem] overflow-hidden xl:mx-[6rem] 2xl:mx-[16rem] m-auto my-4">
      <Navbar />
      <div className="pb-4 flex flex-col gap-4 md:flex-row">
        <div className="flex flex-col gap-4 w-full  md:w-[35rem]">
          <Temperature />
          <FiveDayForecast />
        </div>
        <div className="flex flex-col w-full">
          <div className="grid h-full col-span-full gap-x-4 gap-y-3 box-border sm-2:col-span-2 lg:grid-cols-3 xl:grid-cols-4">
            <AirPollution />
            <Sunset />
            <Wind />
            <DailyForecast />
            <UvIndex />
            <Population />
            <FeelsLike />
            <Humidity />
            <Visibility />
            <Pressure />
          </div>
          <div className="mapbox-con mt-4 flex gap-4">
            <DynamicMapbox />
            <Topcities />

          </div>
        </div>
      </div>

    </main>
  );
}