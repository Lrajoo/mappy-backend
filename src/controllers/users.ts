import User from "../models/User";
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "../utils/config";
import { v4 as uuidv4 } from "uuid";

const users = async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  const homeCity = req.body.homeCity.split(",")[0];
  const homeState = req.body.homeCity.split(",")[1];
  const userNameExists = await User.findOne({ userName: req.body.userName });
  const phoneNumberExists = await User.findOne({ phoneNumber: req.body.phoneNumber });
  if (userNameExists !== null) {
    res.status(400).json({
      status: "Failure",
      field: "userName",
      errorMessage: "This username has already been selected, pick another one",
    });
  } else if (phoneNumberExists !== null) {
    res.status(400).json({
      status: "Failure",
      field: "phoneNumber",
      errorMessage: "This phone number has already been used with another account",
    });
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
};

export default users;
