import mongoose from "mongoose";

const socialSchema = mongoose.Schema({
  userId:{
    type: String,
    required: true,
  },
  name:{
    type: String,
    required: true,
  },
  postedOn: {
    type: Date,
    default: Date.now,
  },
  content:{
    type: String,
    default: "",
  },
  media:{
    type: [
      {
        url: String,
        type: {
          type: String,
          enum: ["image", "video"],
        },
      },
    ],
    default: [],
  },
  likes:{
    type: [String],
    default: [],
  },
  comments:{
    type: [
      {
        userId: String,
        name: String,
        content: String,
        createdAt:{
          type: Date,
          default: Date.now
        },
      },
    ],
    default: [],
  },
  sharedBy:{
    type: [String],
    default: [],
  },
});

export default mongoose.model("Social", socialSchema);