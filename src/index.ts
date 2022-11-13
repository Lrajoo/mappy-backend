import express from "express";
import { PORT, MONGODB_URI, GOOGLE_MAPS_API_KEY, FRONTEND_URL } from "./utils/config";
import { MongoClient } from "mongodb";
import axios from "axios";
import cors from "cors";
import { getCategory } from "./utils/category";
import { formatOpeningHours } from "./utils/hours";
import { Place } from "./models/place";
import { DetailedPlace } from "./models/detailedPlace";
import { connectDB } from "./utils/dbConnection";
import mongoose from "mongoose";
import User from "./models/User";
import Search from "./models/Search";
import NewYork from "./models/NewYork";
import { getCity } from "./utils/city";
import { v4 as uuidv4 } from "uuid";

connectDB();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded());

// app.get("/", async (req: any, res: any) => {
//   const result = await User.create({
//     userId: uuidv4(),
//     firstName: "Lingess",
//     lastName: "Rajoo",
//     phoneNumber: "7654094856",
//     homeCity: "New York City",
//     homeState: "New York",
//     friends: [],
//   });
//   console.log(result);
// });

app.get("/mappy/api/places", async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  const searchQuery = req.query.search;
  const searchData = getCity(searchQuery);
  console.log("searchQuery", searchQuery, searchData);
  await Search.create({
    userId: "f2cada03-140f-41ad-84eb-1ee7560ad516",
    query: searchData.query,
    city: searchData.city,
    state: searchData.state,
    timestamp: new Date(),
  });
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
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
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
    placeId: place.data.result.place_id,
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

app.get("/mappy/api/locations", async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  const locations = await NewYork.find();
  res.send(locations);
});

app.post("/mappy/api/location", async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  await NewYork.create({
    userId: req.body.userId,
    placeId: req.body.placeId,
    timestamp: new Date(),
    mustHave: req.body.mustHave,
    notes: req.body.notes,
  });
  res.status(201).json({ Success: "Location added!" });
});

app.delete("/mappy/api/locations/:placeId", async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  const placeId = req.params.placeId;
  await NewYork.find({ placeId: placeId }).deleteOne();
  res.status(201).json({ Success: "Location removed!" });
});

const port = PORT || 3000;

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(port, () => console.log(`Server running on port ${port}`));
});

module.exports = app;
