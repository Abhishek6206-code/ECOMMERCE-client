import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://ecommerce-api-ut4e.onrender.com";

export default function AdminAddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE}/api/product/create`, form);

      alert("Product added successfully!");
      navigate("/admin/products");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
      console.error("Add product error:", err);
    }
  };

  return (
    <div className="container" style={{ paddingTop: "80px", maxWidth: "600px" }}>
      <h2 className="fw-bold mb-4">Add Product</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            className="form-control"
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Enter price"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter description"
            rows={3}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            className="form-control"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="Paste image URL"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Add Product
        </button>
      </form>
    </div>
  );
}
