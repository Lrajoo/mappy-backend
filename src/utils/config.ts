require("dotenv").config();

export const PORT: string = process.env.PORT || "3001";
export const MONGODB_URI: string = process.env.MONGODB_URI || "";
export const GOOGLE_MAPS_API_KEY: string = process.env.GOOGLE_MAPS_API_KEY || "";
export const FRONTEND_URL: string = process.env.FRONTEND_URL || "";
