import React, { useContext } from "react";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const { appState, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <a className="navbar-brand fw-bold ms-3" href="/admin">Admin Panel</a>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#adminNavbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="adminNavbarNav">
        <ul className="navbar-nav ms-auto">

          <li className="nav-item">
            <a className="nav-link" href="/admin">Dashboard</a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="/admin/products">Products</a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="/admin/orders">Orders</a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="/admin/users">Users</a>
          </li>

          {appState.token ? (
            <li className="nav-item">
              <button
                className="btn btn-outline-light ms-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          ) : null}

        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
