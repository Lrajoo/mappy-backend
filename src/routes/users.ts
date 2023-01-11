import express from "express";
import { createNewUser, getUser, getFriends, searchUsers, addFriend, updateRequest } from "../controllers/users";

const router = express.Router();

router.post("/", createNewUser);
router.get("/", searchUsers);
router.get("/:userName", getUser);
router.get("/:userName/friends", getFriends);
router.post("/friends", addFriend);
router.post("/friends/request", updateRequest);

export default router;
