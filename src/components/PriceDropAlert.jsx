import React, { useState } from "react";
import { FaBell, FaCheck, FaTimes } from "react-icons/fa";
import "./PriceDropAlert.css";

export default function PriceDropAlert({ productId, productName, currentPrice }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [targetPrice, setTargetPrice] = useState(Math.round(currentPrice * 0.9));
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email || !targetPrice) {
      setMessage("Please fill in all fields");
      return;
    }

    if (targetPrice >= currentPrice) {
      setMessage("Target price must be lower than current price");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/price-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          productName,
          currentPrice,
          targetPrice,
          email,
        }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setMessage("✓ Price alert activated! We'll notify you when the price drops.");
        setTimeout(() => {
          setShowForm(false);
          setMessage("");
        }, 2000);
      } else {
        setMessage("Failed to set price alert. Please try again.");
      }
    } catch (err) {
      setMessage("Error setting price alert");
      console.error(err);
    }
  };

  const handleUnsubscribe = () => {
    setIsSubscribed(false);
    setShowForm(false);
    setMessage("");
  };

  return (
    <div className="price-drop-alert">
      {!isSubscribed ? (
        <>
          <button
            className="alert-trigger-btn"
            onClick={() => setShowForm(!showForm)}
          >
            <FaBell /> Get Price Drop Alert
          </button>

          {showForm && (
            <div className="alert-form-container animate-slideInRight">
              <div className="alert-form-header">
                <h4>Price Drop Alert</h4>
                <button
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubscribe} className="alert-form">
                <div className="form-group">
                  <label>Product: {productName}</label>
                  <p className="current-price">Current Price: R{currentPrice.toFixed(2)}</p>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="targetPrice">Target Price (R)</label>
                  <div className="price-input-group">
                    <input
                      type="number"
                      id="targetPrice"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(parseFloat(e.target.value))}
                      step="10"
                      required
                    />
                    <span className="discount-badge">
                      {Math.round(((currentPrice - targetPrice) / currentPrice) * 100)}% off
                    </span>
                  </div>
                </div>

                <div className="price-range-slider">
                  <input
                    type="range"
                    min="0"
                    max={currentPrice}
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(parseFloat(e.target.value))}
                    className="slider"
                  />
                  <div className="slider-labels">
                    <span>R0</span>
                    <span>R{currentPrice.toFixed(2)}</span>
                  </div>
                </div>

                {message && (
                  <div className={`message ${message.includes("✓") ? "success" : "error"}`}>
                    {message}
                  </div>
                )}

                <button type="submit" className="btn-subscribe">
                  <FaBell /> Subscribe to Alert
                </button>

                <p className="alert-info">
                  💌 We'll send you an email notification when the price drops to R{targetPrice.toFixed(2)} or lower.
                </p>
              </form>
            </div>
          )}
        </>
      ) : (
        <div className="alert-success-state animate-fadeIn">
          <div className="success-icon">
            <FaCheck />
          </div>
          <h4>Alert Active!</h4>
          <p>You'll be notified when {productName} drops to R{targetPrice.toFixed(2)}</p>
          <button
            className="btn-unsubscribe"
            onClick={handleUnsubscribe}
          >
            Remove Alert
          </button>
        </div>
      )}
    </div>
  );
}
