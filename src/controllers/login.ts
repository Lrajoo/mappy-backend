import User from "../models/User";
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "../utils/config";

const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const login = async (req: any, res: any) => {
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
      .services("VA7e0cd81a1ff24f1b1c2fddb5c3b120a7")
      .verifications.create({ to: phoneNumber, channel: "sms" })
      .then((verification: any) => {
        res.status(201).json({ status: verification.status });
      });
  }
};

export default login;
