import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./WishlistButton.css";

export default function WishlistButton({ product, size = "medium" }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsWishlisted(wishlist.some(item => item._id === product._id));
  }, [product._id]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

      if (isWishlisted) {
        // Remove from wishlist
        const updatedWishlist = wishlist.filter(item => item._id !== product._id);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setIsWishlisted(false);

        // Sync with backend if user is logged in
        if (token) {
          await fetch(`/api/wishlist/${product._id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      } else {
        // Add to wishlist
        const updatedWishlist = [...wishlist, product];
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setIsWishlisted(true);

        // Sync with backend if user is logged in
        if (token) {
          await fetch("/api/wishlist", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId: product._id }),
          });
        }
      }
    } catch (error) {
      console.error("Wishlist error:", error);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    small: "wishlist-btn-small",
    medium: "wishlist-btn-medium",
    large: "wishlist-btn-large",
  };

  return (
    <button
      className={`wishlist-btn ${sizeClasses[size]} ${isWishlisted ? "active" : ""}`}
      onClick={handleWishlistToggle}
      disabled={loading}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isWishlisted ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
}
