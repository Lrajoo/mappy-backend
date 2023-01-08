import express from "express";
import verifyController from "../controllers/verify";

const router = express.Router();

router.post("/", verifyController);

export default router;
