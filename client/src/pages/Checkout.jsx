import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FiCreditCard, 
  FiTruck, 
  FiShield, 
  FiDownload, 
  FiCheckCircle,
  FiArrowLeft
} from 'react-icons/fi';

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'card'
  });

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

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
  e.preventDefault();
  setOrderLoading(true);

  try {
    const token = localStorage.getItem('token');
    console.log('Token:', token ? 'exists' : 'missing');
    
    // Create order
    const orderData = {
      items: cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      shipping: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      },
      paymentMethod: formData.paymentMethod,
      total: calculateTotal()
    };

    console.log('Sending order data:', orderData);

    const response = await axios.post('http://localhost:3000/api/orders', orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Order response:', response.data);

    setOrderDetails(response.data.data);
    setOrderComplete(true);

    // Clear cart after successful order
    try {
      await axios.delete('http://localhost:3000/api/cart/clear', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Cart cleared successfully');
    } catch (clearError) {
      console.error('Error clearing cart:', clearError);
      // Don't block the success flow if cart clear fails
    }

  } catch (error) {
    console.error('Full error details:', error.response || error);
    alert(`Failed to place order: ${error.response?.data?.message || error.message}`);
  } finally {
    setOrderLoading(false);
  }
};


  const downloadReceipt = () => {
    if (!orderDetails) return;
    
    const receiptContent = generateReceiptContent(orderDetails, cartItems, formData);
    const blob = new Blob([receiptContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${orderDetails._id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateReceiptContent = (order, items, shipping) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Receipt - ${order._id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #4F46E5; padding-bottom: 20px; margin-bottom: 30px; }
          .order-info { background: #F8FAFC; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .items-table th { background-color: #4F46E5; color: white; }
          .total { font-size: 18px; font-weight: bold; text-align: right; }
          .shipping { background: #F0F9FF; padding: 15px; border-radius: 8px; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🛍️ Celebal Shop</h1>
          <h2>Order Receipt</h2>
          <p>Thank you for your purchase!</p>
        </div>
        
        <div class="order-info">
          <h3>Order Information</h3>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
          <p><strong>Payment Method:</strong> ${shipping.paymentMethod.toUpperCase()}</p>
          <p><strong>Status:</strong> Confirmed</p>
        </div>

        <h3>Items Ordered</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td>${item.product.name}</td>
                <td>₹${item.product.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>₹${(item.product.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total">
          <p>Subtotal: ₹${calculateTotal().toFixed(2)}</p>
          <p>Shipping: FREE</p>
          <p>Tax: ₹0.00</p>
          <h3>Total: ₹${calculateTotal().toFixed(2)}</h3>
        </div>

        <div class="shipping">
          <h3>Shipping Information</h3>
          <p><strong>Name:</strong> ${shipping.firstName} ${shipping.lastName}</p>
          <p><strong>Email:</strong> ${shipping.email}</p>
          <p><strong>Phone:</strong> ${shipping.phone}</p>
          <p><strong>Address:</strong></p>
          <p>${shipping.address}<br>
          ${shipping.city}, ${shipping.state} ${shipping.zipCode}</p>
        </div>

        <div class="footer">
          <p>Questions? Contact us at support@celebalshop.com</p>
          <p>Thank you for shopping with Celebal Shop!</p>
        </div>
      </body>
      </html>
    `;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center border border-gray-200/50">
            <div className="mb-6">
              <FiCheckCircle className="mx-auto text-6xl text-green-500 mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-600">Thank you for your purchase</p>
            </div>

            <div className="bg-green-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">Order Details</h3>
              <p className="text-green-700">Order ID: <span className="font-mono">{orderDetails?._id}</span></p>
              <p className="text-green-700">Total: ₹{calculateTotal().toFixed(2)}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={downloadReceipt}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <FiDownload />
                Download Receipt
              </button>
              <button
                onClick={() => navigate('/products')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <FiArrowLeft />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-200/50">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiTruck className="text-blue-600" />
              Shipping Information
            </h2>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Payment Method */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiCreditCard className="text-blue-600" />
                  Payment Method
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="text-blue-600"
                    />
                    <span>💳 Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleInputChange}
                      className="text-blue-600"
                    />
                    <span>📱 UPI</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="text-blue-600"
                    />
                    <span>💵 Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={orderLoading}
                className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {orderLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiShield />
                    Place Order - ₹{calculateTotal().toFixed(2)}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-200/50 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex items-center gap-4">
                  <img
                    src={item.product.image || '/placeholder.png'}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 line-clamp-1">{item.product.name}</h4>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 text-green-700">
                <FiShield />
                <span className="text-sm font-medium">Secure & Encrypted Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
