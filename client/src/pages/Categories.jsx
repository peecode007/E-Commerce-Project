import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiSearch, FiShoppingBag } from "react-icons/fi";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:3000/api/categories");
        setCategories(response.data.data || []);
      } catch (e) {
        console.error("Failed to fetch categories", e);
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to get category icon based on category name
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      "women clothing": "👗",
      "women's clothing": "👗",
      "men's clothing": "👔",
      "men clothing": "👔",
      "kidswear": "🧸",
      "mobile phones": "📱",
      "mobiles": "📱",
      "electronics": "💻",
      "men's footwear": "👞",
      "women's footwear": "👠",
      "computers & laptops": "💻",
      "audio & headphones": "🎧",
      "beauty & personal care": "💄",
    };
    
    const key = categoryName.toLowerCase();
    return iconMap[key] || "📦";
  };

  const getRandomGradient = (index) => {
    const gradients = [
      "from-blue-500 to-indigo-500",
      "from-pink-500 to-rose-500",
      "from-purple-500 to-violet-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-amber-500",
      "from-teal-500 to-cyan-500",
      "from-red-500 to-pink-500",
      "from-indigo-500 to-blue-500"
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Shop by Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing products across all our categories. Find exactly what you're looking for.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
            />
          </div>
        </div>

        {/* Categories Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 text-center shadow-lg border border-gray-200/50">
            <div className="text-3xl font-bold text-blue-600">{categories.length}</div>
            <div className="text-gray-600 font-medium">Categories</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 text-center shadow-lg border border-gray-200/50">
            <div className="text-3xl font-bold text-indigo-600">1000+</div>
            <div className="text-gray-600 font-medium">Products</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 text-center shadow-lg border border-gray-200/50">
            <div className="text-3xl font-bold text-purple-600">Fast</div>
            <div className="text-gray-600 font-medium">Delivery</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 text-center shadow-lg border border-gray-200/50">
            <div className="text-3xl font-bold text-green-600">24/7</div>
            <div className="text-gray-600 font-medium">Support</div>
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No categories found</h3>
            <p className="text-gray-600">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCategories.map((category, index) => (
              <Link
                key={category._id}
                to={`/products?category=${category._id}`}
                className="group"
              >
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-[1.02] border border-gray-200/50">
                  
                  {/* Category Header with Gradient */}
                  <div className="relative h-40 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${getRandomGradient(index)} opacity-90`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl drop-shadow-lg">
                        {getCategoryIcon(category.name)}
                      </span>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-gray-700 shadow-lg">
                      <FiShoppingBag className="inline mr-1" size={14} />
                      Shop
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {category.description || `Explore our wide range of ${category.name.toLowerCase()} products with the best quality and prices.`}
                    </p>
                    
                    {/* Action Section */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 font-medium">
                        Explore Collection
                      </span>
                      <div className="flex items-center text-blue-600 font-semibold group-hover:text-indigo-600 transition-colors duration-200">
                        <span className="text-sm mr-1">Browse</span>
                        <span className="transform group-hover:translate-x-1 transition-transform duration-200 text-lg">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Need Help Finding Something?</h2>
          <p className="text-xl mb-6 text-blue-100">
            Our customer support team is here to help you find the perfect products
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Browse All Products
            </Link>
            <button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
