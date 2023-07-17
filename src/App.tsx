import {FC, useState} from "react";
import {MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
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
    { refreshInterval: 5000 }
  );

  return (
    <MapContainer preferCanvas={true} center={{ lat:44.8044814, lng:20.4828214 }} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents setZoom={setZoom} />
      {/*<StopsMarkers />*/}
      {data && data.map((vehicle) => {
        return (<Marker eventHandlers={{ click: () => console.log(vehicle) }} icon={divIconExample(vehicle, zoom)} key={vehicle.garage_number} position={{ lat: vehicle.lat, lng: vehicle.lng }} >
          <Popup>{vehicle.updated_at} {vehicle.number}</Popup>
        </Marker>);
      })}
      {/*<GetUserLocation />*/}
    </MapContainer>
  );
}

// function StopsMarkers() {
//   const map = useMap();
//   const markersInBounds = stops.filter(stop => {
//     return map.getBounds().contains({ lat: stop.lat, lng: stop.lng });
//   });
//
//   return <Fragment>
//     {markersInBounds.map((busStop) => (
//       <Marker key={busStop.id} position={[busStop.lat, busStop.lng]}>
//         <Popup>
//           <p>{busStop.name}</p>
//           {busStop.id}</Popup>
//       </Marker>
//     ))}
//   </Fragment>;
// }

// function GetUserLocation() {
//   const map = useMap();
//
//   function success({ coords } : GeolocationPosition) {
//     // TODO when a user is out of Belgrade region, change coordinates to the center
//     map.setView({lat: coords.latitude, lng: coords.longitude }, 15);
//   }
//
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(success, () => console.log("err"));
//     } else {
//       console.log("Geolocation not supported");
//     }
//   },[]);
//
//   return null;
// }

export default App;
