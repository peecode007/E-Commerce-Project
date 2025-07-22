import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiUser, FiChevronDown, FiLogOut, FiSettings, FiShoppingBag } from "react-icons/fi";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Categories", to: "/categories" },
  { label: "Cart", to: "/cart" },
];

export default function Navbar({ user, onLogout }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close profile menu on outside click
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto flex items-center h-16 px-4">
        {/* Brand */}
        <div className="flex-1 flex justify-center md:justify-start">
          <Link
            to="/"
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-lg p-1 shadow-lg">
                <img
                  src="./logo.svg"
                  alt="UrbanAura Logo"
                  height={24}
                  width={24}
                  className="transition-transform duration-300 group-hover:rotate-6"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent tracking-tight leading-none">
                URBAN
              </span>
              <span className="text-md font-medium text-indigo-400 tracking-[0.2em] uppercase leading-none">
                aura
              </span>
            </div>
          </Link>
        </div>


        {/* Nav Links */}
        <ul className="flex flex-1 justify-center space-x-2 md:space-x-6">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 relative overflow-hidden group
                  ${location.pathname === link.to
                    ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200"
                    : "hover:bg-gray-50 text-gray-700 hover:text-blue-600"}`}
              >
                <span className="relative z-10">{link.label}</span>
                {location.pathname !== link.to && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Authentication Section */}
        <div className="flex-1 flex justify-end items-center relative" ref={ref}>
          {user ? (
            <>
              {/* User Profile Button */}
              <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                  {user.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
                </div>
                <span className="hidden md:inline text-gray-700 font-medium">
                  {user.name || user.email?.split('@')[0] || "User"}
                </span>
                <FiChevronDown className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {open && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 text-gray-700 font-medium transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <FiUser className="text-blue-500" />
                      My Profile
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 text-gray-700 font-medium transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <FiShoppingBag className="text-green-500" />
                      My Orders
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-purple-50 text-gray-700 font-medium transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <FiSettings className="text-purple-500" />
                        Admin Dashboard
                      </Link>
                    )}

                    <hr className="my-2 border-gray-100" />

                    <button
                      onClick={() => { setOpen(false); onLogout && onLogout(); }}
                      className="flex items-center gap-3 w-full px-4 py-2 hover:bg-red-50 text-gray-700 font-medium transition-colors"
                    >
                      <FiLogOut className="text-red-500" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Login/Register Buttons */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Subtle bottom gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </nav>
  );
}
