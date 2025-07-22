import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";

export default function AdminSidebar({ menu, section, setSection }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger for mobile */}
      <div className="fixed top-3 left-3 z-50 md:hidden min-h-screen">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded bg-blue-700 text-white shadow-xl"
        >
          <FiMenu size={26} />
        </button>
      </div>

      {/* Drawer (mobile) & Sidebar (desktop) */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white/90 shadow-xl p-6 transition-transform z-40
          ${open ? "translate-x-0" : "-translate-x-full"} 
          md:static md:w-60 md:translate-x-0 md:shadow-none md:block min-h-screen
        `}
      >
        <div className="text-2xl font-black text-blue-700 tracking-tight py-2 mb-6">Shop Admin</div>
        <ul className="space-y-1">
          {menu.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => {
                  setSection(item.key);
                  setOpen(false); // close drawer on mobile click
                }}
                className={`flex items-center gap-3 px-4 py-2 w-full rounded-xl transition font-medium
                  ${
                    section === item.key
                      ? "bg-blue-600 text-white shadow-md"
                      : "hover:bg-blue-100 text-gray-700"
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex-grow"></div>
        <footer className="text-xs text-gray-500 pt-8 hidden md:block ">
          © {new Date().getFullYear()} Shop Admin. All rights reserved.
        </footer>
      </div>

      {/* Overlay for mobile drawer */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
        ></div>
      )}
    </>
  );
}
