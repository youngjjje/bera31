import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home.js";
import Cart from "./routes/Cart"
import Profile from "./routes/Profile.js";
import Navbar from "./components/Navbar.js"
import Login from "./routes/Login.js"
import SignUp from "./routes/Signup.js";
import CheckOut from "./routes/CheckOut.js";
import Order from "./routes/Order.js"
import OrderHistory from "./routes/OrderHidtory.js";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/order" element={<Order />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        
      </Routes>
    </Router>
  );
}

export default App;
