"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FRONTEND_URL = exports.GOOGLE_MAPS_API_KEY = exports.MONGODB_URI = exports.PORT = void 0;
require("dotenv").config();
exports.PORT = process.env.PORT || "3001";
exports.MONGODB_URI = process.env.MONGODB_URI || "";
exports.GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";
exports.FRONTEND_URL = process.env.FRONTEND_URL || "";
