import axios from "axios";

export interface LiveVehicle {
    garage_number: string
    number: string,
    lat: number,
    lng: number,
    updated_at: string,
    angle: number
}

export const httpInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
});

export function getPositions() {
  return httpInstance.get("/bgplus/live");
}