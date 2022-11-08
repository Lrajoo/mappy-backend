"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./utils/config");
const mongodb_1 = require("mongodb");
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const category_1 = require("./utils/category");
const hours_1 = require("./utils/hours");
const app = (0, express_1.default)();
const client = new mongodb_1.MongoClient(config_1.MONGODB_URI);
const corsOptions = {
    origin: `${config_1.FRONTEND_URL}`,
    credentials: true,
    optionSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server is working`);
}));
app.get("/mappy/api/places", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchQuery = req.query.search;
    const places = yield axios_1.default.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=${config_1.GOOGLE_MAPS_API_KEY}`);
    const formattedResults = places.data.results.map((result) => {
        return {
            address: result.formatted_address,
            location: result.geometry.location,
            name: result.name,
            placeID: result.place_id,
            category: (0, category_1.getCategory)(result.types),
            rating: result.rating,
        };
    });
    res.send(formattedResults);
}));
app.get("/mappy/api/place/:placeID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const placeID = req.params.placeID;
    const place = yield axios_1.default.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&key=${config_1.GOOGLE_MAPS_API_KEY}`);
    const formattedPlace = {
        address: place.data.result.formatted_address,
        phoneNumber: place.data.result.formatted_phone_number,
        description: place.data.result.editorial_summary.overview,
        name: place.data.result.name,
        placeID: place.data.result.place_id,
        priceLevel: place.data.result.price_level,
        rating: place.data.result.rating,
        category: (0, category_1.getCategory)(place.data.result.types),
        location: place.data.result.geometry.location,
        website: place.data.result.website,
        mapURL: "",
        openingHours: (0, hours_1.formatOpeningHours)(place.data.result.current_opening_hours.weekday_text),
    };
    res.send(formattedPlace);
}));
const port = config_1.PORT || 3000;
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server running on port ${port}`);
}));
module.exports = app;
