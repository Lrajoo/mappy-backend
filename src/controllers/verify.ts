import User from "../models/User";
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "../utils/config";

const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const verify = async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  const phoneNumber = `+1${req.body.phoneNumber}`;
  const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
  client.verify.v2
    .services("VA7e0cd81a1ff24f1b1c2fddb5c3b120a7")
    .verificationChecks.create({ to: phoneNumber, code: req.body.verificationCode })
    .then((verification_check: any) => {
      if (verification_check.status == "pending") {
        res.status(401).json({
          loginStatus: false,
        });
      }
      if (verification_check.status == "approved" && user) {
        res.status(201).json({
          loginStatus: verification_check.status === "approved" ? true : false,
          userId: user.userId,
          firstName: user.firstName,
          userName: user.userName,
          lastName: user.lastName,
          homeCity: user.homeCity,
          homeState: user.homeState,
        });
      }
    });
};

export default verify;
