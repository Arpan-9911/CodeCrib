import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  plan: {
    type: String,
    enum: ["free", "bronze", "silver", "gold"],
    default: "free",
  },
  price: {
    type: Number,
    default: 0,
  },
  dailyLimit: {
    type: Number,
    default: 1,
  },
  subscribedOn: {
    type: Date,
    default: Date.now,
  },
  expiresOn: Date,
  paymentId: String,      // Razorpay payment ID
  orderId: String,        // Razorpay order ID
  subscriptionHistory: {
    type: [
      {
        paymentId: String,
        orderId: String,
        plan: String,
        price: Number,
        subscribedOn: Date,
        expiresOn: Date,
      }
    ],
    default: [],
  }
});

export default mongoose.model("Subscription", subscriptionSchema);
