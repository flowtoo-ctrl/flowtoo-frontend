import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaStar } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import WishlistButton from "../components/WishlistButton";
import Loading from "../components/Loading";
import API from "../services/api";
import "./Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const { addToCart } = useCart();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (minPrice) params.append("min", minPrice);
      if (maxPrice) params.append("max", maxPrice);

      const res = await API.get(`/products?${params.toString()}`);

      console.log("API response:", res.data);

      const productList = Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setProducts(productList);
    } catch (err) {
      console.error("Failed to load products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = ["Electronics", "Furniture", "Clothing", "Books", "Sports"];

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="home-page">
      {/* FILTERS */}
      <section className="search-filter-section">
        <div className="container">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />

            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />

            <button className="btn-filter" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">Our Products</h2>

          {loading ? (
            <Loading />
          ) : products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="products-grid">
              {products.map((product) => {
                if (!product || !product._id) return null;

                return (
                  <div key={product._id} className="product-card">
                    <div className="product-image-container">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                      />

                      <div className="product-overlay">
                        <Link to={`/product/${product._id}`} className="btn-view">
                          View Details
                        </Link>
                      </div>

                      <div className="product-wishlist">
                        <WishlistButton productId={product._id} />
                      </div>
                    </div>

                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>

                      <div className="product-rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`star ${
                              i < Math.round(product.rating || 0) ? "filled" : ""
                            }`}
                          />
                        ))}
                        <span>({product.numReviews || 0})</span>
                      </div>

                      <div className="product-price">
                        <span className="price">R{product.price?.toFixed(2)}</span>
                      </div>

                      <button
                        className="btn-add-cart"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}