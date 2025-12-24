// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api"; // your axios instance or replace with fetch
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState({ name: "", email: "", password: "" });
  const [addresses, setAddresses] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await api.get("/users/profile");
      setProfile(data);
      setEdit({ name: data.name || "", email: data.email || "", password: "" });
      setAddresses(data.addresses || []);
      // wishlist fetch
      const { data: wl } = await api.get("/users/wishlist");
      setWishlist(wl);
    };
    load();
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    await api.put("/users/profile", edit);
    alert("Profile updated");
    const { data } = await api.get("/users/profile");
    setProfile(data);
    setUser(data); // update context
  };

  const handleAddAddress = async () => {
    const label = prompt("Label (Home, Work)");
    const address = prompt("Address");
    const city = prompt("City");
    const postalCode = prompt("Postal Code");
    if (!address) return;
    const { data } = await api.post("/users/addresses", { label, address, city, postalCode, country: "South Africa" });
    setAddresses(data.addresses);
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Delete address?")) return;
    const { data } = await api.delete(`/users/addresses/${id}`);
    setAddresses(data.addresses);
  };

  const handleRemoveWishlist = async (productId) => {
    await api.delete(`/users/wishlist/${productId}`);
    setWishlist(wishlist.filter((p) => p._id !== productId));
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h2>Your Profile</h2>
      <form onSubmit={handleProfileSave}>
        <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} placeholder="Name" />
        <input value={edit.email} onChange={(e) => setEdit({ ...edit, email: e.target.value })} placeholder="Email" />
        <input type="password" value={edit.password} onChange={(e) => setEdit({ ...edit, password: e.target.value })} placeholder="New password" />
        <button type="submit">Save Profile</button>
      </form>

      <section style={{ marginTop: 20 }}>
        <h3>Saved Addresses</h3>
        <button onClick={handleAddAddress}>Add Address</button>
        {addresses.length === 0 ? <p>No addresses</p> : addresses.map(a => (
          <div key={a._id} style={{ border: "1px solid #eee", padding: 8, marginTop: 8 }}>
            <strong>{a.label}</strong>
            <div>{a.address}, {a.city} {a.postalCode}</div>
            <button onClick={() => handleDeleteAddress(a._id)}>Delete</button>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>Your Wishlist</h3>
        {wishlist.length === 0 ? <p>No items in wishlist</p> : wishlist.map(p => (
          <div key={p._id} style={{ display: "flex", gap: 10, alignItems: "center", borderBottom: "1px solid #eee", padding: 8 }}>
            <img src={p.image} alt={p.name} style={{ width: 60, height: 60, objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <div>{p.name}</div>
              <div>R{p.price}</div>
            </div>
            <button onClick={() => handleRemoveWishlist(p._id)}>Remove</button>
          </div>
        ))}
      </section>
    </div>
  );
}
