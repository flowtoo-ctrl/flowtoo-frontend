import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import API from "../services/api";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);

const StripeCheckoutButton = ({ orderId }) => {
  const handleStripe = async () => {
    try {
      const { data } = await API.post(`/orders/${orderId}/stripe`);
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
      if (error) alert(error.message);
    } catch (err) {
      alert("Payment failed: " + err.message);
    }
  };

  return (
    <button onClick={handleStripe} className="btn btn-primary">
      Pay with Card (Stripe)
    </button>
  );
};

export default StripeCheckoutButton;