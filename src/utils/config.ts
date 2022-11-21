require("dotenv").config();

export const PORT: string = process.env.PORT || "3001";
export const MONGODB_URI: string = process.env.MONGODB_URI || "";
export const GOOGLE_MAPS_API_KEY: string = process.env.GOOGLE_MAPS_API_KEY || "";
export const FRONTEND_URL: string = process.env.FRONTEND_URL || "";
export const ENV: string = process.env.ENV || "";
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
