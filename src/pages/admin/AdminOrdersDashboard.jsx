import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./AdminOrdersDashboard.css";

export default function AdminOrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data } = await api.get("/api/orders", config);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  const markDelivered = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await api.put(`/api/orders/${orderId}/deliver`, {}, config);
      alert("✅ Order marked as delivered!");
      fetchOrders();
    } catch (error) {
      console.error("Error marking delivered:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await api.delete(`/api/orders/${orderId}`, config);
      alert("🗑️ Order deleted!");
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="admin-orders-container">
      <h2>Admin Orders Dashboard</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(-5)}</td>
                <td>{order.user?.email}</td>
                <td>R{order.totalPrice}</td>
                <td>{order.isPaid ? "✅ Yes" : "❌ No"}</td>
                <td>{order.isDelivered ? "📦 Yes" : "🚚 No"}</td>
                <td>
                  {!order.isDelivered && (
                    <button
                      className="deliver-btn"
                      onClick={() => markDelivered(order._id)}
                    >
                      Mark Delivered
                    </button>
                  )}
                  <button
                    className="delete-btn"
                    onClick={() => deleteOrder(order._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}