import mongoose from "mongoose";

const Schema = mongoose.Schema;

const searchSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  query: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Search", searchSchema);
