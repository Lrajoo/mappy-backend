import express from "express";
import placesController from "../controllers/places";

const router = express.Router();

router.get("/", placesController);

export default router;
