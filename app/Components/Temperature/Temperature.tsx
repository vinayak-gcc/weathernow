"use client";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/app/context/globalContext";
import {
  clearSky,
  cloudy,
  drizzleIcon,
  rain,
  snow,
} from "@/app/utils/Icons";
import { kelvinToCelsius } from "@/app/utils/misc";
import moment from "moment";
import { Skeleton } from "@/components/ui/skeleton";

function Temperature() {
  const { forecast } = useGlobalContext();
  const { main, timezone, name, weather } = forecast;

  const temp = kelvinToCelsius(main?.temp);
  const minTemp = kelvinToCelsius(main?.temp_min);
  const maxTemp = kelvinToCelsius(main?.temp_max);

  // State
  const [localTime, setLocalTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentDay, setCurrentDay] = useState<string>("");

  const getIcon = () => {
    switch (weather?.[0]?.main) {
      case "Drizzle":
        return drizzleIcon;
      case "Rain":
        return rain;
      case "Snow":
        return snow;
      case "Clear":
        return clearSky;
      case "Clouds":
        return cloudy;
      default:
        return clearSky;
    }
  };

  // Live time update
  useEffect(() => {
    if (!timezone) return;
    
    const interval = setInterval(() => {
      const localMoment = moment().utcOffset(timezone / 60);
      const formattedTime = localMoment.format("HH:mm:ss");
      const date = localMoment.format("DD-MM-YYYY");
      const day = localMoment.format("dddd");

      setLocalTime(formattedTime);
      setCurrentDate(date);
      setCurrentDay(day);
    }, 1000);

    return () => clearInterval(interval);
  }, [timezone]);

  if (!weather) {
    return <Skeleton className="h-[26.5rem] w-full lg:w-[24rem]" />;
  }

  return (
    <div
      className="pt-6 pb-5 px-4 border rounded-lg flex flex-col h-[25.5rem] justify-between dark:bg-dark-grey shadow-sm dark:shadow-none"
    >
      <div className="flex justify-between items-center">
        <span>{name || <Skeleton className="h-5 w-20" />}</span>
        <span className="font-medium">{currentDate || <Skeleton className="h-5 w-20" />}</span>
      </div>

      <div className="pt-2 font-bold flex justify-between items-center">
        <span className="font-medium">{currentDay || <Skeleton className="h-5 w-20" />}</span>
        <span className="font-medium">{localTime || <Skeleton className="h-5 w-20" />}</span>
      </div>

      <div className="py-10 font-bold text-6xl md:text-9xl self-center">
        {temp !== undefined ? `${temp}°` : <Skeleton className="h-20 w-20" />}
      </div>

      <div>
        <div>
          <span>{getIcon()}</span>
          <div className="pt-2 capitalize text-lg font-medium">
            {weather[0]?.description || <Skeleton className="h-5 w-32" />}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span>
            {minTemp !== undefined ? `Low: ${minTemp}°` : <Skeleton className="h-5 w-20" />}
          </span>
          <span>
            {maxTemp !== undefined ? `High: ${maxTemp}°` : <Skeleton className="h-5 w-20" />}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Temperature;
