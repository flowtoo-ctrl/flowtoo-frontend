import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CartPage.css";

export default function CartPage() {
  const navigate = useNavigate();
  const cartContext = useCart();

  // SAFE ACCESS — prevents crash if provider missing
  const cart = Array.isArray(cartContext?.cart) ? cartContext.cart : [];
  const removeFromCart = cartContext?.removeFromCart || (() => {});
  const clearCart = cartContext?.clearCart || (() => {});

  // SAFE TOTAL CALCULATION
  const total = cart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity || item.qty || 1);
    return sum + price * qty;
  }, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="cart-page-container">
      <h1>Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/" className="back-to-shop">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Action</span>
            </div>

            {cart.map((item) => (
              <div key={item._id} className="cart-row">
                <div className="cart-product">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <span>{item.name}</span>
                </div>
                <span>R{Number(item.price).toFixed(2)}</span>
                <span>{item.quantity || item.qty || 1}</span>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <p>
              Total: <strong>R{total.toFixed(2)}</strong>
            </p>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <button className="clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}