import defaultStates from "@/app/utils/defaultStates";
import { useGlobalContextUpdate } from "../context/globalContext"; 

function Topcities() {

    const { setActiveCityCoords } = useGlobalContextUpdate();

    const getClickedCityCords = (lat: number, lon: number) => {
      setActiveCityCoords([lat, lon]);
  
        window.scrollTo({
          top: 0,
          behavior: "smooth",   
      
      });
    };

    return(
        <div className="flex-1 flex-col gap-3 ">
              <h2 className="flex items-center gap-2 font-medium">
                Top Large Cities
              </h2>
              <div className="flex  mt-3 flex-col gap-4">
                {defaultStates.map((state, index) => {
                  return (
                    <div
                      key={index}
                      className="border rounded-lg cursor-pointer dark:bg-dark-grey shadow-sm dark:shadow-none"
                      onClick={() => {
                        getClickedCityCords(state.lat, state.lon);
                      }}
                    >
                      <p className="px-6 py-4 ">{state.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
    );
}

export default Topcities;