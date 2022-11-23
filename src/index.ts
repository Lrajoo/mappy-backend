import express from "express";
import {
  PORT,
  MONGODB_URI,
  GOOGLE_MAPS_API_KEY,
  FRONTEND_URL,
  ENV,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
} from "./utils/config";
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
import * as placesJson from "./utils/placesJson.json";
import * as placesDetailJson from "./utils/placeDetailJson.json";

connectDB();

const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  // origin: "https://main.dgt48bo9ztida.amplifyapp.com",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded());

app.post("/mappy/api/login", async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  const userExists = await User.findOne({ phoneNumber: req.body.phoneNumber });
  const phoneNumber = `+1${req.body.phoneNumber}`;
  if (userExists === null) {
    res.status(400).json({ Failure: "No account associated with this phone number." });
  } else {
    client.verify.v2
      .services("VA1b5e842174979ebb0f38dfee533fb26b")
      .verifications.create({ to: phoneNumber, channel: "sms" })
      .then((verification: any) => {
        res.status(201).json({ status: verification.status });
      });
  }
});

app.post("/mappy/api/verify", async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  const phoneNumber = `+1${req.body.phoneNumber}`;
  const user = await User.findOne({ phoneNumber: req.body.phoneNumber });

  client.verify.v2
    .services("VA1b5e842174979ebb0f38dfee533fb26b")
    .verificationChecks.create({ to: phoneNumber, code: req.body.verificationCode })
    .then((verification_check: any) => {
      if (verification_check.status == "approved" && user)
        res.status(201).json({
          loginStatus: verification_check.status === "approved" ? true : false,
          userId: user.userId,
          firstName: user.firstName,
          userName: user.userName,
          lastName: user.lastName,
          homeCity: user.homeCity,
          homeState: user.homeState,
        });
    });
});

app.post("/mappy/api/users", async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  const homeCity = req.body.homeCity.split(",")[0];
  const homeState = req.body.homeCity.split(",")[1];
  const userExists = await User.findOne({ phoneNumber: req.body.phoneNumber });
  if (userExists !== null) {
    res.status(400).json({ Failure: "Account already created with this phone number" });
  } else {
    const result = await User.create({
      userId: uuidv4(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      dateOfBirth: req.body.dateOfBirth,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      homeCity: homeCity,
      homeState: homeState,
      friends: [],
    });
    res.status(201).json({ success: "Signed Up!" });
  }
});

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
