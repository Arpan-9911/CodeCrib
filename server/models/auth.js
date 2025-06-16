import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    default: "",
  },
  tags: {
    type: [String],
    default: [],
  },
  joinedOn: {
    type: Date,
    default: Date.now,
  },
  points: {
    type: Number,
    default: 0,
  },
  friends: {
    type: [
      {
        name: String,
        userId: String,
      },
    ],
    default: [],
  },
  friendRequests: {
    type: [
      {
        name: String,
        userId: String,
      },
    ],
    default: [],
  },
  sentRequests: {
    type: [
      {
        name: String,
        userId: String,
      },
    ],
    default: [],
  },
  currentPlan: {
    type: String,
    enum: ["free", "bronze", "silver", "gold"],
    default: "free",
  },
  notificationEnabled: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("User", userSchema);