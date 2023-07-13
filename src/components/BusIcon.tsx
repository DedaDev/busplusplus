import {divIcon} from "leaflet";
import {renderToString} from "react-dom/server";
import {FC} from "react";
import {LiveVehicle} from "../api/api.ts";


const BusIcon: FC<{ vehicle: LiveVehicle, zoomLevel: number }> = ({vehicle, zoomLevel}) => {
  const angle = vehicle.angle + 90;
  const shouldMirror = angle < 270 && angle > 0;
  const scale = getScaleBasedOnZoomLevel(zoomLevel);
  const scaleTransform = shouldMirror ? `scale(${scale},-${scale})` : `scale(${scale})`;

  const vehicleType = getVehicleTypeByNumber(vehicle.number.trim());
  const vehicleImage = vehicleTypeImageMap[vehicleType];


  return <div id="vehicle-wrapper" style={{ width: "75px", transform: `translate(-50%, -50%) rotate(${angle}deg) ${scaleTransform}` }} className="relative w-full">
    <img alt={`vozilo ${vehicle.number}`} className="h-8"  title={`vozilo ${vehicle.number}`} src={vehicleImage} />
    <div className="bottom-3 left-6 absolute flex justify-center items-center w-full h-full ">
      <p
        style={{ transform: shouldMirror ? "scale(-1, 1)": "" }}
        className="text-md text-yellow-500 border-solid border-2 border-black bg-black rounder-lg leading-none">
        {vehicle.number}
      </p>
    </div>
  </div>;
};

export const divIconExample = (vehicle: LiveVehicle, zoomLevel: number) => divIcon({ className: "vehicle", html: renderToString(<BusIcon zoomLevel={zoomLevel} vehicle={vehicle} />)});


function getScaleBasedOnZoomLevel(zoomLevel: number) {
  if(zoomLevel < 12) return 0.3;
  if(zoomLevel < 13) return 0.4;
  if(zoomLevel < 14) return 0.5;
  if(zoomLevel < 17) return 0.8;
  if(zoomLevel < 18) return 0.9;
  return 1;
}

enum VehicleType {
  BUS,
  BUS_ECO,
  TRAM,
  TROLL
}

const vehicleTypeImageMap: Record<VehicleType, string> = {
  [VehicleType.BUS] : "/images/vehicle_bus.png",
  [VehicleType.BUS_ECO]: "/images/vehicle_bus_eco.png",
  [VehicleType.TRAM]: "/images/vehicle_tram.png",
  [VehicleType.TROLL]: "/images/vehicle_troll.png",
};

const vehiclesTypeToVehicleNumber = {
  [VehicleType.TRAM]: ["2", "5", "6", "7", "9", "10", "11", "12", "13", "14"],
  [VehicleType.TROLL]: ["19", "21", "22", "28", "29", "40", "41", "28A", "28А"] // koriste drugo A
};

function getVehicleTypeByNumber(vehicle_number: string) {
  if(vehicle_number.startsWith("ЕКО")) {
    return VehicleType.BUS_ECO;
  }

  const isTroll = vehiclesTypeToVehicleNumber[VehicleType.TROLL].includes(vehicle_number);
  const isTram = vehiclesTypeToVehicleNumber[VehicleType.TRAM].includes(vehicle_number);

  if(isTroll) return VehicleType.TROLL;
  if(isTram ) return VehicleType.TRAM;


  return VehicleType.BUS;
}