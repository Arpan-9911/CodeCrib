import express from "express"
import { postAnswer, deleteAnswer, voteAnswer } from "../controllers/answers.js";
import auth from "../middleware/auth.js"

const router = express.Router();
router.post("/post/:id", auth, postAnswer);
router.delete("/delete/:id", auth, deleteAnswer);
router.patch("/vote/:id", auth, voteAnswer);

export default router