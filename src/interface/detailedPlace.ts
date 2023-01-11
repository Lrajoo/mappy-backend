import { Location } from "./location";

export interface DetailedPlace {
  address: string;
  phoneNumber: string;
  description: string;
  name: string;
  placeId: string;
  priceLevel: number;
  rating: number;
  category: string[];
  location: Location;
  website: string;
  mapURL: any;
  openingHours: string[];
}
