import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { 
  FiSearch, 
  FiFilter, 
  FiGrid, 
  FiList, 
  FiChevronDown,
  FiStar,
  FiShoppingCart,
  FiX,
  FiHeart
} from "react-icons/fi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // UI States
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get("minPrice") || "",
    max: searchParams.get("maxPrice") || ""
  });
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Derived data
  const availableBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fixed: Fetch products when searchParams change AND when selectedBrands change
  useEffect(() => {
    fetchProducts();
  }, [searchParams, selectedBrands]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/categories");
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      
      if (searchParams.get("category")) params.category = searchParams.get("category");
      if (searchParams.get("search")) params.search = searchParams.get("search");
      if (searchParams.get("minPrice")) params.minPrice = searchParams.get("minPrice");
      if (searchParams.get("maxPrice")) params.maxPrice = searchParams.get("maxPrice");

      // Fixed: Handle sorting parameter properly
      const sortParam = searchParams.get("sort");
      if (sortParam) {
        const [field, order] = sortParam.split(',');
        params.sortBy = field;
        params.sortOrder = order;
      }

      const response = await axios.get("http://localhost:3000/api/products", { params });
      let fetchedProducts = response.data.data || [];

      // Client-side brand filtering
      if (selectedBrands.length > 0) {
        fetchedProducts = fetchedProducts.filter(p => selectedBrands.includes(p.brand));
      }

      // Fixed: Client-side sorting if server doesn't handle it
      if (sortParam && fetchedProducts.length > 0) {
        const [field, order] = sortParam.split(',');
        fetchedProducts.sort((a, b) => {
          let aVal = a[field];
          let bVal = b[field];
          
          if (field === 'price') {
            aVal = parseFloat(aVal) || 0;
            bVal = parseFloat(bVal) || 0;
          } else if (field === 'name') {
            aVal = (aVal || '').toLowerCase();
            bVal = (bVal || '').toLowerCase();
          }
          
          if (order === '1') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
      }

      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateSearchParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  // Fixed: Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    updateSearchParams('search', searchTerm.trim());
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    updateSearchParams('category', categoryId);
  };

  // Fixed: Sort handler
  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
    updateSearchParams('sort', sortValue);
  };

  const handlePriceFilter = () => {
    updateSearchParams('minPrice', priceRange.min);
    updateSearchParams('maxPrice', priceRange.max);
  };

  // Fixed: Brand filter with useEffect trigger
  const handleBrandFilter = (brand) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(newBrands);
  };

  const clearAllFilters = () => {
    setSelectedCategory("");
    setSortBy("");
    setPriceRange({ min: "", max: "" });
    setSelectedBrands([]);
    setSearchTerm("");
    setSearchParams({});
  };

  const sortOptions = [
    { value: "", label: "Default" },
    { value: "price,1", label: "Price: Low to High" },
    { value: "price,-1", label: "Price: High to Low" },
    { value: "name,1", label: "Name: A to Z" },
    { value: "name,-1", label: "Name: Z to A" },
    // Add more sort options based on your API
    { value: "createdAt,-1", label: "Newest First" },
    { value: "createdAt,1", label: "Oldest First" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            {selectedCategory ? 
              categories.find(c => c._id === selectedCategory)?.name || "Products" 
              : "All Products"
            }
          </h1>
          <p className="text-gray-600">
            {loading ? "Loading..." : `${products.length} products found`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-12 pr-20 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white/80 backdrop-blur-sm text-lg"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 font-medium"
            >
              Search
            </button>
          </form>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          
          {/* Left Controls */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <FiFilter />
              Filters
            </button>
            
            {(selectedCategory || searchTerm || sortBy || priceRange.min || priceRange.max || selectedBrands.length > 0) && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
              >
                <FiX />
                Clear All
              </button>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-all duration-300 ${viewMode === 'grid' ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white' : 'hover:bg-gray-100'}`}
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-all duration-300 ${viewMode === 'list' ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white' : 'hover:bg-gray-100'}`}
              >
                <FiList />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="w-80 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 h-fit sticky top-8 border border-gray-200/50">
              
              {/* Categories Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={!selectedCategory}
                      onChange={() => handleCategoryFilter("")}
                      className="text-violet-600"
                    />
                    <span>All Categories</span>
                  </label>
                  {categories.map(category => (
                    <label key={category._id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category._id}
                        onChange={() => handleCategoryFilter(category._id)}
                        className="text-violet-600"
                      />
                      <span>{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>
                <button
                  onClick={handlePriceFilter}
                  className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all duration-300"
                >
                  Apply
                </button>
              </div>

              {/* Brand Filter */}
              {availableBrands.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Brands</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableBrands.map(brand => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandFilter(brand)}
                          className="text-violet-600"
                        />
                        <span>{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Products Grid/List */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-600"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-300"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }>
                {products.map((product) => (
                  viewMode === 'grid' ? (
                    <ProductCard key={product._id} product={product} />
                  ) : (
                    <ProductListItem key={product._id} product={product} />
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Card Component for Grid View (Updated with your theme)
function ProductCard({ product }) {
  return (
    <div className="group bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border border-gray-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
            <FiHeart className="text-gray-600 hover:text-red-500" />
          </button>
        </div>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <Link
              to={`/product/${product._id}`}
              className="w-full bg-white text-gray-900 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            >
              <FiShoppingCart />
              Quick View
            </Link>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900 line-clamp-2 flex-1">
            {product.name}
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            ₹{product.price?.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} fill="currentColor" size={14} />
            ))}
            <span className="text-gray-500 text-sm ml-1">(4.5)</span>
          </div>
        </div>
        
        {product.brand && (
          <div className="mt-2 text-xs text-gray-500">
            by {product.brand}
          </div>
        )}
      </div>
    </div>
  );
}

// Product List Item Component for List View (Updated with your theme)
function ProductListItem({ product }) {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border border-gray-200/50 hover:shadow-xl transition-all duration-300">
      <div className="flex">
        <div className="w-48 h-32">
          <img
            src={product.image || "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center gap-4 mb-3">
                <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  ₹{product.price?.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} fill="currentColor" size={14} />
                  ))}
                  <span className="text-gray-500 text-sm ml-1">(4.5)</span>
                </div>
              </div>
              {product.brand && (
                <div className="text-sm text-gray-500">
                  Brand: {product.brand}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 ml-4">
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <FiHeart className="text-gray-600" />
              </button>
              <Link
                to={`/product/${product._id}`}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2"
              >
                <FiShoppingCart />
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
