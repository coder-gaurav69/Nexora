import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import ProductPage from "./Pages/ProductPage";
import ProductsByCategory from "./Pages/ProductsByCategory";
import Cart from "./Pages/Cart";
import CheckOut from "./Pages/CheckOut";
import Shipping from "./Components/Shipping";
import Payment from "./Components/Payment";
import OrderConfirmation from "./Components/OrderConfirmation";
import {Toaster} from 'sonner'
import Auth from "./Pages/Auth";
import Contact from "./Pages/Contact";

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/footer" element={<Footer />} />
      <Route path="/product/:id" element={<ProductPage />} />

      {/*Redirect /filterProducts to /filterProducts/All */}
      <Route path="/shop" element={<Navigate to="/shop/All" replace />} />
      <Route path="/shop/:selectedCategory" element={<ProductsByCategory />} />

      <Route path="/cart" element={<Cart />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/contact" element={<Contact />} />

      {/* Checkout steps */}
      <Route path="/checkOut" element={<CheckOut />}>
        <Route index element={<Navigate to="shipping" />} />
        <Route path="shipping" element={<Shipping />} />
        <Route path="payment" element={<Payment />} />
      </Route>

      <Route path="/confirmation" element={<OrderConfirmation />} />
    </Routes>
    <Toaster richColors position="bottom-right"/>
    </>
  );
};

export default App;






