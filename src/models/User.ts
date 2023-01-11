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
  userName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
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
  email: {
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
    type: [Schema.Types.Mixed],
    required: true,
  },
});

export default mongoose.model("User", userSchema);
