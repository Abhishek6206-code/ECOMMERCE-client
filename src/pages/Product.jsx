import React, { useState, useContext } from "react";
import AppContext from "../context/AppContext";
import { useSearchParams } from "react-router-dom";
import Navbar from "./Navbar";

const Products = () => {
  const { appState, addToCart } = useContext(AppContext);  // 👈 get addToCart here
  const { products } = appState;
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All Categories";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("None");

  let filteredProducts = [...products];

  if (search.trim() !== "") {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (category !== "All Categories") {
    filteredProducts = filteredProducts.filter((p) => p.category === category);
  }

  if (sortBy === "Price: Low to High") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "Price: High to Low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <>
      <Navbar />
      <div className="container my-5 pt-5">
        <div className="text-center mb-5 mt-3">
          <h2 className="fw-bold">Discover Amazing Products</h2>
          <p className="text-muted">
            Explore our curated collection of premium products, carefully selected for quality and style.
          </p>
        </div>

        <div className="row g-3 align-items-center mb-4">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Search Products</label>
            <input
              type="text"
              className="form-control"
              placeholder="What are you looking for?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All Categories">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Living">Home & Living</option>
              <option value="Sports & Outdoors">Sports & Outdoors</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Sort By</label>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="None">None</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="row g-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div className="col-md-3 col-sm-6" key={product._id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={product.imageUrl}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h6 className="fw-bold mb-2">{product.name}</h6>
                    <p className="text-muted mb-2">{product.category}</p>
                    <p className="fw-semibold mb-3">₹ {product.price}</p>
                    <button
                      className="btn btn-dark mt-auto w-100"
                      onClick={async () => {
                        await addToCart(product);
                        alert(`${product.name} has been added to your cart 🛒`);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5">
              <p className="text-muted fs-5">No products found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Products;
