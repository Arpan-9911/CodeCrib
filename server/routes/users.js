import express from "express";
import { getAllUsers, updateUser, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend, sharePoints } from "../controllers/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/get", getAllUsers);
router.patch("/update/:id", auth, updateUser);
router.patch("/sendFriendRequest", auth, sendFriendRequest);
router.patch("/acceptFriendRequest", auth, acceptFriendRequest);
router.patch("/rejectFriendRequest", auth, rejectFriendRequest);
router.patch("/removeFriend", auth, removeFriend);
router.post("/sharePoints", auth, sharePoints);

export default router;