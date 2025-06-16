import mongoose from "mongoose";
import Question from "../models/question.js";
import User from "../models/auth.js";
import { io } from "../index.js";

const PLAN_DETAILS = {
  free: { price: 0, dailyLimit: 1 },
  bronze: { price: 100, dailyLimit: 5 },
  silver: { price: 300, dailyLimit: 10 },
  gold: { price: 1000, dailyLimit: Infinity },
};

export const getAllQuestions = async (req, res) => {
  try {
    const qList = [];
    const allQList = await Question.find().sort({ askedOn: -1 });
    allQList.forEach((q) => {
      qList.push(q);
    })
    return res.status(200).json(qList);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const askQuestion = async (req, res) => {
  const post = req.body;
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const plan = user.currentPlan || "free";
    const dailyLimit = PLAN_DETAILS[plan].dailyLimit;
    // Get today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysCount = await Question.countDocuments({
      userId,
      askedOn: { $gte: startOfDay, $lte: endOfDay },
    });

    if (todaysCount >= dailyLimit) {
      return res.status(403).json({
        message: `Daily Question Limit Reached (${dailyLimit} For ${plan.toUpperCase()} Plan)`,
      });
    }
    const newQuestion = new Question({ ...post, userId, askedOn: new Date() });
    await newQuestion.save();
    return res.status(200).json({ message: "Question Added Successfully" });
  } catch (error) {
    return res.status(409).json({ message: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No question with that ID");
  }
  try {
    await Question.findByIdAndDelete(_id);
    return res.status(200).json({ message: "Question Deleted Successfully" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

export const voteQuestion = async (req, res) => {
  const { id: _id } = req.params;
  const { value } = req.body;
  const userId = req.userId;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No question with that ID");
  }
  try {
    const question = await Question.findById(_id);
    if (!question) return res.status(404).send("Question not found");

    const upIndex = question.upVotes.indexOf(userId);
    const downIndex = question.downVotes.indexOf(userId);

    if (value === "upVote") {
      if(upIndex === -1){
        question.upVotes.push(userId);
        if(downIndex !== -1) {
          question.downVotes = question.downVotes.filter((id) => id !== userId);
        }
      }
      else{
        question.upVotes = question.upVotes.filter((id) => id !== userId);
      }
    }
    else if (value === "downVote") {
      if(downIndex === -1){
        question.downVotes.push(userId);
        if(upIndex !== -1) {
          question.upVotes = question.upVotes.filter((id) => id !== userId);
        }
      }
      else{
        question.downVotes = question.downVotes.filter((id) => id !== userId);
      }
    }
    await question.save();

    const questionOwner = await User.findById(question.userId);
    const voter = await User.findById(userId);
    if (questionOwner?.notificationEnabled) {
      io.to(question.userId).emit("notification", {
        title: "New Vote",
        message: `${voter.name} voted on your question.`,
      });
    }

    return res.status(200).json({ message: "Voted Successfully" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}