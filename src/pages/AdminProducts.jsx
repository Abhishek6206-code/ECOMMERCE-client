import React, { useEffect, useState, useContext } from "react";
import AdminNavbar from "../components/AdminNavbar";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function AdminProducts() {
  const { appState, fetchProducts } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch products on mount
  useEffect(() => {
    const load = async () => {
      if (typeof fetchProducts === "function") {
        setLoading(true);
        try {
          await fetchProducts();
        } catch (err) {
          console.error("Error fetching products:", err);
        }
      }
    };
    load();
    // eslint-disable-next-line
  }, []);

  // Sync local state with global
  useEffect(() => {
    setProducts(Array.isArray(appState.products) ? appState.products : []);
    setLoading(false);
  }, [appState.products]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await fetch(`https://ecommerce-client-git-main-abhisheks-projects-b5d89adb.vercel.app/api/product/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Auth: appState?.token,
        },
      });

      // Re-fetch products to stay in sync
      if (typeof fetchProducts === "function") {
        await fetchProducts();
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product");
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
            <div className="spinner-border">
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
