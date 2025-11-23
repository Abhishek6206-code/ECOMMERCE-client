import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const { addProduct } = useContext(AppContext);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    imageUrl: "",
    isFeatured: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.description.trim()) return "Description is required";
    if (form.price === "" || isNaN(Number(form.price)) || Number(form.price) <= 0) return "Price should be a positive number";
    if (form.stock === "" || isNaN(Number(form.stock)) || Number(form.stock) < 0) return "Stock should be 0 or more";
    if (!form.category.trim()) return "Category is required";
    if (!form.imageUrl.trim()) return "Image URL is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category.trim(),
        imageUrl: form.imageUrl.trim(),
        isFeatured: Boolean(form.isFeatured),
      };
      await addProduct(payload);
      alert("Product added");
      navigate("/admin/products");
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Failed to add";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 80, maxWidth: 760 }}>
      <h2 className="mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Product Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="form-control" placeholder="Enter product name" required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Price (₹)</label>
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} className="form-control" placeholder="e.g. 499.99" required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Stock</label>
            <input name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleChange} className="form-control" placeholder="e.g. 10" required />
          </div>

          <div className="col-12">
            <label className="form-label">Category</label>
            <input name="category" value={form.category} onChange={handleChange} className="form-control" placeholder="e.g. Electronics" required />
          </div>

          <div className="col-12">
            <label className="form-label">Image URL</label>
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="form-control" placeholder="Paste image URL" required />
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="form-control" rows={4} placeholder="Short product description" required />
          </div>

          <div className="col-12 d-flex align-items-center">
            <input id="isFeatured" name="isFeatured" type="checkbox" checked={form.isFeatured} onChange={handleChange} className="form-check-input me-2" />
            <label htmlFor="isFeatured" className="form-check-label">Mark as Featured</label>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? "Adding..." : "Add Product"}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
