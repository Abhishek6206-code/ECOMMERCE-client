import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://ecommerce-client-git-main-abhisheks-projects-b5d89adb.vercel.app";

export default function AdminProducts() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/product/all`);
        if (mounted) {
          setProducts(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Error loading products:", err);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await axios.delete(`${API_BASE}/api/product/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="container" style={{ paddingTop: "80px" }}>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Products</h2>

          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => navigate("/admin/products/add")}
          >
            Add Product
          </button>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : products.length === 0 ? (
          <p className="text-muted">No products found.</p>
        ) : (
          <div className="row g-3">
            {products.map((p) => (
              <div className="col-md-4" key={p._id}>
                <div className="card h-100 shadow-sm">
                  {p.imageUrl && (
                    <img
                      src={p.imageUrl}
                      className="card-img-top"
                      alt={p.name}
                      style={{ height: 180, objectFit: "cover" }}
                    />
                  )}

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text text-truncate">{p.description}</p>

                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <strong>₹ {p.price}</strong>

                      <div>
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() =>
                            navigate(`/admin/products/edit/${p._id}`)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(p._id)}
                        >
                          Delete
                        </button>
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
