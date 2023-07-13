import axios from "axios";

export interface LiveVehicle {
    garage_number: string
    number: string,
    lat: number,
    lng: number,
    updated_at: Date,
    angle: number
}


export const httpInstance = axios.create({
  baseURL: "http://localhost:4000"
});

export function getPositions() {
  return httpInstance.get("/bgplus/live");
}