import mongoose from "mongoose";
import { MONGODB_URI } from "./config";

export const connectDB = async () => {
  try {
    return mongoose.connect(MONGODB_URI);
  } catch (err) {
    console.error(err);
  }
};
