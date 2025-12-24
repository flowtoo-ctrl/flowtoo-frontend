import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import Loading from "../components/Loading";
import { useCart } from "../context/CartContext";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const navigate = useNavigate();
  // be permissive about what the CartContext provides
  const cartContext = useCart() || {};
  const { cartItems: ctxCartItems, cart: ctxCart, getTotalPrice: ctxGetTotalPrice, clearCart: ctxClearCart } = cartContext;

  // normalize cart items to an array (defensive)
  const cartItems = Array.isArray(ctxCartItems)
    ? ctxCartItems
    : Array.isArray(ctxCart)
    ? ctxCart
    : [];

  // safe utility for subtotal (if getTotalPrice exists and is a function use it; otherwise compute)
  const getTotalPrice = typeof ctxGetTotalPrice === "function"
    ? ctxGetTotalPrice
    : () => cartItems.reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 0)), 0);

  const clearCart = typeof ctxClearCart === "function" ? ctxClearCart : () => {};

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirm
  const [errors, setErrors] = useState({});
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("payfast");

  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    // Shipping Address
    address: "",
    city: "",
    province: "",
    postalCode: "",
    country: "South Africa",
    // Billing Address
    sameAsShipping: true,
    billingAddress: "",
    billingCity: "",
    billingProvince: "",
    billingPostalCode: "",
  });

  const shippingCosts = {
    standard: 60,
    express: 150,
    overnight: 300,
  };

  const provinces = [
    "Eastern Cape",
    "Free State",
    "Gauteng",
    "KwaZulu-Natal",
    "Limpopo",
    "Mpumalanga",
    "Northern Cape",
    "North West",
    "Western Cape",
  ];

  // Redirect if no items in cart (use defensive cartItems array)
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems.length, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.province) newErrors.province = "Province is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";

    if (!formData.sameAsShipping) {
      if (!formData.billingAddress.trim()) newErrors.billingAddress = "Billing address is required";
      if (!formData.billingCity.trim()) newErrors.billingCity = "Billing city is required";
      if (!formData.billingProvince) newErrors.billingProvince = "Billing province is required";
      if (!formData.billingPostalCode.trim()) newErrors.billingPostalCode = "Billing postal code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in before placing an order.");
        navigate("/login");
        setLoading(false);
        return;
      }

      // FIXED: CORRECT PRICE CALCULATION
      const subtotal = cartItems.reduce((acc, item) => {
        const price = Number(item.price) || 0;
        const qty = Number(item.qty || item.quantity || 1);
        return acc + price * qty;
      }, 0);

      const shippingPrice = shippingCosts[shippingMethod] || 0;
      const tax = subtotal * 0.15;
      const total = subtotal + shippingPrice + tax;

      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.quantity || item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        billingAddress: formData.sameAsShipping
          ? {
              firstName: formData.firstName,
              lastName: formData.lastName,
              address: formData.address,
              city: formData.city,
              province: formData.province,
              postalCode: formData.postalCode,
              country: formData.country,
            }
          : {
              firstName: formData.firstName,
              lastName: formData.lastName,
              address: formData.billingAddress,
              city: formData.billingCity,
              province: formData.billingProvince,
              postalCode: formData.billingPostalCode,
              country: formData.country,
            },
        shippingMethod,
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice,
        totalPrice: total,
        userEmail: formData.email,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errBody = await response.text().catch(() => null);
        throw new Error(errBody || "Failed to create order");
      }

      const respJson = await response.json();
      const createdOrder = respJson.data || respJson;

      if (paymentMethod === "payfast") {
        const payfastResponse = await fetch(`/api/orders/${createdOrder._id}/payfast`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (payfastResponse.ok) {
          const pf = await payfastResponse.json();
          const payfastUrl = pf.payfastUrl || pf.url || pf.redirectUrl;
          clearCart();
          if (payfastUrl) {
            window.location.href = payfastUrl;
            return;
          }
          throw new Error("PayFast initialization did not return a redirect URL.");
        } else {
          const errText = await payfastResponse.text().catch(() => "");
          throw new Error(errText || "Failed to initialize PayFast");
        }
      } else {
        clearCart();
        navigate(`/order/${createdOrder._id}`, { state: { success: true } });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to process order. Please try again.");
      setLoading(false);
    }
  };

  // show loading / redirect if cart is empty (defensive)
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return <Loading fullScreen message="Redirecting to cart..." />;
  }

  // CORRECT TOTALS — NOW SHOWS PROPERLY IN SIDEBAR
  const subtotal = cartItems.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.qty || item.quantity || 1);
    return acc + price * qty;
  }, 0);

  const shippingPrice = shippingCosts[shippingMethod] || 0;
  const tax = subtotal * 0.15;
  const total = subtotal + shippingPrice + tax;

  return (
    <div className="checkout-container">
      {/* HEADER */}
      <div className="checkout-header">
        <h1>Secure Checkout</h1>
        <p>Complete your purchase safely</p>
      </div>

      {/* PROGRESS INDICATOR */}
      <div className="progress-indicator">
        <div className={`step ${step >= 1 ? "active" : ""}`}>
          <div className="step-number">1</div>
          <p>Shipping</p>
        </div>
        <div className="step-line" />
        <div className={`step ${step >= 2 ? "active" : ""}`}>
          <div className="step-number">2</div>
          <p>Payment</p>
        </div>
        <div className="step-line" />
        <div className={`step ${step >= 3 ? "active" : ""}`}>
          <div className="step-number">3</div>
          <p>Confirm</p>
        </div>
      </div>

      <div className="checkout-wrapper">
        {/* MAIN CONTENT */}
        <div className="checkout-main">
          <form onSubmit={handleSubmitOrder}>
            {/* STEP 1: SHIPPING */}
            {step === 1 && (
              <div className="checkout-step">
                <h2>Shipping Information</h2>

                {/* PERSONAL INFO */}
                <div className="form-section">
                  <h3>Personal Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className={errors.firstName ? "error" : ""}
                      />
                      {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className={errors.lastName ? "error" : ""}
                      />
                      {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={errors.email ? "error" : ""}
                      />
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+27 123 456 7890"
                        className={errors.phone ? "error" : ""}
                      />
                      {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>
                  </div>
                </div>

                {/* SHIPPING ADDRESS */}
                <div className="form-section">
                  <h3>Shipping Address</h3>
                  <div className="form-group">
                    <label>Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                      className={errors.address ? "error" : ""}
                    />
                    {errors.address && <span className="error-text">{errors.address}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Johannesburg"
                        className={errors.city ? "error" : ""}
                      />
                      {errors.city && <span className="error-text">{errors.city}</span>}
                    </div>
                    <div className="form-group">
                      <label>Province *</label>
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className={errors.province ? "error" : ""}
                      >
                        <option value="">Select Province</option>
                        {provinces.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      {errors.province && <span className="error-text">{errors.province}</span>}
                    </div>
                    <div className="form-group">
                      <label>Postal Code *</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="2000"
                        className={errors.postalCode ? "error" : ""}
                      />
                      {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
                    </div>
                  </div>
                </div>

                {/* BILLING ADDRESS */}
                <div className="form-section">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="sameAsShipping"
                      name="sameAsShipping"
                      checked={formData.sameAsShipping}
                      onChange={handleChange}
                    />
                    <label htmlFor="sameAsShipping">Billing address same as shipping</label>
                  </div>

                  {!formData.sameAsShipping && (
                    <>
                      <h3>Billing Address</h3>
                      <div className="form-group">
                        <label>Street Address *</label>
                        <input
                          type="text"
                          name="billingAddress"
                          value={formData.billingAddress}
                          onChange={handleChange}
                          placeholder="123 Main Street"
                          className={errors.billingAddress ? "error" : ""}
                        />
                        {errors.billingAddress && <span className="error-text">{errors.billingAddress}</span>}
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>City *</label>
                          <input
                            type="text"
                            name="billingCity"
                            value={formData.billingCity}
                            onChange={handleChange}
                            placeholder="Johannesburg"
                            className={errors.billingCity ? "error" : ""}
                          />
                          {errors.billingCity && <span className="error-text">{errors.billingCity}</span>}
                        </div>
                        <div className="form-group">
                          <label>Province *</label>
                          <select
                            name="billingProvince"
                            value={formData.billingProvince}
                            onChange={handleChange}
                            className={errors.billingProvince ? "error" : ""}
                          >
                            <option value="">Select Province</option>
                            {provinces.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                          {errors.billingProvince && <span className="error-text">{errors.billingProvince}</span>}
                        </div>
                        <div className="form-group">
                          <label>Postal Code *</label>
                          <input
                            type="text"
                            name="billingPostalCode"
                            value={formData.billingPostalCode}
                            onChange={handleChange}
                            placeholder="2000"
                            className={errors.billingPostalCode ? "error" : ""}
                          />
                          {errors.billingPostalCode && <span className="error-text">{errors.billingPostalCode}</span>}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* SHIPPING METHOD */}
                <div className="form-section">
                  <h3>Shipping Method</h3>
                  <div className="shipping-options">
                    {Object.entries(shippingCosts).map(([method, cost]) => (
                      <label key={method} className="shipping-option">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={method}
                          checked={shippingMethod === method}
                          onChange={(e) => setShippingMethod(e.target.value)}
                        />
                        <div className="option-content">
                          <strong>{method.charAt(0).toUpperCase() + method.slice(1)} Delivery</strong>
                          <p>R{cost.toFixed(2)}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PAYMENT */}
            {step === 2 && (
              <div className="checkout-step">
                <h2>Payment Method</h2>

                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="payfast"
                      checked={paymentMethod === "payfast"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="option-content">
                      <strong>PayFast</strong>
                      <p>Secure online payment with PayFast</p>
                    </div>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="eft"
                      checked={paymentMethod === "eft"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="option-content">
                      <strong>Bank Transfer (EFT)</strong>
                      <p>Direct bank transfer to our account</p>
                    </div>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="option-content">
                      <strong>Cash on Delivery</strong>
                      <p>Pay when your order arrives</p>
                    </div>
                  </label>
                </div>

                <div className="payment-info">
                  <FaLock className="lock-icon" />
                  <p>Your payment information is secure and encrypted</p>
                </div>
              </div>
            )}

            {/* STEP 3: CONFIRM */}
            {step === 3 && (
              <div className="checkout-step">
                <h2>Review Your Order</h2>

                <div className="review-section">
                  <h3>Shipping To</h3>
                  <p>
                    {formData.firstName} {formData.lastName}
                    <br />
                    {formData.address}
                    <br />
                    {formData.city}, {formData.province} {formData.postalCode}
                    <br />
                    {formData.country}
                  </p>
                </div>

                <div className="review-section">
                  <h3>Shipping Method</h3>
                  <p>
                    {shippingMethod.charAt(0).toUpperCase() + shippingMethod.slice(1)} Delivery - R
                    {shippingPrice.toFixed(2)}
                  </p>
                </div>

                <div className="review-section">
                  <h3>Payment Method</h3>
                  <p>
                    {paymentMethod === "payfast"
                      ? "PayFast"
                      : paymentMethod === "eft"
                      ? "Bank Transfer (EFT)"
                      : "Cash on Delivery"}
                  </p>
                </div>

                <div className="review-section">
                  <h3>Order Items</h3>
                  {cartItems.map((item) => (
                    <div key={item._id || item.id} className="review-item">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <p>{item.name}</p>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <span>R{(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="terms-checkbox">
                  <input type="checkbox" id="terms" required />
                  <label htmlFor="terms">I agree to the Terms and Conditions and Privacy Policy</label>
                </div>
              </div>
            )}

            {/* NAVIGATION BUTTONS */}
            <div className="checkout-buttons">
              {step > 1 && (
                <button type="button" className="btn-secondary" onClick={handlePrevStep}>
                  Back
                </button>
              )}

              {step < 3 ? (
                <button type="button" className="btn-primary" onClick={handleNextStep}>
                  Continue to {step === 1 ? "Payment" : "Review"}
                </button>
              ) : (
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Processing..." : "Place Order"}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* SIDEBAR: ORDER SUMMARY — NOW SHOWS CORRECT TOTAL */}
        <div className="checkout-sidebar">
          <div className="order-summary">
            <h3>Order Summary</h3>

            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item._id || item.id} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    <p className="item-qty">Qty: {item.quantity}</p>
                  </div>
                  <p className="item-price">R{(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="summary-divider" />

            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>R{subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax (15%)</span>
                <span>R{tax.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>R{shippingPrice.toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>R{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="security-badge">
              <FaLock /> Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}