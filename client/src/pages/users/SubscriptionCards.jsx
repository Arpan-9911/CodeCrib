import React from 'react'
import { useDispatch } from 'react-redux';
import { subscribe, verifySubscription } from '../../action/subscription';

const SubscriptionCards = ({currentUser}) => {
  const dispatch = useDispatch();
  const plans = [
    { name: "Free", price: 0, limit: "1 Q/day", plan: "free" },
    { name: "Bronze", price: 100, limit: "5 Q/day", plan: "bronze" },
    { name: "Silver", price: 300, limit: "10 Q/day", plan: "silver" },
    { name: "Gold", price: 1000, limit: "Unlimited", plan: "gold" },
  ];
  const currentPlan = currentUser && (currentUser?.currentPlan || "free");
  // alert(currentPlan)

  const handleSubscribe = async (plan) => {
    try {
      if (plan === "free") {
        alert("Already Using A Plan");
        return;
      }
      const data = await dispatch(subscribe(plan));
      if (!data?.order) throw new Error("Order Data Not Received");
      openRazorpay(data.order, plan);
    } catch (error) {
      alert(error.message);
    }
  };

  const openRazorpay = (order, plan) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: order.amount,
      currency: "INR",
      name: "CodeCrib",
      description: `${plan.toUpperCase()} Plan`,
      order_id: order.id,
      handler: async (response) => {
        try {
          await dispatch(verifySubscription({
            plan,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          }));
          alert("Subscription Successful! Check Your Email for Invoice.");
        } catch (err) {
          alert(err.message);
        }
      },
      prefill: {
        name: currentUser?.result?.name,
        email: currentUser?.result?.email,
      },
      theme: {
        color: "#4f46e5",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Subscription Plans</h1>
      <div className="grid sm:grid-cols-2 gap-2">
        {plans.map((item, index) => (
          <div
            key={index}
            className={`border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-all ${
              currentPlan === item.plan ? "bg-indigo-200" : ""}`}
          >
            <h2 className="text-lg font-bold mb-1">{item.name} Plan</h2>
            <p className="text-gray-600 mb-1">₹{item.price}/month</p>
            <p className="text-sm text-gray-500 mb-2">Limit: {item.limit}</p>
            <button
              onClick={() => handleSubscribe(item.plan)}
              disabled={currentPlan === item.plan}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded text-sm"
            >
              {currentPlan === item.plan ? "Current Plan" : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubscriptionCards