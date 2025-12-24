import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaStar, FaShoppingCart, FaTruck, FaUndo } from "react-icons/fa";
import Loading, { LoadingSkeleton } from "../components/Loading";
import API from "../services/api";
import "./ProductDetails.css";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({});

  // Wrap fetchReviews in useCallback to make it stable
  const fetchReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const res = await API.get(`/products/${id}/reviews`);
      const reviewsData = Array.isArray(res.data) ? res.data : [];
      setReviews(reviewsData);
      calculateRatings(reviewsData);
    } catch (err) {
      console.error("Reviews error:", err);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const [prodRes, relRes] = await Promise.all([
          API.get(`/products/${id}`),
          API.get(`/products/${id}/related`)
        ]);

        setProduct(prodRes.data);
        setRelated(Array.isArray(relRes.data) ? relRes.data : []);
        fetchReviews(); // Now safe to call
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, fetchReviews]); // Now includes fetchReviews — warning gone

  const calculateRatings = (list) => {
    if (!list.length) {
      setAverageRating(0);
      setRatingDistribution({});
      return;
    }
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const sum = list.reduce((acc, r) => {
      dist[r.rating]++;
      return acc + r.rating;
    }, 0);
    setAverageRating((sum / list.length).toFixed(1));
    setRatingDistribution(dist);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("profile")) {
      alert("Please login to submit a review");
      navigate("/login");
      return;
    }

    try {
      setSubmittingReview(true);
      await API.post(`/products/${id}/reviews`, newReview);
      alert("Review submitted successfully!");
      setNewReview({ rating: 5, comment: "" });
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    alert(`Added ${quantity} item(s) to cart!`);
    setQuantity(1);
  };

  if (loading) return <Loading fullScreen message="Loading product details..." />;
  if (!product) return <div className="error-message">Product not found</div>;

  return (
    <div className="pdp-container">
      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/">Products</Link> / <span>{product.name}</span>
      </div>

      {/* MAIN PRODUCT SECTION */}
      <div className="pdp-main">
        <div className="image-gallery">
          <div className="main-image">
            <img src={product.image} alt={product.name} />
            {product.countInStock === 0 && <div className="out-of-stock-overlay">OUT OF STOCK</div>}
          </div>
          <div className="image-thumbnails">
            <img src={product.image} alt="thumb" className="thumbnail active" onClick={() => {}} />
          </div>
        </div>

        <div className="product-info-section">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <div className="rating-summary">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.round(averageRating) ? "star filled" : "star"} />
                ))}
              </div>
              <span className="rating-value">{averageRating}</span>
              <span className="review-count">({reviews.length} reviews)</span>
            </div>
          </div>

          <div className="price-section">
            <div className="price-display">
              <span className="currency">R</span>
              <span className="amount">{product.price?.toFixed(2)}</span>
            </div>
            <div className={`stock-status ${product.countInStock > 0 ? "in-stock" : "out-of-stock"}`}>
              {product.countInStock > 0 ? `In Stock (${product.countInStock})` : "Out of Stock"}
            </div>
          </div>

          <div className="description-section">
            <h3>Description</h3>
            <p>{product.description}</p>
            {product.brand && <p><strong>Brand:</strong> {product.brand}</p>}
            {product.category && <p><strong>Category:</strong> {product.category}</p>}
          </div>

          <div className="purchase-section">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-input">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
                <button onClick={() => setQuantity(q => Math.min(product.countInStock, q + 1))} disabled={quantity >= product.countInStock}>+</button>
              </div>
            </div>
            <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={product.countInStock === 0}>
              <FaShoppingCart /> Add to Cart
            </button>
          </div>

          <div className="shipping-info">
            <div className="info-item"><FaTruck /> <div><strong>Free Delivery</strong><p>On orders over R500</p></div></div>
            <div className="info-item"><FaUndo /> <div><strong>Easy Returns</strong><p>30-day return policy</p></div></div>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="reviews-container">
        <div className="reviews-header"><h2>Customer Reviews & Ratings</h2></div>

        <div className="reviews-content">
          <div className="rating-summary-box">
            <div className="average-rating">
              <div className="big-rating">{averageRating}</div>
              <div className="stars-large">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.round(averageRating) ? "star filled" : "star"} />
                ))}
              </div>
              <p>Based on {reviews.length} reviews</p>
            </div>

            <div className="rating-distribution">
              {[5, 4, 3, 2, 1].map((r) => (
                <div key={r} className="rating-bar">
                  <span>{r} stars</span>
                  <div className="bar-container">
                    <div className="bar-fill" style={{ width: `${reviews.length ? (ratingDistribution[r] / reviews.length) * 100 : 0}%` }}></div>
                  </div>
                  <span>{ratingDistribution[r] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="reviews-list">
            <h3>Customer Reviews</h3>
            {reviewsLoading ? <LoadingSkeleton count={3} height="100px" /> : reviews.length === 0 ? (
              <p>No reviews yet. Be the first!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="review-item">
                  <div className="review-header">
                    <strong>{review.name || "Anonymous"}</strong>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < review.rating ? "star filled" : "star"} />
                    ))}
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))
            )}
          </div>

          <div className="write-review-section">
            <h3>Write Your Review</h3>
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="form-group">
                <label>Rating *</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${newReview.rating >= star ? "active" : ""}`}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Your Review *</label>
                <textarea
                  placeholder="Share your experience..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                  minLength="10"
                  maxLength="500"
                  rows="5"
                />
                <p>{newReview.comment.length}/500</p>
              </div>
              <button type="submit" disabled={submittingReview || !newReview.comment}>
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="related-products-section">
        <h2>You Might Also Like</h2>
        <div className="related-products-grid">
          {related.map((p) => (
            <Link key={p._id} to={`/product/${p._id}`} className="related-product-card">
              <img src={p.image} alt={p.name} />
              <h4>{p.name}</h4>
              <p>R{p.price?.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}