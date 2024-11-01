"use client";
import React from "react";
import ThemeDropdown from "./ThemeDropdown/ThemeDropdown";
import SearchDialog from "./SearchDialog/SearchDialog";

function Navbar() {


  return (
    <div className="flex flex-col sm:flex-row py-4  items-center justify-between">
     
      <div className="text-start text-2xl bold ml-1">
        WeatherNow
      </div>

      <div className="search-container flex mt-2 sm:mt-0 gap-2">
        <SearchDialog />

        <div className="btn-group flex items-center gap-2">
          <ThemeDropdown />


        </div>
      </div>
    </div>
  );
}

export default Navbar;
