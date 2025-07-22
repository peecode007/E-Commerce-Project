import React from 'react';
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Product';
import ProductDetail from './pages/ProductDetails';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Categories from './pages/Categories';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';

function App() {
  const { user, logout } = useAuth();

  const adminEmails = [
    'admin@admin.com',
  ];

  const isAdmin = user && adminEmails.includes(user.email);

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={logout} />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/dashboard" element={
            isAdmin ? <AdminDashboard /> : <Navigate to="/" replace />
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
