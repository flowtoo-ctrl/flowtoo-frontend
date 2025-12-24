import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const cartContext = useCart() || {};
  const cartItems = Array.isArray(cartContext.cartItems) ? cartContext.cartItems : Array.isArray(cartContext.cart) ? cartContext.cart : [];
  const cartCount = cartItems.reduce((acc, item) => acc + (Number(item.qty || item.quantity || 0)), 0);

  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMobileOpen(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="vibrant-navbar">
        <div className="navbar-container">
          {/* Left: Hamburger (mobile) + Logo */}
          <div className="navbar-left">
            <div className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
            </div>
            <Link to="/" className="navbar-logo">
              Flowtoo
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="navbar-search">
            <div className="search-wrapper">
              <FaSearch className="search-icon-inside" size={20} />
              <input type="text" placeholder="Search for amazing products..." className="search-input" />
            </div>
          </div>

          {/* Right: Cart + Profile */}
          <div className="navbar-right">
            <Link to="/cart" className="icon-wrapper cart-icon">
              <FaShoppingCart size={28} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            {user ? (
              <div className="icon-wrapper" onClick={handleLogout}>
                <FaUser size={28} />
              </div>
            ) : (
              <Link to="/login" className="icon-wrapper">
                <FaUser size={28} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/categories" onClick={() => setMobileOpen(false)}>Categories</Link>
          <Link to="/deals" onClick={() => setMobileOpen(false)}>Deals</Link>
          <Link to="/cart" onClick={() => setMobileOpen(false)}>Cart ({cartCount})</Link>
          {user ? (
            <div onClick={handleLogout}>Logout</div>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </>
  );
}