import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import electronicsImg from "../assets/electronics.jpg";
import fashionImg from "../assets/fashion.jpg";
import homeImg from "../assets/home.jpg";
import sportsImg from "../assets/sports.jpg";
import heroImage from "../assets/hero2.jpg";
import axios from "axios";

const API_BASE = "https://ecommerce-client-git-main-abhisheks-projects-b5d89adb.vercel.app";

const Home = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    let mounted = true;
    const loadFeatured = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/product/featured`);
        if (!mounted) return;
        const data = Array.isArray(res.data) ? res.data : res.data?.products ?? res.data;
        setFeatured(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        if (mounted) setFeatured([]);
      }
    };
    loadFeatured();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <div>
      <Navbar />
      <div
        className="d-flex align-items-center justify-content-center text-center text-white"
        style={{
          height: "90vh",
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          marginTop: "56px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
          }}
        />
        <div className="container" style={{ zIndex: 2 }}>
          <p className="lead mb-4">Curated Luxury. Effortless Shopping.</p>
          <button
            className="btn btn-warning btn-lg fw-bold"
            onClick={() => navigate("/products")}
          >
            Shop Now →
          </button>
        </div>
      </div>

      <div className="container my-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Shop by Category</h2>
          <p className="text-muted">
            Explore our diverse range of categories and find exactly what you're looking for
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-3 col-sm-6">
            <div className="card h-100 text-center shadow-sm" onClick={() => handleCategoryClick("Electronics")} style={{ cursor: "pointer" }}>
              <img src={electronicsImg} className="card-img-top" alt="Electronics" />
              <div className="card-body">
                <h5 className="fw-bold">Electronics</h5>
                <p className="text-muted mb-0">120+ products</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="card h-100 text-center shadow-sm" onClick={() => handleCategoryClick("Fashion")} style={{ cursor: "pointer" }}>
              <img src={fashionImg} className="card-img-top" alt="Fashion" />
              <div className="card-body">
                <h5 className="fw-bold">Fashion</h5>
                <p className="text-muted mb-0">200+ products</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="card h-100 text-center shadow-sm" onClick={() => handleCategoryClick("Home & Living")} style={{ cursor: "pointer" }}>
              <img src={homeImg} className="card-img-top" alt="Home & Living" />
              <div className="card-body">
                <h5 className="fw-bold">Home & Living</h5>
                <p className="text-muted mb-0">85+ products</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="card h-100 text-center shadow-sm" onClick={() => handleCategoryClick("Sports & Outdoors")} style={{ cursor: "pointer" }}>
              <img src={sportsImg} className="card-img-top" alt="Sports & Outdoors" />
              <div className="card-body">
                <h5 className="fw-bold">Sports & Outdoors</h5>
                <p className="text-muted mb-0">65+ products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Featured Products</h2>
          <p className="text-muted">Hand-picked premium products just for you</p>
        </div>

        {featured.length === 0 ? (
          <p className="text-center text-muted">No featured products available.</p>
        ) : (
          <div className="row g-4">
            {featured.map((p) => (
              <div className="col-md-3 col-sm-6" key={p._id}>
                <div
                  className="card h-100 text-center shadow-sm"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/products?id=${p._id}`)}
                >
                  <img
                    src={p.imageUrl}
                    className="card-img-top"
                    alt={p.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="fw-bold">{p.name}</h5>
                    <p className="text-muted mb-1">₹ {p.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
