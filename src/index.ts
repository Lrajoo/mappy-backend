import express from "express";
import { PORT, MONGODB_URI, GOOGLE_MAPS_API_KEY, FRONTEND_URL } from "./utils/config";
import { MongoClient } from "mongodb";
import axios from "axios";
import cors from "cors";
import { getCategory } from "./utils/category";
import { formatOpeningHours } from "./utils/hours";
import { Place } from "./models/place";
import { DetailedPlace } from "./models/detailedPlace";

const app = express();
const client = new MongoClient(MONGODB_URI);

const corsOptions = {
  origin: `${FRONTEND_URL}`,
  credentials: true,
  optionSuccessStatus: 200,
};

// app.use(cors(corsOptions));

app.get("/", async (req: any, res: any) => {
  console.log(`Server is working`);
});

app.get("/mappy/api/places", async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  const searchQuery = req.query.search;
  const places: any = await axios.get(
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
});

app.get("/mappy/api/place/:placeID", async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  const placeID = req.params.placeID;
  const place: any = await axios.get(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&key=${GOOGLE_MAPS_API_KEY}`
  );
  const formattedPlace: DetailedPlace = {
    address: place.data.result.formatted_address,
    phoneNumber: place.data.result.formatted_phone_number,
    description: place.data.result.editorial_summary.overview,
    name: place.data.result.name,
    placeID: place.data.result.place_id,
    priceLevel: place.data.result.price_level,
    rating: place.data.result.rating,
    category: getCategory(place.data.result.types),
    location: place.data.result.geometry.location,
    website: place.data.result.website,
    mapURL: "",
    openingHours: formatOpeningHours(place.data.result.current_opening_hours.weekday_text),
  };
  res.send(formattedPlace);
});

const port = PORT || 3000;

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
