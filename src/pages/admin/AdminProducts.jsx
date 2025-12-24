import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./AdminProducts.css";

export default function AdminProducts() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: 0,
    image: "",
    category: "",
    brand: "",
    description: "",
    countInStock: 0,
  });

  // Load products
  const load = async () => {
    try {
      const { data } = await api.get("/api/products");
      setList(data);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Handle text/number changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "price" || name === "countInStock" ? Number(value) : value,
    });
  };

  // ✅ Image upload (Cloudinary)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      setForm({ ...form, image: data.url });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save product
  const submit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await api.post("/api/products", form, config);
      alert("✅ Product saved!");
      setForm({
        name: "",
        price: 0,
        image: "",
        category: "",
        brand: "",
        description: "",
        countInStock: 0,
      });
      load();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save product");
    }
  };

  // ✅ Delete product
  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.delete(`/api/products/${id}`, config);
      load();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete product");
    }
  };

  return (
    <div className="grid" style={{ gridTemplateColumns: "1fr 2fr", alignItems: "start", gap: "1rem" }}>
      {/* FORM */}
      <form onSubmit={submit} className="grid" style={{ gap: ".6rem", background: "#fff", padding: "1rem", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
        <h3>Add Product</h3>
        <input
          className="input"
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="input"
          type="number"
          placeholder="Price"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          className="input"
          placeholder="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        />
        <input
          className="input"
          placeholder="Brand"
          name="brand"
          value={form.brand}
          onChange={handleChange}
          required
        />
        <textarea
          className="input"
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          className="input"
          type="number"
          placeholder="Stock Quantity"
          name="countInStock"
          value={form.countInStock}
          onChange={handleChange}
          required
        />

        {/* ✅ Image Upload */}
        <label>Upload Image:</label>
        <input type="file" onChange={handleImageUpload} />
        {loading && <p>Uploading image...</p>}
        {form.image && (
          <img
            src={form.image}
            alt="Preview"
            style={{ width: "120px", borderRadius: "6px", marginTop: ".5rem" }}
          />
        )}

        <button className="btn primary" style={{ background: "#007bff", color: "white", border: "none", padding: ".6rem", borderRadius: "6px" }}>
          Save
        </button>
      </form>

      {/* PRODUCTS LIST */}
      <div>
        <h3>Products</h3>
        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}
        >
          {list.map((p) => (
            <div
              key={p._id}
              className="card"
              style={{
                background: "#f8f9fa",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                overflow: "hidden",
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                style={{ width: "100%", height: 150, objectFit: "cover" }}
              />
              <div style={{ padding: ".5rem .75rem" }}>
                <strong>{p.name}</strong>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: ".3rem" }}>
                  <span>R{p.price}</span>
                  <button
                    className="btn"
                    style={{
                      background: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      padding: ".3rem .6rem",
                      cursor: "pointer",
                    }}
                    onClick={() => remove(p._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}