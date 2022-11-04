import express from "express";
import { PORT, MONGODB_URI, GOOGLE_MAPS_API_KEY } from "./utils/config";
import { MongoClient } from "mongodb";
import axios from "axios";

const app = express();
const client = new MongoClient(MONGODB_URI);

app.get("/mappy/api/places", async (req: any, res: any) => {
  const searchQuery = req.query.search;
  const places: any = await axios.get(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=${GOOGLE_MAPS_API_KEY}`
  );
  res.send(places.data.results);
});

app.get("/mappy/api/place/:placeID", async (req: any, res: any) => {
  const placeID = req.params.placeID;
  const place: any = await axios.get(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&key=${GOOGLE_MAPS_API_KEY}`
  );
  res.send(place.data.result);
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
