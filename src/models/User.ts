import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  homeCity: {
    type: String,
    required: true,
  },
  homeState: {
    type: String,
    required: true,
  },
  friends: {
    type: [String],
    required: true,
  },
});

export default mongoose.model("User", userSchema);