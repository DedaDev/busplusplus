import {divIcon} from "leaflet";
import {renderToString} from "react-dom/server";
import {FC} from "react";
import {LiveVehicle} from "../api/api.ts";


const BusIcon: FC<{ vehicle: LiveVehicle, zoomLevel: number }> = ({vehicle, zoomLevel}) => {
  console.log(zoomLevel);
  const angle = vehicle.angle + 90;
  const shouldMirror = angle < 270 && angle > 0;
  const scale = getScaleBasedOnZoomLevel(zoomLevel);
  const scaleTransform = shouldMirror ? `scale(${scale},-${scale})` : `scale(${scale})`;
  return <div style={{ width: "75px", transform: `translate(-50%, -50%) rotate(${angle}deg) ${scaleTransform}` }} className="relative w-full">
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

export const divIconExample = (vehicle: LiveVehicle, zoomLevel: number) => divIcon({ html: renderToString(<BusIcon zoomLevel={zoomLevel} vehicle={vehicle} />)});


function getScaleBasedOnZoomLevel(zoomLevel: number) {
  if(zoomLevel < 12) return 0.3;
  if(zoomLevel < 13) return 0.4;
  if(zoomLevel < 14) return 0.5;
  if(zoomLevel < 15) return 0.8;
  if(zoomLevel < 16) return 0.9;
  if(zoomLevel < 17) return 1;
  return 1;
}