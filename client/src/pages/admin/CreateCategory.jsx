import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiCheckCircle, FiAlertCircle, FiTag, FiTrash2 } from "react-icons/fi";

export default function CreateCategory() {
  const [cat, setCat] = useState({});
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState(null);

  // Load categories on mount and after create/delete
  const loadCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/categories");
      setCategories(res.data.data || []);
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/categories", cat, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: "success", text: "Category created!" });
      setCat({});
      loadCategories();
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Category creation failed"
      });
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: "success", text: "Category deleted!" });
      loadCategories();
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Category deletion failed"
      });
    }
  };

  return (
    <section className="max-w-screen mx-auto flex flex-col md:flex-row gap-8">
      {/* Left: Add Category Form */}
      <div className="bg-white/90 shadow-lg rounded-xl p-7 flex-1 order-2 md:order-1">
        <h2 className="mb-4 text-2xl font-bold text-blue-800 flex items-center gap-2">
          <FiTag /> Add Category
        </h2>
        {message && (
          <div
            className={`mb-4 flex items-center gap-2 px-4 py-2 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <FiCheckCircle className="text-green-600" />
            ) : (
              <FiAlertCircle className="text-red-600" />
            )}
            <span>{message.text}</span>
          </div>
        )}
        <form className="space-y-6" onSubmit={addCategory}>
          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Category Name*
            </label>
            <input
              className="w-full px-4 py-2 rounded border border-slate-300 focus:border-blue-500 outline-none shadow"
              type="text"
              placeholder="e.g. Electronics"
              value={cat.name || ""}
              onChange={(e) => setCat({ ...cat, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Description
            </label>
            <input
              className="w-full px-4 py-2 rounded border border-slate-300 focus:border-blue-500 outline-none shadow"
              type="text"
              placeholder="Optional"
              value={cat.description || ""}
              onChange={(e) => setCat({ ...cat, description: e.target.value })}
            />
          </div>
          <button className="w-full mt-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold tracking-wide py-2 rounded-lg shadow transition" type="submit">
            Create Category
          </button>
        </form>
      </div>

      {/* Right: Category List */}
      <div className="bg-white/90 shadow-lg rounded-xl p-7 flex-1 order-1 md:order-2">
        <h3 className="mb-4 text-xl text-blue-900 font-bold flex items-center gap-2">
          <FiTag /> Existing Categories
        </h3>
        <div className="space-y-2">
          {categories.length === 0 ? (
            <p className="text-gray-400">No categories yet.</p>
          ) : (
            categories.map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded shadow-sm group"
              >
                <div>
                  <div className="font-semibold text-blue-800">{c.name}</div>
                  {c.description && (
                    <div className="text-gray-600 text-xs">{c.description}</div>
                  )}
                </div>
                <button
                  title="Delete"
                  onClick={() => deleteCategory(c._id)}
                  className="ml-2 text-red-600 hover:bg-red-100 p-2 rounded hidden group-hover:block transition"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
