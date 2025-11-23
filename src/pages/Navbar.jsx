import React, { useContext } from "react";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { appState, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <a className="navbar-brand fw-bold ms-3" href="/">EliteStore</a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">

          <li className="nav-item">
            <a className="nav-link" href="/products">Products</a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="/profile">Profile</a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="/cart">Cart</a>
          </li>

          {appState.token ? (
            <li className="nav-item">
              <button
                className="btn btn-outline-light me-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          ) : (
            <li className="nav-item">
              <a className="btn btn-outline-light me-2" href="/auth">Sign In</a>
            </li>
          )}

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
