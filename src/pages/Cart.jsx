import React, { useEffect, useContext } from "react";
import AppContext from "../context/AppContext";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, fetchCart, removeFromCart, clearCart, decreaseQty, appState } = useContext(AppContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (appState.token) {
  //     fetchCart();
  //   }
  // }, [appState.token]);

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = () => {
    if (!appState.token) {
      alert("Please sign in to proceed to checkout.");
      navigate("/auth");
      return;
    }
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    navigate("/checkout");
  };

  return (
    <>
      <Navbar />
      <div className="container my-5" style={{ paddingTop: "80px" }}>
        <h2 className="fw-bold mb-4">Your Cart</h2>

        {cart.length === 0 ? (
          <p className="text-muted">Your cart is empty.</p>
        ) : (
          <>
            <div className="list-group mb-4">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginRight: "15px",
                      }}
                    />
                    <div>
                      <h6 className="mb-1 fw-bold">{item.title}</h6>
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-sm btn-outline-danger me-2"
                          onClick={() => decreaseQty(item.productId)}
                        >
                          −qty
                        </button>
                        <span className="fw-semibold">{item.qty}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="fw-semibold me-3">₹ {item.price}</span>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Total: ₹ {total}</h5>
              <div>
                <button className="btn btn-outline-danger me-2" onClick={clearCart}>
                  Clear Cart
                </button>
                <button className="btn btn-success" onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
