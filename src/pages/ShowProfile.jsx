import React, { useEffect, useState, useContext } from "react";
import Navbar from "./Navbar";
import AppContext from "../context/AppContext";
import axios from "axios";

const API_BASE = "https://ecommerce-api-ut4e.onrender.com";

const ShowProfile = () => {
  const { appState } = useContext(AppContext || {});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = appState?.user || null;

  useEffect(() => {
    let mounted = true;

    const loadOrders = async () => {
      setLoading(true);
      try {
        if (!appState?.token) {
          if (mounted) setOrders([]);
          return;
        }
        const res = await axios.get(`${API_BASE}/api/order/my`, {
          headers: { Auth: appState.token },
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

    loadOrders();
    return () => {
      mounted = false;
    };
  }, [appState?.token]);

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return "-";
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-5" style={{ paddingTop: "80px" }}>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <h5 className="fw-bold">Profile</h5>
              <hr />
              <p><strong>Name:</strong> {user?.name || "-"}</p>
              <p><strong>Email:</strong> {user?.email || "-"}</p>
            </div>
          </div>

          <div className="col-md-8">
            <h4 className="fw-bold mb-3">My Orders</h4>

            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <p className="text-muted">You have no orders yet.</p>
            ) : (
              <div className="list-group">
                {orders.map((order) => (
                  <div key={order._id} className="list-group-item mb-3 shadow-sm">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">Order #{order._id}</h6>
                        <div className="small text-muted">Placed: {formatDate(order.createdAt)}</div>

                        <div className="mt-2">
                          <strong>Items:</strong>
                          <ul className="mb-2">
                            {Array.isArray(order.items) && order.items.length > 0 ? (
                              order.items.map((it, idx) => (
                                <li key={it.productId || idx}>
                                  {it.title} × {it.qty} — ₹{it.price}
                                </li>
                              ))
                            ) : (
                              <li className="text-muted">No items</li>
                            )}
                          </ul>
                        </div>

                        <div>
                          <strong>Shipping Address:</strong>
                          <div className="small">
                            {order.address?.fullName || ""} — {order.address?.phone || ""}
                            <br />
                            {order.address?.street || ""}, {order.address?.city || ""} {order.address?.pincode || ""}
                            <br />
                            {order.address?.state ? `${order.address.state}, ` : ""}{order.address?.country || ""}
                          </div>
                        </div>
                      </div>

                      <div style={{ minWidth: 180 }} className="text-end">
                        <div className="mb-2">
                          <strong>Total</strong>
                          <div>₹ {order.totalAmount}</div>
                        </div>

                        <div>
                          <strong>Status</strong>
                          <div className="mt-1">{order.status || "Pending"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowProfile;
