import { Location } from "./location";

export interface Place {
  address: string;
  location: Location;
  name: string;
  category: string[];
  rating: number;
  placeID: string;
}
