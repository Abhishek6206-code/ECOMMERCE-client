import React, { useEffect, useState, useContext } from "react";
import AdminNavbar from "../components/AdminNavbar";
import axios from "axios";
import AppContext from "../context/AppContext";

const API_BASE = "https://ecommerce-client-git-main-abhisheks-projects-b5d89adb.vercel.app";

export default function AdminUsers() {
  const { appState, deleteUser } = useContext(AppContext || {});
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/user/all`, {
          headers: { Auth: appState?.token },
        });
        if (!mounted) return;
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching users:", err);
        if (mounted) setUsers([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, [appState?.token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const res = await deleteUser(id);
    if (res.success) {
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } else {
      alert(res.message || "Failed to delete user");
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="container" style={{ paddingTop: "80px" }}>
        <h2 className="fw-bold mb-4">Users</h2>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border"></div>
          </div>
        ) : users.length === 0 ? (
          <p className="text-muted">No users found.</p>
        ) : (
          <div className="row g-3">
            {users.map((u) => (
              <div className="col-md-4" key={u._id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{u.name || "-"}</h5>
                    <p className="mb-1">{u.email}</p>
                    <p className="text-muted">Role: {u.role}</p>

                    {u.role !== "admin" && (
                      <button
                        className="btn btn-danger mt-2"
                        onClick={() => handleDelete(u._1d || u._id)}
                      >
                        Remove User
                      </button>
                    )}
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
