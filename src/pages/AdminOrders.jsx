import React, { useEffect, useState, useContext } from "react";
import AdminNavbar from "../components/AdminNavbar";
import axios from "axios";
import AppContext from "../context/AppContext";

const API_BASE = "https://ecommerce-client-git-main-abhisheks-projects-b5d89adb.vercel.app";

export default function AdminOrders() {
  const { appState } = useContext(AppContext || {});
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/order/all`, {
          headers: { Auth: appState?.token },
        });
        if (!mounted) return;
        const data = res.data && res.data.orders ? res.data.orders : [];
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        if (mounted) setOrders([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [appState?.token]);

  const updateStatus = async (orderId, status) => {
    try {
      const res = await axios.patch(
        `${API_BASE}/api/order/${orderId}/status`,
        { status },
        { headers: { Auth: appState?.token } }
      );
      if (res.data && res.data.success) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? res.data.order : o)));
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return "-";
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="container" style={{ paddingTop: "80px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Orders</h2>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-muted">No orders found.</p>
        ) : (
          <div className="list-group">
            {orders.map((order) => (
              <div key={order._id} className="list-group-item mb-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="mb-1">Order #{order._id}</h5>
                    <div className="small text-muted">Placed: {formatDate(order.createdAt)}</div>
                    <div className="mt-2">
                      <strong>User:</strong> {order.userId?.name || "-"} &lt;{order.userId?.email || "-"}&gt;
                    </div>
                    <div className="mt-1">
                      <strong>Address:</strong> {order.address?.street || ""}, {order.address?.city || ""} {order.address?.pincode || ""}
                    </div>
                    <div className="mt-2">
                      <strong>Items:</strong>
                      <ul>
                        {Array.isArray(order.items) && order.items.length > 0 ? (
                          order.items.map((it) => (
                            <li key={it.productId}>{it.title} × {it.qty} — ₹{it.price}</li>
                          ))
                        ) : (
                          <li className="text-muted">No items</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div style={{ minWidth: 220 }} className="text-end">
                    <div className="mb-2">
                      <strong>Total:</strong>
                      <div>₹ {order.totalAmount}</div>
                    </div>

                    <div className="mb-2">
                      <strong>Status:</strong>
                      <div className="mt-1">
                        <select
                          className="form-select"
                          value={order.status || "Pending"}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
