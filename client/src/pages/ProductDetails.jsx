import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMinus, FiPlus, FiShoppingCart, FiHeart, FiStar } from "react-icons/fi";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/products/${id}`
        );
        setProduct(response.data.data);
      } catch (e) {
        console.error("Failed to fetch product", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
  const token = localStorage.getItem('token');
  console.log('Token:', token); // Check if token exists
  
  if (!token) {
    console.log('No token found');
    setMessage({ type: 'error', text: 'Please login to add items to cart' });
    setTimeout(() => {
      navigate('/login');
    }, 2000);
    return;
  }

  console.log('Adding to cart:', {
    productId: product._id,
    quantity: quantity,
    stock: product.stock
  });

  if (quantity > product.stock) {
    setMessage({ type: 'error', text: 'Not enough stock available' });
    return;
  }

  setAddingToCart(true);
  try {
    const response = await axios.post(
      'http://localhost:3000/api/cart/add',
      {
        productId: product._id,
        quantity: quantity
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log('Cart response:', response.data); // Check response

    setMessage({ type: 'success', text: `Added ${quantity}x ${product.name} to cart!` });
    setQuantity(1);
    
  } catch (error) {
    console.error('Cart error details:', error.response || error); // Detailed error
    
    if (error.response?.status === 401) {
      setMessage({ type: 'error', text: 'Please login to add items to cart' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to add item to cart' 
      });
    }
  } finally {
    setAddingToCart(false);
  }
};


  const handleBuyNow = async () => {
    await handleAddToCart();
    if (!message || message.type === 'success') {
      navigate('/cart');
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, quantity + delta);
    if (newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleWishlist = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setMessage({ type: 'error', text: 'Please login to add to wishlist' });
      return;
    }

    // Implement wishlist functionality here
    setMessage({ type: 'success', text: 'Added to wishlist!' });
  };

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // Mock multiple images for demo (in real app, this would come from product data)
  const productImages = [
    product.image || "/placeholder.png",
    product.image || "/placeholder.png",
    product.image || "/placeholder.png"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Message Banner */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? '✅' : '❌'}
            <span>{message.text}</span>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-blue-600">Home</button>
            <span>/</span>
            <button onClick={() => navigate('/products')} className="hover:text-blue-600">Products</button>
            <span>/</span>
            <span className="text-blue-600 font-medium">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl"
              />
            </div>
            
            {/* Image Thumbnails */}
            <div className="flex space-x-3">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index 
                      ? 'border-blue-500 shadow-lg' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200/50">
              
              {/* Product Title & Rating */}
              <div className="mb-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} fill="currentColor" size={16} />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">(4.5 • 124 reviews)</span>
                </div>
                {product.brand && (
                  <p className="text-gray-600">Brand: <span className="font-medium">{product.brand}</span></p>
                )}
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{product.price?.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{((product.price || 0) * 1.2).toLocaleString()}
                  </span>
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    17% OFF
                  </span>
                </div>
                <p className="text-green-600 text-sm mt-1">Inclusive of all taxes</p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 10 
                    ? 'bg-green-100 text-green-800' 
                    : product.stock > 0 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></span>
                  {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Key Features */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-600">High-quality materials</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-600">Fast and secure delivery</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-600">30-day return policy</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-600">1-year warranty included</span>
                  </li>
                </ul>
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <FiMinus size={16} />
                      </button>
                      <span className="px-4 py-3 font-semibold min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      Max {product.stock} available
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                {product.stock > 0 ? (
                  <>
                    <div className="flex gap-4">
                      <button
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        {addingToCart ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Adding...
                          </>
                        ) : (
                          <>
                            <FiShoppingCart />
                            Add to Cart
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleWishlist}
                        className="px-6 py-4 border-2 border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <FiHeart />
                      </button>
                    </div>
                    <button
                      onClick={handleBuyNow}
                      disabled={addingToCart}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
                    >
                      Buy Now
                    </button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-red-600 font-medium mb-4">This item is currently out of stock</p>
                    <button
                      className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                      onClick={() => setMessage({ type: 'info', text: 'We\'ll notify you when this item is back in stock!' })}
                    >
                      Notify When Available
                    </button>
                  </div>
                )}
              </div>

              {/* Shipping Info */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-2 text-green-700">
                  <span>🚚</span>
                  <span className="font-medium">Free shipping on orders over ₹999</span>
                </div>
                <p className="text-sm text-green-600 mt-1">Expected delivery: 2-5 business days</p>
              </div>
            </div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 text-center shadow-lg border border-gray-200/50">
                <div className="text-2xl mb-2">🔄</div>
                <h4 className="font-semibold text-gray-900">Easy Returns</h4>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 text-center shadow-lg border border-gray-200/50">
                <div className="text-2xl mb-2">🔒</div>
                <h4 className="font-semibold text-gray-900">Secure Payment</h4>
                <p className="text-sm text-gray-600">SSL encrypted checkout</p>
              </div>
              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 text-center shadow-lg border border-gray-200/50">
                <div className="text-2xl mb-2">📞</div>
                <h4 className="font-semibold text-gray-900">24/7 Support</h4>
                <p className="text-sm text-gray-600">Customer service</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
