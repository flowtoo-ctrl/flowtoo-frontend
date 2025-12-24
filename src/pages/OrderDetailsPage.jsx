// src/pages/OrderDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "./OrderDetails.css";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="order-details-container">
      <h1>Order #{order._id.slice(-6)}</h1>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(order.createdAt).toLocaleDateString()}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        {order.isDelivered ? "Delivered ✅" : "In Transit 🚚"}
      </p>

      <h2>Items</h2>
      {order.orderItems.map((item) => (
        <div key={item.product} className="order-detail-item">
          <img src={item.image} alt={item.name} />
          <div>
            <p>{item.name}</p>
            <p>Qty: {item.qty}</p>
            <p>R{item.price.toFixed(2)}</p>
          </div>
        </div>
      ))}

      <h3>Total: R{order.totalPrice.toFixed(2)}</h3>
      <h3>Payment: {order.paymentMethod}</h3>
    </div>
  );
}