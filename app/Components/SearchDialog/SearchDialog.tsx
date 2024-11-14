"use client";

import { useGlobalContextUpdate,} from "@/app/context/globalContext";
import { useRef, useEffect,useState } from 'react';
import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React from "react";
import axios from "axios";
import defaultStates from "@/app/utils/defaultStates";
import { debounce } from "lodash";

function SearchDialog() {

  const { setActiveCityCoords } = useGlobalContextUpdate();
  const [geoCodedList, setGeoCodedList] = useState(defaultStates);
  const [inputValue, setInputValue] = useState("");
  const searchInputRef = useRef(null);
  const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));
  const [open, setOpen] = React.useState(false);


    // handle input
    const handleInput = (e:any) => {
      setInputValue(e.target.value);
  
      if (e.target.value === "") {
        setGeoCodedList(defaultStates);
      }
    };
  
    // debounce function
    useEffect(() => {
      const debouncedFetch = debounce((search) => {
        fetchGeoCodedList(search);
      }, 500);
  
      if (inputValue) {
        debouncedFetch(inputValue);
      }
     return()=>debouncedFetch.cancel();

    }, [inputValue]);

      //geocoded list
      const fetchGeoCodedList = async (search:string) => {
        try {
          const res = await axios.get(`/api/geocoded?search=${search}`);
    
          setGeoCodedList(res.data);
        } catch (error) {
          console.log("Error fetching geocoded list: ", error);
        }
      };

     useEffect(() => {

    const handleKeyDown = (event:KeyboardEvent) => {

      if (event.key === '/') {
        event.preventDefault
        document.getElementById("Search").focus()
        document.getElementById("Search").style.width='24rem'
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
    <div className="search-btn" ref={searchInputRef}  >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild >
          <Button
            variant="outline"
            className="border inline-flex items-center justify-center text-sm font-medium hover:dark:bg-[#131313]
             hover:bg-slate-100 hover:lg:w-[24rem] ease-in-out duration-200 "
             id="Search"
          >
            <p className="text-sm  text-muted-foreground "> Click Here or Press ' / + Enter '</p>
          </Button>
        </DialogTrigger>

        <DialogContent className="p-0" >
          <Command className=" rounded-lg border shadow-md" >
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
                        onClickCapture={(event) => {
                          wait().then(() => setOpen(false));
                          event.preventDefault();
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
