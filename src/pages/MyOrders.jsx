// src/pages/MyOrders.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./MyOrders.css";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <h2>No orders yet 😕</h2>
        <Link to="/">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>Your Orders</h1>
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <h3>Order #{order._id.slice(-6)}</h3>
            <p>{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="order-items">
            {order.orderItems.map((item) => (
              <div key={item.product} className="order-item">
                <img src={item.image} alt={item.name} />
                <span>{item.name}</span>
                <span>Qty: {item.qty}</span>
                <span>R{item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="order-summary">
            <p>
              <strong>Total:</strong> R{order.totalPrice.toFixed(2)}
            </p>
            <p>
              <strong>Payment:</strong> {order.paymentMethod}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {order.isDelivered ? "✅ Delivered" : "🚚 In Transit"}
            </p>
            <Link to={`/order/${order._id}`} className="view-details-btn">
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}


