import { LatLngLiteral } from "leaflet";

export interface Comments {
  user: string;
  text: string;
}

export type MapLocation = {
  id: string;
  name: string;
  site: string;
  comments: Comments[];
} & LatLngLiteral;
