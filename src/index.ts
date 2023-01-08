import express from "express";
import { PORT, ENV } from "./utils/config";
import cors from "cors";
import { connectDB } from "./utils/dbConnection";
import mongoose from "mongoose";
import loginRoutes from "./routes/login";
import verifyRoutes from "./routes/verify";
import usersRoutes from "./routes/users";
import placesRoutes from "./routes/places";
import placeRoutes from "./routes/place";
import locationsRoutes from "./routes/locations";

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
app.use("/mappy/api/places", placesRoutes);
app.use("/mappy/api/place", placeRoutes);
app.use("/mappy/api/locations", locationsRoutes);

const port = PORT || 3000;

mongoose.connection.once("open", () => {
  app.listen(port, () => console.log(`Server running on port ${port} in ${ENV} `));
});

module.exports = app;
