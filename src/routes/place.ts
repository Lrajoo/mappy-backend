import express from "express";
import placeController from "../controllers/place";

const router = express.Router();

router.get("/:placeID", placeController);

export default router;
