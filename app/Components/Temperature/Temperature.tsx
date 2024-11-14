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
import moment, { localeData } from "moment";
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
    switch (weatherMain) {
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

    // upadte time every second
    const interval = setInterval(() => {
      const localMoment = moment().utcOffset(timezone / 60);

      // custom format: 24 hour format
      const formatedTime = localMoment.format("HH:mm:ss");

      // Today's Date
      const date = localMoment.format("DD-MM-YYYY");

      // day of the week
      const day = localMoment.format("dddd");

      setLocalTime(formatedTime);
      setCurrentDate(date);
      setCurrentDay(day);

    }, 1000);

    // clear interval
    return () => clearInterval(interval);
  }, [timezone]);

  if (!weather) {
    return <Skeleton className="h-[26.5rem] w-full lg::w-[24rem]"></Skeleton>;
  }

  const { main: weatherMain, description } = weather[0];

  return (
    <div
      className="pt-6 pb-5 px-4 border rounded-lg flex flex-col h-[25.5rem]
        justify-between dark:bg-dark-grey shadow-sm dark:shadow-none"
    >
      <p className="flex justify-between items-center">
        <span>{name}</span>
        <span className="font-medium">{currentDate}</span>
      </p>

      <p className="pt-2 font-bold jus flex justify-between items-center ">
        <span className="font-medium">{currentDay}</span>
        <span className="font-medium">{localTime}</span>
      </p>

      <p className="py-10 font-bold text-6xl md:text-9xl self-center">{temp}°</p>

      <div>

        <div>
          <span>{getIcon()}</span>
          <p className="pt-2 capitalize text-lg font-medium">{description}</p>
        </div>

        <p className="flex items-center gap-2">
          <span>Low: {minTemp}°</span>
          <span>High: {maxTemp}°</span>
        </p>

      </div>
    </div>
  );
}

export default Temperature;
