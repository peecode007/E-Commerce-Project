import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiArrowRight } from 'react-icons/fi';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data.data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(productId);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3000/api/cart/update', {
        productId,
        quantity: newQuantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCartItems(items => 
        items.map(item => 
          item.product._id === productId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(null);
    }
  };

  const removeFromCart = async (productId) => {
    setUpdating(productId);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCartItems(items => items.filter(item => item.product._id !== productId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setUpdating(null);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const calculateSubtotal = (item) => {
    return item.product.price * item.quantity;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-12 border border-gray-200/50">
            <FiShoppingCart className="mx-auto text-6xl text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Start Shopping
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FiShoppingCart className="text-blue-600" />
            Shopping Cart
          </h1>
          <p className="text-gray-600 mt-2">{cartItems.length} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product._id} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image || '/placeholder.png'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.product.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        disabled={updating === item.product._id}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{item.product.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-blue-600">
                        ₹{item.product.price.toFixed(2)}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          disabled={updating === item.product._id || item.quantity <= 1}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          <FiMinus size={14} />
                        </button>
                        
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          disabled={updating === item.product._id}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Subtotal</div>
                        <div className="text-lg font-bold text-gray-900">
                          ₹{calculateSubtotal(item).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <FiArrowRight />
              </Link>

              <Link
                to="/products"
                className="block w-full text-center text-blue-600 hover:text-blue-700 font-medium mt-4 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
