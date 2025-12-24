import React from "react";
import { Link } from "react-router-dom";
import "./PaymentStatus.css";

export default function CancelPage() {
  return (
    <div className="payment-status">
      <h2>⚠️ Payment Cancelled</h2>
      <p>Your order was not completed. You can try again anytime.</p>
      <Link to="/cart">Back to Cart</Link>
    </div>
  );
}