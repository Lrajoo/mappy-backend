import express from "express";
import usersController from "../controllers/users";

const router = express.Router();

router.post("/", usersController);

export default router;
