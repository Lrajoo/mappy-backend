import mongoose from "mongoose";

const Schema = mongoose.Schema;

const sanFranciscoSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  placeId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  mustHave: {
    type: String,
  },
  notes: {
    type: String,
  },
});

export default mongoose.model("SanFrancisco", sanFranciscoSchema);
