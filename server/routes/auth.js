import express from "express";
import { signUp, login, googleLogin } from "../controllers/auth.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/googleLogin", googleLogin);

export default router;