import AirPollution from "./Components/AirPollution/AirPollution";
import DailyForecast from "./Components/DailyForecast/DailyForecast";
import FeelsLike from "./Components/FeelsLike/FeelsLike";
import Humidity from "./Components/Humidity/Humidity";
import Navbar from "./Components/Navbar";
import Population from "./Components/Population/Population";
import FiveDayForecast from "./Components/FiveDayForecast/FiveDayForecast";
import Pressure from "./Components/Pressure/Pressure";
import Sunset from "./Components/Sunset/Sunset";
import UvIndex from "./Components/UvIndex/UvIndex";
import Temperature from "./Components/Temperature/Temperature";
import Visibility from "./Components/Visibility/Visibility";
import Wind from "./Components/Wind/Wind";
import Topcities from "./Wrapper/TopcitiesWrapper";
import MapboxWrapper from "./Wrapper/MapboxWrapper";

// Preload Links
{/* <link rel="preload" href="https://api.geoapify.com/"/>;
<link rel="preload" href="https://www.openstreetmap.org/copyright"/>;
<link rel="preload" href="https://b.tile.openstreetmap.org"/>; */}


export default function Home() {

  return (
    <main className="mx-[1rem] min-w-[14rem] box-border lg:mx-[2rem] overflow-hidden xl:mx-[6rem] 2xl:mx-[16rem] m-auto my-4">
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
          <div className="min-w-[5rem] h-full gap-x-4 gap-y-3 space-y-3 box-border sm:grid grid-cols-2
           sm:space-y-0 lg:grid-cols-3 lg:space-y-0 xl:grid-cols-4 xl:space-y-0">
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
               <MapboxWrapper />
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