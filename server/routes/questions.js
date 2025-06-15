import express from "express"
import { getAllQuestions, askQuestion, deleteQuestion, voteQuestion } from "../controllers/questions.js"
import auth from "../middleware/auth.js"

const router = express.Router();

router.get("/get", getAllQuestions);
router.post("/ask", auth, askQuestion);
router.delete("/delete/:id", auth, deleteQuestion);
router.patch("/vote/:id", auth, voteQuestion);

export default router