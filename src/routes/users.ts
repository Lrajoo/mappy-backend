import express from "express";
import { createNewUser, getUser } from "../controllers/users";

const router = express.Router();

router.post("/", createNewUser);
router.get("/:userName", getUser);

export default router;
