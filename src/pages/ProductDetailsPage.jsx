import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import StarRating from "../components/StarRating";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);

        const relatedRes = await fetch(
          `http://localhost:5000/api/products/${id}/related`
        );
        const relatedData = await relatedRes.json();
        setRelated(relatedData);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) return alert("Please login to write a review");

    const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ rating, comment }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Review submitted successfully!");
      setRating("");
      setComment("");
      window.location.reload();
    } else {
      alert(data.message || "Error submitting review");
    }
  };

  const deleteReview = async (reviewId) => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user?.isAdmin) return alert("Admins only");

    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    const res = await fetch(
      `http://localhost:5000/api/products/${id}/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    if (res.ok) {
      alert("Review deleted");
      window.location.reload();
    } else {
      alert("Failed to delete review");
    }
  };

  if (loading) return <h2 className="text-center mt-10">Loading...</h2>;
  if (!product) return <h2 className="text-center mt-10">Product not found</h2>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Product Details */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[400px] object-cover rounded-xl shadow-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <StarRating value={product.rating || 0} />
          <p className="text-gray-600 mt-3">{product.description}</p>

          <div className="mt-4">
            <p className="text-2xl font-semibold text-green-700">
              R{product.price}
            </p>
            <p className="text-gray-500 text-sm">
              {product.countInStock > 0
                ? `${product.countInStock} in stock`
                : "Out of stock"}
            </p>
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product.countInStock === 0}
            className={`mt-5 px-6 py-2 rounded-xl text-white font-semibold ${
              product.countInStock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        {product.reviews?.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          product.reviews.map((r) => (
            <div
              key={r._id}
              className="border p-3 rounded-lg mb-3 shadow-sm bg-white"
            >
              <div className="flex justify-between items-center">
                <strong>{r.name}</strong>
                <StarRating value={r.rating} />
              </div>
              <p className="text-gray-700 mt-1">{r.comment}</p>

              {JSON.parse(localStorage.getItem("userInfo"))?.isAdmin && (
                <button
                  onClick={() => deleteReview(r._id)}
                  className="text-red-600 text-sm mt-2"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}

        {/* Add Review Form */}
        <form
          onSubmit={submitReview}
          className="mt-6 border p-4 rounded-lg bg-gray-50"
        >
          <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
            className="border p-2 w-full mb-2 rounded"
          >
            <option value="">Select Rating</option>
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </select>
          <textarea
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="border p-2 w-full rounded mb-2"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Recommended Products</h2>
        {related.length === 0 ? (
          <p className="text-gray-600">No related products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((item) => (
              <div
                key={item._id}
                className="border rounded-lg p-2 hover:shadow-lg transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-32 w-full object-cover rounded"
                />
                <h4 className="text-sm font-semibold mt-2 truncate">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-700">R{item.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
