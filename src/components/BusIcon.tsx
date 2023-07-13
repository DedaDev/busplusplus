import {divIcon} from "leaflet";
import {renderToString} from "react-dom/server";
import {FC} from "react";
import {LiveVehicle} from "../api/api.ts";



const BusIcon: FC<{ vehicle: LiveVehicle }> = ({vehicle}) => {
  const angle = vehicle.angle + 90;
  const shouldMirror = angle < 270 && angle > 0;
  return <div style={{ width: "75px", transform: `translate(-50%, -50%) rotate(${angle}deg) ${shouldMirror ? "scale(1, -1)" : ""}` }} className="relative w-full">
    <img alt={`vozilo ${vehicle.number}`} className="h-8"  title={`vozilo ${vehicle.number}`} src="/bus_icon.png" />
    <div className="bottom-3 left-6 absolute flex justify-center items-center w-full h-full ">
      <p
        style={{ transform: shouldMirror ? "scale(-1, 1)": "" }}
        className="text-md text-yellow-500 border-solid border-2 border-black bg-black rounder-lg leading-none">
        {vehicle.number}
      </p>
    </div>
  </div>;
};

export const divIconExample = (vehicle: LiveVehicle) => divIcon({ html: renderToString(<BusIcon vehicle={vehicle} />)});
