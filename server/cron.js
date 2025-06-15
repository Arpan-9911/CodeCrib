import cron from "node-cron";
import Subscription from "./models/subscription.js";
import User from "./models/auth.js";

cron.schedule("0 0 * * *", async () => {
  console.log("Running subscription reset task...");

  try {
    const now = new Date();
    const expiredSubscriptions = await Subscription.find({ expiresOn: { $lt: now } });

    for (const sub of expiredSubscriptions) {
      await User.findByIdAndUpdate(sub.userId, { currentPlan: "free" });

      sub.plan = "free";
      sub.price = 0;
      sub.dailyLimit = 1;
      sub.subscribedOn = now;
      sub.expiresOn = null;
      sub.paymentId = null;
      sub.orderId = null;
      await sub.save();
    }

    console.log(`Reset ${expiredSubscriptions.length} Expired Subscriptions.`);
  } catch (err) {
    console.error("Error Running Subscription Reset Cron:", err.message);
  }
});
