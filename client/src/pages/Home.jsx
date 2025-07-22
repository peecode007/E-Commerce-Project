import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiStar, FiShoppingCart, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from 'axios';

export default function Home() {
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Hero carousel data
    const heroSlides = [
        {
            id: 1,
            title: "Summer Sale 2025",
            subtitle: "Up to 70% off on selected items",
            description: "Discover amazing deals on electronics, fashion, and more",
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
            cta: "Shop Now",
            ctaLink: "/products",
            gradient: "from-blue-600 to-purple-600"
        },
        {
            id: 2,
            title: "New Arrivals",
            subtitle: "Latest trends for this season",
            description: "Be the first to get your hands on the newest products",
            image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop",
            cta: "Explore",
            ctaLink: "/products",
            gradient: "from-green-600 to-blue-600"
        },
        {
            id: 3,
            title: "Premium Electronics",
            subtitle: "Quality you can trust",
            description: "High-end gadgets and electronics at competitive prices",
            image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=600&fit=crop",
            cta: "Browse",
            ctaLink: "/products?category=electronics",
            gradient: "from-purple-600 to-pink-600"
        }
    ];

    useEffect(() => {
        fetchCategories();
        fetchFeaturedProducts();
        
        // Auto-slide carousel
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % heroSlides.length);
        }, 5000);
        
        return () => clearInterval(interval);
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/categories');
            setCategories(response.data.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Fallback to hardcoded categories
            setCategories([
                { _id: "662e56b2b5cfec1f4788adc4", name: "Electronics" },
                { _id: "662e572bb5cfec1f4788adc5", name: "Clothing" },
            ]);
        }
    };

    const fetchFeaturedProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/products?limit=8');
            setFeaturedProducts(response.data.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Hero Carousel Section */}
            <section className="relative h-[70vh] overflow-hidden">
                <div className="relative w-full h-full">
                    {heroSlides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                                index === currentSlide ? 'translate-x-0' : 
                                index < currentSlide ? '-translate-x-full' : 'translate-x-full'
                            }`}
                        >
                            <div 
                                className="w-full h-full bg-cover bg-center relative"
                                style={{ backgroundImage: `url(${slide.image})` }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} bg-opacity-80`}>
                                    <div className="container mx-auto px-4 h-full flex items-center">
                                        <div className="max-w-2xl text-white">
                                            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
                                                {slide.title}
                                            </h1>
                                            <p className="text-xl md:text-2xl font-medium mb-4 opacity-90">
                                                {slide.subtitle}
                                            </p>
                                            <p className="text-lg mb-8 opacity-80 max-w-md">
                                                {slide.description}
                                            </p>
                                            <Link
                                                to={slide.ctaLink}
                                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-2xl transform hover:scale-105"
                                            >
                                                {slide.cta}
                                                <FiArrowRight />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Carousel Navigation */}
                <button 
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-all"
                >
                    <FiChevronLeft size={24} />
                </button>
                <button 
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-all"
                >
                    <FiChevronRight size={24} />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                                index === currentSlide ? 'bg-white' : 'bg-white/50'
                            }`}
                        />
                    ))}
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
                        <p className="text-gray-600 text-lg">Discover our wide range of product categories</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category._id}
                                to={`/products?category=${category._id}`}
                                className="group relative bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {category.name.charAt(0)}
                                </div>
                                <h3 className="text-center font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {category.name}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-16 px-4 bg-white/50">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
                            <p className="text-gray-600 text-lg">Handpicked items just for you</p>
                        </div>
                        <Link
                            to="/products"
                            className="hidden md:flex items-center gap-2 px-6 py-3 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                        >
                            View All
                            <FiArrowRight />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.slice(0, 8).map((product) => (
                            <div
                                key={product._id}
                                className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'}
                                        alt={product.name}
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
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
                                
                                <div className="p-6">
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {product.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="text-2xl font-bold text-blue-600">
                                            ₹{product.price?.toFixed(2)}
                                        </div>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar key={i} fill="currentColor" size={14} />
                                            ))}
                                            <span className="text-gray-500 text-sm ml-1">(4.5)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="text-center mt-12 md:hidden">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            View All Products
                            <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Stay Updated with Our Latest Deals
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            Subscribe to our newsletter and never miss out on amazing offers
                        </p>
                        <div className="max-w-md mx-auto flex gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
                            />
                            <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
