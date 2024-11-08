"use client";
import {
  useGlobalContext,
  useGlobalContextUpdate,
} from "@/app/context/globalContext";
import { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React from "react";

function SearchDialog() {

  const { geoCodedList, inputValue, handleInput } = useGlobalContext();
  const { setActiveCityCoords } = useGlobalContextUpdate();
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event:KeyboardEvent) => {

      if (event.key == '/') {
        searchInputRef.current.click()
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [hoveredIndex, setHoveredIndex] = React.useState<number>(0);

  const getClickedCoords = (lat: number, lon: number) => {
    setActiveCityCoords([lat, lon]);

  };

  
  return (
    <div className="search-btn">
      <Dialog>
        <DialogTrigger asChild 
         ref={searchInputRef} 
>
          <Button
            variant="outline"
            className="border inline-flex items-center justify-center text-sm font-medium hover:dark:bg-[#131313]
             hover:bg-slate-100  ease-in-out duration-200 "
             ref={searchInputRef} 
          >
            <p className="text-sm  text-muted-foreground ">Click Here or Press ' / + Enter '</p>
          </Button>
        </DialogTrigger>

        <DialogContent className="p-0">
          <Command className=" rounded-lg border shadow-md">
            <CommandInput
              value={inputValue}
              onChangeCapture={handleInput}
              placeholder="Type a command or search..."

            />
            <ul className="px-3 pb-2">
              <p className="p-2 text-sm text-muted-foreground">Suggestions</p>

              {geoCodedList?.length === 0 ||
                (!geoCodedList && <p>No Results</p>)}

              {geoCodedList &&
                geoCodedList.map(
                  (
                    item: {
                      name: string;
                      country: string;
                      state: string;
                      lat: number;
                      lon: number;
                    },
                    index: number
                  ) => {
                    const { country, state, name } = item;
                    return (
                      <li
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        className={`py-3 px-2 text-sm  rounded-sm cursor-default
                        ${hoveredIndex === index ? "bg-accent" : ""}
                      `}
                        onClick={() => {
                          getClickedCoords(item.lat, item.lon);
                        }}
                      >
                        <p className=" text">
                          {name}, {state && state + ","} {country}
                        </p>
                      </li>
                    );
                  }
                )}
            </ul>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SearchDialog;
