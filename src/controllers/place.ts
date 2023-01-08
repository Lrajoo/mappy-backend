import User from "../models/User";
import { getCity } from "../utils/city";
import { Place } from "../models/place";
import axios from "axios";
import * as placesDetailJson from "../utils/placeDetailJson.json";
import { getCategory } from "../utils/category";
import { ENV, GOOGLE_MAPS_API_KEY } from "../utils/config";
import { DetailedPlace } from "../models/detailedPlace";
import { formatOpeningHours } from "../utils/hours";

const place = async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  // res.setHeader("Content-Type", "application/json");
  const placeID = req.params.placeID;
  // const place: any =
  //   ENV === "dev"
  //     ? placesDetailJson
  //     : await axios.get(
  //         `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&key=${GOOGLE_MAPS_API_KEY}`
  //       );
  const place: any = await axios.get(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&key=${GOOGLE_MAPS_API_KEY}`
  );
  const formattedPlace: DetailedPlace = {
    address: place.data.result.formatted_address,
    phoneNumber: place.data.result?.formatted_phone_number,
    description: place.data.result?.editorial_summary?.overview,
    name: place.data.result?.name,
    placeId: place.data.result?.place_id,
    priceLevel: place.data.result?.price_level,
    rating: place.data.result?.rating,
    category: getCategory(place.data.result.types),
    location: place.data.result?.geometry?.location,
    website: place.data.result?.website,
    mapURL: "",
    openingHours: formatOpeningHours(place.data.result.current_opening_hours.weekday_text),
  };
  res.send(formattedPlace);
};

export default place;
