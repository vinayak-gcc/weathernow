"use client"
import dynamic from "next/dynamic";

const Topcities = dynamic(()=>import ('../utils/Topcities'), 
  {  
  ssr:false,
  }
);

export default function MapboxWrapper() {
  return <Topcities />;
}
