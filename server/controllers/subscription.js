import Razorpay from "razorpay";
import crypto from "crypto";
import Subscription from "../models/subscription.js";
import User from "../models/auth.js";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PLAN_DETAILS = {
  bronze: { price: 100, dailyLimit: 5 },
  silver: { price: 300, dailyLimit: 10 },
  gold: { price: 1000, dailyLimit: Infinity },
};

export const subscribe = async (req, res) => {
  const { plan } = req.body;
  const userId = req.userId;
  if (!PLAN_DETAILS[plan]) {
    return res.status(400).json({ message: "Invalid Plan" });
  }
  const { price } = PLAN_DETAILS[plan];
  try {
    const order = await razorpay.orders.create({
      amount: price * 100,
      currency: "INR",
    });
    res.status(200).json({ order });
  } catch (err) {
    res.status(500).json({ message: "Failed to Create Order" });
  }
}

export const verifySubscription = async (req, res) => {
  const { plan, paymentId, orderId, signature } = req.body;
  const userId = req.userId;

  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }
  try{
    const { price, dailyLimit } = PLAN_DETAILS[plan];
    const now = new Date();
    const expiresOn = new Date(now);
    expiresOn.setMonth(expiresOn.getMonth() + 1);

    let subscription = await Subscription.findOne({ userId });

    const historyEntry = {
      paymentId,
      orderId,
      plan,
      price,
      subscribedOn: now,
      expiresOn,
    };

    if (subscription) {
      subscription.plan = plan;
      subscription.price = price;
      subscription.dailyLimit = dailyLimit;
      subscription.subscribedOn = now;
      subscription.expiresOn = expiresOn;
      subscription.paymentId = paymentId;
      subscription.orderId = orderId;
      subscription.subscriptionHistory.push(historyEntry);
    } else {
      subscription = new Subscription({
        userId,
        plan,
        price,
        dailyLimit,
        subscribedOn: now,
        expiresOn,
        paymentId,
        orderId,
        subscriptionHistory: [historyEntry],
      });
    }
    await subscription.save();
    await User.findByIdAndUpdate(userId, { currentPlan: plan });

    User.findById(userId).then((user) => {
      sendSubscriptionMail(user.email, user.name, plan, expiresOn, paymentId, orderId);
    }).catch((err) => {
      console.error("Failed to fetch user or send mail:", err);
    });

    res.status(200).json({ message: "Subscription Verified" });
  } catch {
    res.status(500).json({ message: "Subscription verification failed" });
  }
}

const generateInvoicePDF = (name, plan, price, paymentId, orderId, subscribedOn, expiresOn) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = new PassThrough();
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    doc.fontSize(20).text("CodeCrib Invoice", { align: "center" }).moveDown();
    doc.fontSize(12).text(`Name: ${name}`);
    doc.text(`Plan: ${plan.toUpperCase()}`);
    doc.text(`Price: Rs. ${price}`);
    doc.text(`Order ID: ${orderId}`);
    doc.text(`Payment ID: ${paymentId}`);
    doc.text(`Subscribed On: ${subscribedOn.toDateString()}`);
    doc.text(`Valid Until: ${expiresOn.toDateString()}`);
    doc.text("Thank you for your purchase!", { align: "center" });

    doc.end();
  });
};

const sendSubscriptionMail = async (to, name, plan, expiresOn, paymentId, orderId) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const subscribedOn = new Date();
    const price = PLAN_DETAILS[plan].price;

    const invoicePDF = await generateInvoicePDF(name, plan, price, paymentId, orderId, subscribedOn, expiresOn);

    const mailOptions = {
      from: `"CodeCrib" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Your ${plan.toUpperCase()} Plan Subscription is Active`,
      html: `
        <h3>Hello ${name},</h3>
        <p>Thank you for subscribing to the <strong>${plan.toUpperCase()}</strong> plan on <strong>CodeCrib</strong>.</p>
        
        <h4>Subscription Details:</h4>
        <ul>
          <li><strong>Plan:</strong> ${plan.toUpperCase()}</li>
          <li><strong>Price:</strong> ₹${price}</li>
          <li><strong>Order ID:</strong> ${orderId}</li>
          <li><strong>Payment ID:</strong> ${paymentId}</li>
          <li><strong>Subscribed On:</strong> ${subscribedOn.toDateString()}</li>
          <li><strong>Valid Until:</strong> ${expiresOn.toDateString()}</li>
        </ul>

        <p>Keep this email for your records. If you have any questions, just reply to this email.</p>

        <br/>
        <p>Happy learning!</p>
        <p><strong>– CodeCrib Team</strong></p>
      `,
      attachments: [
        {
          filename: `CodeCrib_Invoice_${plan}_${Date.now()}.pdf`,
          content: invoicePDF,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    return;
  } catch (err) {
    console.error("Failed to send subscription email:", err);
  }
};