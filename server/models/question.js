import mongoose from "mongoose";

const questionSchema = mongoose.Schema({
  questionTitle: {
    type: String,
    required: true,
  },
  questionBody: {
    type: String,
    required: true,
  },
  questionTags: {
    type: [String],
    default: [],
  },
  userPosted: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  askedOn: {
    type: Date,
    default: Date.now,
  },
  upVotes: {
    type: [String],
    default: [],
  },
  downVotes: {
    type: [String],
    default: [],
  },
  noOfAnswers: {
    type: Number,
    default: 0,
  },
  answer: [
    {
      answerBody: String,
      userAnswered: String,
      userId: String,
      answeredOn: {
        type: Date,
        default: Date.now,
      },
      upVotes: {
        type: [String],
        default: [],
      },
      downVotes: {
        type: [String],
        default: [],
      },
    },
  ],
});

export default mongoose.model("Question", questionSchema);