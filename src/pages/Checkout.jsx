import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import Navbar from "./Navbar";


const Checkout = () => {
  const { appState, cart, addresses, fetchAddresses, addAddress, deleteAddress, fetchCart ,placeOrder, clearCart} =
    useContext(AppContext);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  useEffect(() => {
    if (appState.token) {
      fetchAddresses();
      fetchCart();
    }
  }, [appState.token]);

  const handleNewAddressSubmit = async (e) => {
    e.preventDefault();
    await addAddress(newAddress);
    setAddingNew(false);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const shipping = subtotal > 0 ? 49 : 0;
  const total = subtotal + shipping;

const handlePlaceOrder = async () => {
  if (!selectedAddress) {
    alert("Please select a shipping address before placing the order.");
    return;
  }

  const success = await placeOrder(selectedAddress); 

  if (success) {
    await clearCart();
    alert("Order placed successfully!");
  } else {
    alert("Failed to place order. Please try again.");
  }
};

  return (
    <>
      <Navbar />
      <div className="container my-5 pt-5">
        <div className="row g-4">
          <div className="col-md-8">
            <h4 className="fw-bold mb-3">Shipping Address</h4>

            {addresses.length > 0 ? (
              <ul className="list-group mb-3">
                {addresses.map((addr) => (
                  <li
                    key={addr._id}
                    className={`list-group-item d-flex justify-content-between align-items-start ${
                      selectedAddress === addr._id ? "active text-white" : ""
                    }`}
                  >
                    <div>
                      <div className="fw-semibold">{addr.fullName}</div>
                      <div>{addr.street}</div>
                      <div>{addr.city}, {addr.state}</div>
                      <div>📍 {addr.pincode}</div>
                      {addr.country && <div>🌐 {addr.country}</div>}
                      <div>📞 {addr.phone}</div>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      <button
                        className={`btn btn-sm ${
                          selectedAddress === addr._id ? "btn-light text-dark" : "btn-outline-dark"
                        }`}
                        onClick={() => setSelectedAddress(addr._id)}
                      >
                        {selectedAddress === addr._id ? "Selected" : "Select"}
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteAddress(addr._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No saved addresses. Please add one.</p>
            )}

            {!addingNew ? (
              <button className="btn btn-outline-dark" onClick={() => setAddingNew(true)}>
                + Add New Address
              </button>
            ) : (
              <form className="mt-3" onSubmit={handleNewAddressSubmit}>
                <div className="row g-2">
                  <div className="col-md-6">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="form-control"
                      required
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, fullName: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      placeholder="Phone"
                      className="form-control"
                      required
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      placeholder="Street"
                      className="form-control"
                      required
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, street: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      placeholder="City"
                      className="form-control"
                      required
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      placeholder="State"
                      className="form-control"
                      required
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      placeholder="Pincode"
                      className="form-control"
                      required
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, pincode: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      placeholder="Country"
                      className="form-control"
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, country: e.target.value })
                      }
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-dark mt-3">
                  Save Address
                </button>
              </form>
            )}
          </div>

          <div className="col-md-4">
            <h4 className="fw-bold mb-3">Order Summary</h4>
            {cart.length > 0 ? (
              <div className="card p-3 shadow-sm">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="d-flex justify-content-between align-items-center mb-2"
                  >
                    <div>
                      <div>{item.title}</div>
                      <p>Qty: {item.qty}</p>
                    </div>
                    <span>₹ {item.price}</span>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span>₹ {subtotal}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Shipping</span>
                  <span>₹ {shipping}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span>₹ {total}</span>
                </div>
                <button
                  className="btn btn-warning text-dark fw-bold mt-3 w-100"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </button>
              </div>
            ) : (
              <p className="text-muted">Your cart is empty</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
