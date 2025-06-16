import mongoose from "mongoose";
import Question from "../models/question.js";
import User from "../models/auth.js";
import { io } from "../index.js";

export const postAnswer = async (req, res) => {
  const { id: _id } = req.params;
  const { answerBody, userAnswered } = req.body;
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "Invalid Question ID" });
  }
  try{
    const question = await Question.findById(_id);
    if (!question) {
      return res.status(404).json({ message: "Question Not Found" });
    }
    question.answer.push({
      answerBody,
      userAnswered,
      userId,
    });
    question.noOfAnswers += 1;
    await question.save();
    await User.findByIdAndUpdate(userId, { $inc: { points: 5 } });

    const questionOwner = await User.findById(question.userId);
    if (questionOwner?.notificationEnabled) {
      io.to(question.userId).emit("notification", {
        title: "New Answer",
        message: `${userAnswered} answered your question.`,
      });
    }

    return res.status(200).json({ message: "Answer Added Successfully" });
  } catch (error) {
    return res.status(409).json({ message: error.message });
  }
}

export const deleteAnswer = async (req, res) => {
  const { id: _id } = req.params;
  const { answerId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "Invalid Question ID" });
  }
  try{
    const question = await Question.findById(_id);
    if (!question) {
      return res.status(404).json({ message: "Question Not Found" });
    }

    // 🔍 Find the answer before removing it
    const answer = question.answer.find((a) => a._id.toString() === answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer Not Found" });
    }
    const userId = answer.userId;

    question.answer = question.answer.filter((answer) => answer._id.toString() !== answerId);
    question.noOfAnswers -= 1;
    await question.save();

    await User.findByIdAndUpdate(userId, { $inc: { points: -5 } });

    return res.status(200).json({ message: "Answer Deleted Successfully" });
  } catch (error) {
    return res.status(409).json({ message: error.message });
  }
}

export const voteAnswer = async (req, res) => {
  const { id: _id } = req.params;
  const { answerId, value } = req.body;
  const userId = req.userId;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "Invalid Question ID" });
  }

  try{
    const question = await Question.findById(_id);
    if (!question) {
      return res.status(404).json({ message: "Question Not Found" });
    }
    const answer = question.answer.find((answer) => answer._id.toString() === answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer Not Found" });
    }

    const oldUpvoteCount = answer.upVotes.length;
    const upIndex = answer.upVotes.indexOf(userId);
    const downIndex = answer.downVotes.indexOf(userId);
    
    if (value === "upVote") {
      if (upIndex === -1) {
        answer.upVotes.push(userId);
        if (downIndex !== -1) {
          answer.downVotes = answer.downVotes.filter((id) => id !== userId);
        }
      } else {
        answer.upVotes = answer.upVotes.filter((id) => id !== userId);
      }
    } else if (value === "downVote") {
      if (downIndex === -1) {
        answer.downVotes.push(userId);
        if (upIndex !== -1) {
          answer.upVotes = answer.upVotes.filter((id) => id !== userId);
        }
      } else {
        answer.downVotes = answer.downVotes.filter((id) => id !== userId);
      }
    }

    const newUpvoteCount = answer.upVotes.length;
    const oldMilestone = Math.floor(oldUpvoteCount / 5);
    const newMilestone = Math.floor(newUpvoteCount / 5);
    const diff = newMilestone - oldMilestone;
    if (diff !== 0) {
      await User.findByIdAndUpdate(answer.userId, { $inc: { points: diff * 5 } });
    }

    await question.save();

    const answerOwner = await User.findById(answer.userId);
    const voter = await User.findById(userId);
    if (answerOwner?.notificationEnabled) {
      io.to(answer.userId.toString()).emit("notification", {
        title: "Answer Voted",
        message: `${voter.name} voted on your answer`,
      });
    }

    return res.status(200).json({ message: "Answer Voted Successfully" });
  } catch (error) {
    return res.status(409).json({ message: error.message });
  }
}