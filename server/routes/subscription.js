import express from "express";
import { subscribe, verifySubscription } from "../controllers/subscription.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/subscribe", auth, subscribe);
router.post("/verify", auth, verifySubscription);

export default router;
