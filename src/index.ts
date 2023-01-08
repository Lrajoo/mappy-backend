import express from "express";
import { PORT, GOOGLE_MAPS_API_KEY, ENV, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "./utils/config";
import axios from "axios";
import cors from "cors";
import { getCategory } from "./utils/category";
import { formatOpeningHours } from "./utils/hours";
import { Place } from "./models/place";
import { DetailedPlace } from "./models/detailedPlace";
import { connectDB } from "./utils/dbConnection";
import mongoose from "mongoose";
import Search from "./models/Search";
import NewYork from "./models/NewYork";
import { getCity } from "./utils/city";
import * as placesJson from "./utils/placesJson.json";
import * as placesDetailJson from "./utils/placeDetailJson.json";
import loginRoutes from "./routes/login";
import verifyRoutes from "./routes/verify";
import usersRoutes from "./routes/users";

connectDB();

const app = express();

const corsOptions = {
  origin: ENV === "dev" ? "http://localhost:3000" : "https://main.dgt48bo9ztida.amplifyapp.com",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded());
app.use("/mappy/api/login", loginRoutes);
app.use("/mappy/api/verify", verifyRoutes);
app.use("/mappy/api/users", usersRoutes);

app.get("/mappy/api/places", async (req: any, res: any) => {
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
});

app.get("/mappy/api/place/:placeID", async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  // res.setHeader("Content-Type", "application/json");
  const placeID = req.params.placeID;
  const place: any =
    ENV === "dev"
      ? placesDetailJson
      : await axios.get(
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
});

app.get("/mappy/api/locations", async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  // res.setHeader("Content-Type", "application/json");
  const locations = await NewYork.find();
  res.send(locations);
});

app.post("/mappy/api/location", async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  // res.setHeader("Content-Type", "application/json");
  await NewYork.create({
    userId: req.body.userId,
    placeId: req.body.placeId,
    timestamp: new Date(),
    mustHave: req.body.mustHave,
    notes: req.body.notes,
  });
  res.status(201).json({ success: "Location added!" });
});

app.delete("/mappy/api/locations/:placeId", async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  // res.setHeader("Content-Type", "application/json");
  const placeId = req.params.placeId;
  await NewYork.findOne({ placeId: placeId }).deleteOne();
  res.status(201).json({ success: "Location removed!" });
});

const port = PORT || 3000;

mongoose.connection.once("open", () => {
  app.listen(port, () => console.log(`Server running on port ${port} in ${ENV} `));
});

module.exports = app;
