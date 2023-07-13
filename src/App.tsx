import {FC, useState} from "react";
import {MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, CircleMarker} from "react-leaflet";
import {LatLngTuple} from "leaflet";
import { stops } from "./assets/test.ts";
import {httpInstance, LiveVehicle} from "./api/api.ts";
import useSWR from "swr";
import {divIconExample} from "./components/BusIcon.tsx";


const MapEvents: FC<{ setZoom: (zoomLevel: number) => void}> = ({ setZoom }) => {
  const map = useMap();
  useMapEvents({
    zoomend() { // zoom event (when zoom animation ended)
      const zoom = map.getZoom(); // get current Zoom of map
      setZoom(zoom);
    },
  });
  return false;
};

function fetcher(path: string) {
  return httpInstance.get<LiveVehicle[]>(path).then(res => res.data);
}

function App() {
  const [zoom, setZoom] = useState(14);
  const { data } = useSWR(
    "/bgplus/live",
    fetcher,
    { refreshInterval: 10000 }
  );

  console.log(zoom);


  // function handleStopClick() {
  //   console.log(zoom);
  // }

  return (
    <MapContainer preferCanvas={true} center={[stops[0].lat, stops[0].lng] as LatLngTuple} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents setZoom={setZoom} />
      {/*{stops.map((busStop) => (*/}
      {/*    <Marker eventHandlers={{*/}
      {/*        click: () => handleStopClick()*/}
      {/*    }} key={busStop.id} position={[busStop.lat, busStop.lng]}>*/}
      {/*        <Popup>{busStop.name}</Popup>*/}
      {/*    </Marker>*/}
      {/*))}*/}

      {data && data.map((vehicle) => { 
        return (<Marker icon={divIconExample(vehicle, zoom)} key={vehicle.garage_number} position={{ lat: vehicle.lat, lng: vehicle.lng }} >
          <Popup>{vehicle.garage_number}</Popup>
        </Marker>);
      })}

      {/*<Marker position={position as LatLngTuple}>*/}
      {/*    <Popup>*/}
      {/*        A pretty CSS3 popup. <br /> Easily customizable.*/}
      {/*    </Popup>*/}
      {/*</Marker>*/}
    </MapContainer>
  );
}

export default App;
