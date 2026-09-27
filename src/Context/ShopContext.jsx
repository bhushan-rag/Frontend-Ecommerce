import React, { createContext, useEffect, useState } from "react";
import { backend_url } from "../config";

export const ShopContext = createContext(null);

const authHeaders = () => ({
  Accept: 'application/json',
  'auth-token': `${localStorage.getItem("auth-token")}`,
  'Content-Type': 'application/json',
});

const ShopContextProvider = (props) => {

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});

  useEffect(() => {
    fetch(`${backend_url}/allproducts`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Failed to load products", error));

    if (localStorage.getItem("auth-token")) {
      fetch(`${backend_url}/getcart`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({}),
      })
        .then((resp) => {
          if (resp.status === 401) {
            // Token is no longer valid, force a fresh login
            localStorage.removeItem("auth-token");
            return {};
          }
          return resp.json();
        })
        .then((data) => setCartItems(data && !data.errors ? data : {}))
        .catch((error) => console.error("Failed to load cart", error));
    }
  }, [])

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = products.find((product) => product.id === Number(item));
        if (itemInfo) {
          totalAmount += cartItems[item] * itemInfo.new_price;
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = products.find((product) => product.id === Number(item));
        totalItem += itemInfo ? cartItems[item] : 0;
      }
    }
    return totalItem;
  };

  const addToCart = (itemId) => {
    if (!localStorage.getItem("auth-token")) {
      alert("Please Login");
      return;
    }
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    fetch(`${backend_url}/addtocart`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ "itemId": itemId }),
    }).catch((error) => console.error("Failed to add to cart", error));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: Math.max((prev[itemId] || 0) - 1, 0) }));
    if (localStorage.getItem("auth-token")) {
      fetch(`${backend_url}/removefromcart`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ "itemId": itemId }),
      }).catch((error) => console.error("Failed to remove from cart", error));
    }
  };

  const contextValue = { products, getTotalCartItems, cartItems, addToCart, removeFromCart, getTotalCartAmount };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
