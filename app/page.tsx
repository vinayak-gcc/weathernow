"use client";

export const revalidate = 0;

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
import dynamic from "next/dynamic";
import { lazy } from "react";
import Topcities from "./utils/Topcities";

<link rel="preload" href="https://www.openstreetmap.org/copyright"/>;
<link rel="preload" href="https://b.tile.openstreetmap.org"/>

const FiveDayForecast = lazy(() =>  import("./Components/FiveDayForecast/FiveDayForecast"));

const DynamicMapbox = dynamic(()=>import ('./Components/Mapbox/Mapbox'), 
  {  
  ssr:false,
  }
);

export default function Home() {

  return (
    <main className="mx-[1rem] box-border lg:mx-[2rem] overflow-hidden xl:mx-[6rem] 2xl:mx-[16rem] m-auto my-4">
      <Navbar />
      <div className="pb-4 flex flex-col gap-4 md:flex-row">
        <div className="flex flex-col gap-4 w-full  md:w-[35rem]">
          <Temperature />
          <FiveDayForecast />
          <div className="hidden md:block lg:hidden">
            <Topcities/>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="grid h-full gap-x-4 gap-y-3 box-border col-span-full sm:col-span-2 
          lg:grid-cols-3 xl:grid-cols-4">
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

          <div className="mt-4 grid grid-cols-1 sm-2:grid-cols-2 lg:grid-cols-2 gap-4">    
              
              <div className="flex-1 h-[24rem]">
                <DynamicMapbox/>
              </div>

              <div className=" mapbox-con block md:hidden lg:block">
                <Topcities /> 
              </div>

          </div>
          
        </div>
      </div>

    </main>
  );
}