import React from "react";
import { Link } from "react-router-dom";
import "./PaymentStatus.css";

export default function SuccessPage() {
  return (
    <div className="payment-status">
      <h2>🎉 Payment Successful!</h2>
      <p>Thank you for shopping with Flowtoo.</p>
      <Link to="/">Return to Store</Link>
    </div>
  );
}