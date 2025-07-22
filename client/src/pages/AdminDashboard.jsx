import React, { useState } from "react";
import { FiBox, FiTag, FiUser, FiClipboard } from "react-icons/fi";
import CreateProduct from "./admin/CreateProduct";
import CreateCategory from "./admin/CreateCategory";
import AdminOrders from "./admin/AdminOrders";
import Profile from "./admin/Profile";
import AdminSidebar from "../components/AdminSidebar";

const MENU = [
    { key: "products", label: "Products", icon: <FiBox /> },
    { key: "categories", label: "Categories", icon: <FiTag /> },
    // { key: "orders", label: "Orders", icon: <FiClipboard /> },
    { key: "profile", label: "Profile", icon: <FiUser /> },
];

export default function AdminDashboard() {
    const [section, setSection] = useState("products");

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-100 to-blue-50">
            
            <AdminSidebar menu={MENU} section={section} setSection={setSection} />

            {/* Mobile Sidebar */}
            {/* Main Content */}
            <main className="flex-1 px-4 md:px-16 py-8 transition-all duration-300 w-full max-w-full">
                <div className="w-full mx-auto">
                    {section === "products" && <CreateProduct />}
                    {section === "categories" && <CreateCategory />}
                    {/* {section === "orders" && <AdminOrders />} */}
                    {section === "profile" && <Profile />}
                </div>
            </main>

        </div>
    );
}
