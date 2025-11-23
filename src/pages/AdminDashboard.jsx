import React, { useEffect, useState, useContext } from "react";
import AdminNavbar from "../components/AdminNavbar";
import AppContext from "../context/AppContext";

// AdminDashboard: shows simple summary cards for total orders, products, users, and total revenue
export default function AdminDashboard() {
  const { fetchAdminSummary, appState } = useContext(AppContext);
  const [summary, setSummary] = useState({ totalOrders: 0, totalProducts: 0, totalUsers: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchAdminSummary();
        if (mounted && res && res.success) {
          setSummary({
            totalOrders: res.totalOrders || 0,
            totalProducts: res.totalProducts || 0,
            totalUsers: res.totalUsers || 0,
            totalRevenue: res.totalRevenue || 0,
          });
        }
      } catch (err) {
        console.error("Error loading admin summary:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, [fetchAdminSummary, appState.token]);

  const formatCurrency = (val) => {
    if (!val && val !== 0) return "-";
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(val);
  };

  return (
    <>
      <AdminNavbar />
      <div className="container" style={{ paddingTop: "80px" }}>
        <div className="text-center mb-4">
          <h1 className="display-5 fw-bold">Admin Dashboard</h1>
          <p className="text-muted">Overview of recent shop metrics</p>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-md-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-title text-muted">Total Orders</h6>
                  <h3 className="fw-bold">{summary.totalOrders}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-title text-muted">Total Products</h6>
                  <h3 className="fw-bold">{summary.totalProducts}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-title text-muted">Total Users</h6>
                  <h3 className="fw-bold">{summary.totalUsers}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-title text-muted">Total Revenue</h6>
                  <h3 className="fw-bold">{formatCurrency(summary.totalRevenue)}</h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
