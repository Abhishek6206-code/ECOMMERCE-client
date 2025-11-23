import React, { useState, useEffect } from "react";
import AppContext from "./AppContext";
import axios from "axios";

const API_BASE ="https://ecommerce-api-ut4e.onrender.com";


const AppState = (props) => {
  const [appState, setAppState] = useState({
    user: null,
    token: null,
    loading: false,
    products: [],
    featured: [],
  });

  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setAppState((prev) => ({
        ...prev,
        user: JSON.parse(user),
        token,
      }));
      fetchCart(token);
      fetchAddresses(token);
    }
    fetchProducts();
    fetchFeatured();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/product/all`);
      const products = Array.isArray(res.data)
        ? res.data
        : res.data?.products ?? [];
      setAppState((prev) => ({ ...prev, products }));
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchFeatured = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/product/featured`);
      const data = Array.isArray(res.data) ? res.data : res.data?.products ?? res.data;
      setAppState((prev) => ({ ...prev, featured: Array.isArray(data) ? data : [] }));
    } catch (err) {
      console.error("Error fetching featured products:", err);
      setAppState((prev) => ({ ...prev, featured: [] }));
    }
  };

  const login = async (form) => {
    setAppState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await axios.post(`${API_BASE}/api/user/login`, form);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setAppState((prev) => ({
          ...prev,
          user: res.data.user,
          token: res.data.token,
          loading: false,
        }));
        fetchCart(res.data.token);
        fetchAddresses(res.data.token);
        return res.data.user;
      }
    } catch (err) {
      console.error("Login error:", err);
    }
    setAppState((prev) => ({ ...prev, loading: false }));
    return null;
  };

  const signup = async (form) => {
    setAppState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await axios.post(`${API_BASE}/api/user/signup`, form);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setAppState((prev) => ({
          ...prev,
          user: res.data.user,
          token: res.data.token,
          loading: false,
        }));
        fetchCart(res.data.token);
        fetchAddresses(res.data.token);
        return res.data.user;
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
    setAppState((prev) => ({ ...prev, loading: false }));
    return null;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAppState({
      user: null,
      token: null,
      loading: false,
      products: [],
      featured: [],
    });
    setCart([]);
    setAddresses([]);
  };

  const fetchCart = async (token = appState.token) => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}/api/cart/my`, {
        headers: { Auth: token },
      });
      if (res.data.success) {
        setCart(res.data.cart.items || []);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const addToCart = async (product) => {
    if (!appState.token) {
      alert("Please sign in to add to cart");
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE}/api/cart/add`,
        {
          productId: product._id,
          title: product.name,
          price: product.price,
          qty: 1,
          img: product.imageUrl,
        },
        { headers: { Auth: appState.token } }
      );
      if (res.data.success) {
        setCart(res.data.cart.items);
        alert("Added to cart");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await axios.delete(
        `${API_BASE}/api/cart/remove/${productId}`,
        { headers: { Auth: appState.token } }
      );
      if (res.data.success) {
        setCart(res.data.cart.items);
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const clearCart = async () => {
    try {
      const res = await axios.delete(`${API_BASE}/api/cart/clear`, {
        headers: { Auth: appState.token },
      });
      if (res.data.success) {
        setCart([]);
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const fetchAddresses = async (token = appState.token) => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}/api/address/my`, {
        headers: { Auth: token },
      });
      if (Array.isArray(res.data)) {
        setAddresses(res.data);
      } else if (res.data?.success && Array.isArray(res.data.addresses)) {
        setAddresses(res.data.addresses);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  const addAddress = async (address) => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/address/add`,
        address,
        { headers: { Auth: appState.token } }
      );
      if (res.data.address) {
        setAddresses((prev) => [...prev, res.data.address]);
      }
    } catch (err) {
      console.error("Error adding address:", err);
    }
  };

  const deleteAddress = async (id) => {
    try {
      const res = await axios.delete(
        `${API_BASE}/api/address/delete/${id}`,
        {
          headers: { Auth: appState.token },
        }
      );
      if (res.data.success) {
        fetchAddresses();
      } else {
        alert(res.data.message || "Failed to delete address");
      }
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const placeOrder = async (addressId) => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/order/create`,
        { addressId },
        { headers: { Auth: appState.token } }
      );
      return res.data.success;
    } catch (err) {
      console.error("Error placing order:", err);
      return false;
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/user/all`, {
        headers: { Auth: appState.token },
      });
      return res.data;
    } catch (err) {
      console.error("Error fetching admin users:", err);
      return null;
    }
  };

  const fetchAllOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/order/all`, {
        headers: { Auth: appState.token },
      });
      return res.data;
    } catch (err) {
      console.error("Error fetching admin orders:", err);
      return null;
    }
  };

  const fetchAdminSummary = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/summary`, {
        headers: { Auth: appState.token },
      });
      return res.data;
    } catch (err) {
      console.error("Error fetching admin summary:", err);
      return null;
    }
  };

  const deleteUser = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE}/api/user/${id}`, {
        headers: { Auth: appState.token },
      });
      return res.data;
    } catch (err) {
      console.error("Error deleting user:", err);
      return { success: false, error: err.message };
    }
  };
   const addProduct = async (productData) => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/product/add`,
        productData,
        {
          headers: {
            "Content-Type": "application/json",
            Auth: appState.token
          }
        }
      );
      return res.data;
    } catch (err) {
      console.error("Add product error:", err);
      throw err;
    }
  };


  return (
    <AppContext.Provider
      value={{
        appState,
        login,
        signup,
        logout,
        fetchProducts,
        fetchFeatured,
        cart,
        fetchCart,
        addToCart,
        removeFromCart,
        clearCart,
        addresses,
        fetchAddresses,
        addAddress,
        deleteAddress,
        placeOrder,
        deleteUser,
        fetchAllUsers,
        fetchAllOrders,
        fetchAdminSummary,
        addProduct
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
