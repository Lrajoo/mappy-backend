import express from "express";
import { getLocations, postLocations, deleteLocations } from "../controllers/locations";

const router = express.Router();

router.get("/", getLocations);
router.post("/", postLocations);
router.delete("/:placeId", deleteLocations);

export default router;
