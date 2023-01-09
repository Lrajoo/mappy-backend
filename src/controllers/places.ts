import User from "../models/User";
import { getCity } from "../utils/city";
import { Place } from "../models/place";
import axios from "axios";
import Search from "../models/Search";
import * as placesJson from "../utils/placesJson.json";
import { getCategory } from "../utils/category";
import { ENV, GOOGLE_MAPS_API_KEY } from "../utils/config";

const places = async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  res.setHeader("Content-Type", "application/json");
  const searchQuery = req.query.search;
  const searchData = getCity(searchQuery);
  await Search.create({
    userId: "f2cada03-140f-41ad-84eb-1ee7560ad516",
    query: searchData.query,
    city: searchData.city,
    state: searchData.state,
    timestamp: new Date(),
  });
  const places: any =
    ENV === "dev"
      ? placesJson
      : await axios.get(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=${GOOGLE_MAPS_API_KEY}`
        );
  const formattedResults: Place[] = places.data.results.map((result: any) => {
    return {
      address: result.formatted_address,
      location: result.geometry.location,
      name: result.name,
      placeID: result.place_id,
      category: getCategory(result.types),
      rating: result.rating,
    };
  });
  res.send(formattedResults);
};

export default places;
