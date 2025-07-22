import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiClock, 
  FiX,
  FiDownload,
  FiEye,
  FiRefreshCw
} from 'react-icons/fi';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setOrders([]);
        return;
      }

      const response = await axios.get('http://localhost:3000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'confirmed':
        return <FiCheckCircle className="text-blue-500" />;
      case 'shipped':
        return <FiTruck className="text-purple-500" />;
      case 'delivered':
        return <FiCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FiX className="text-red-500" />;
      default:
        return <FiPackage className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const downloadReceipt = (order) => {
    const receiptContent = generateReceiptContent(order);
    const blob = new Blob([receiptContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${order._id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateReceiptContent = (order) => {
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
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
          <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
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
            ${order.items.map(item => `
              <tr>
                <td>${item.product.name}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>₹${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total">
          <p>Subtotal: ₹${order.total.toFixed(2)}</p>
          <p>Shipping: FREE</p>
          <p>Tax: ₹0.00</p>
          <h3>Total: ₹${order.total.toFixed(2)}</h3>
        </div>

        <div class="shipping">
          <h3>Shipping Information</h3>
          <p><strong>Name:</strong> ${order.shipping.firstName} ${order.shipping.lastName}</p>
          <p><strong>Email:</strong> ${order.shipping.email}</p>
          <p><strong>Phone:</strong> ${order.shipping.phone}</p>
          <p><strong>Address:</strong></p>
          <p>${order.shipping.address}<br>
          ${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}</p>
        </div>

        <div class="footer">
          <p>Questions? Contact us at support@celebalshop.com</p>
          <p>Thank you for shopping with Celebal Shop!</p>
        </div>
      </body>
      </html>
    `;
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FiPackage className="text-blue-600" />
                My Orders
              </h1>
              <p className="text-gray-600 mt-2">
                {orders.length === 0 ? 'No orders yet' : `${orders.length} orders found`}
              </p>
            </div>
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <FiRefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-12 text-center border border-gray-200/50">
            <FiPackage className="mx-auto text-6xl text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-8">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-gray-200/50">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Order #{order._id.slice(-8)}</p>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">₹{order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{order.items.length} items</p>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 mb-4">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <img
                          src={item.product.image || '/placeholder.png'}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-sm text-blue-600 font-semibold">₹{item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg">
                        <span className="text-gray-600 text-sm font-medium">
                          +{order.items.length - 3}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <FiEye size={16} />
                      View Details
                    </button>
                    <button
                      onClick={() => downloadReceipt(order)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <FiDownload size={16} />
                      Download Receipt
                    </button>
                    {order.status === 'delivered' && (
                      <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
                        <FiRefreshCw size={16} />
                        Return/Exchange
                      </button>
                    )}
                  </div>
                </div>

                {/* Shipping Address Preview */}
                <div className="px-6 pb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                    <p className="text-sm text-gray-600">
                      {order.shipping.firstName} {order.shipping.lastName}<br/>
                      {order.shipping.address}<br/>
                      {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Detail Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Order Details #{selectedOrder._id.slice(-8)}
                  </h2>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Status */}
                <div className="flex items-center gap-3">
                  {getStatusIcon(selectedOrder.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                  <span className="text-gray-600">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Items Ordered</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={item.product.image || '/placeholder.png'}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                          <p className="text-gray-600 text-sm">{item.product.description}</p>
                          <p className="text-sm text-gray-600">
                            ₹{item.price.toFixed(2)} × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Details */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Shipping Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">{selectedOrder.shipping.firstName} {selectedOrder.shipping.lastName}</p>
                    <p className="text-gray-600">{selectedOrder.shipping.email}</p>
                    <p className="text-gray-600">{selectedOrder.shipping.phone}</p>
                    <p className="text-gray-600 mt-2">
                      {selectedOrder.shipping.address}<br/>
                      {selectedOrder.shipping.city}, {selectedOrder.shipping.state} {selectedOrder.shipping.zipCode}
                    </p>
                  </div>
                </div>

                {/* Order Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Payment Method: {selectedOrder.paymentMethod.toUpperCase()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => downloadReceipt(selectedOrder)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiDownload size={16} />
                    Download Receipt
                  </button>
                  {selectedOrder.status === 'delivered' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                      <FiRefreshCw size={16} />
                      Return/Exchange
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
