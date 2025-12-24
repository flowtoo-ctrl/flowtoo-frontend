// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import Loading from "../../components/Loading";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
    countInStock: "",
    brand: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await API.post("/products", newProduct);
      alert("Product added successfully!");
      setNewProduct({
        name: "",
        price: "",
        description: "",
        category: "",
        image: "",
        countInStock: "",
        brand: "",
      });
      setShowAddForm(false);
      fetchProducts();
    } catch (err) {
      alert("Failed to add product");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await API.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert("Failed to delete");
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="add-product-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "+ Add New Product"}
        </button>
      </div>

      {/* ADD PRODUCT FORM */}
      {showAddForm && (
        <div className="add-product-form">
          <h2>Add New Product</h2>
          <form onSubmit={handleAddProduct}>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Price (R)"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Brand"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
              />
              <input
                type="text"
                placeholder="Category (e.g. Electronics)"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                value={newProduct.countInStock}
                onChange={(e) => setNewProduct({ ...newProduct, countInStock: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                required
              />
            </div>
            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              rows="4"
              required
            />
            <button type="submit" className="save-product-btn">
              Save Product
            </button>
          </form>
        </div>
      )}

      {/* PRODUCTS LIST */}
      <div className="products-list">
        <h2>Products ({products.length})</h2>
        {products.length === 0 ? (
          <p>No products yet. Add your first one above!</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <img src={product.image} alt={product.name} className="product-img" />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">R{product.price}</p>
                  <p className="category">{product.category}</p>
                  <p className="stock">Stock: {product.countInStock}</p>
                </div>
                <div className="product-actions">
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(product._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

