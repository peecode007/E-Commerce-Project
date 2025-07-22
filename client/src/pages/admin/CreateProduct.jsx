import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiCheckCircle, FiAlertCircle, FiImage, FiBox } from "react-icons/fi";

export default function CreateProduct() {
  const [prod, setProd] = useState({});
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/categories")
      .then((res) => setCategories(res.data.data))
      .catch(() => setCategories([]));
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/products", prod, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: "success", text: "Product created!" });
      setProd({});
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Product creation failed"
      });
    }
  };

  return (
    <section className="bg-white/90 shadow-lg rounded-xl p-7 transition-all duration-300">
      <h2 className="mb-4 text-2xl font-bold text-blue-800 flex items-center gap-2">
        <FiBox /> Add Product
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
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={addProduct}>
        <div>
          <label className="block mb-2 font-medium text-slate-700">Product Name*</label>
          <input
            className="w-full px-4 py-2 rounded border border-slate-300 focus:border-blue-500 outline-none shadow"
            type="text"
            placeholder="e.g. iPhone 15"
            value={prod.name || ""}
            onChange={e => setProd({ ...prod, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-slate-700">Price*</label>
          <input
            className="w-full px-4 py-2 rounded border border-slate-300 focus:border-blue-500 outline-none shadow"
            type="number"
            min={1}
            placeholder="e.g. 49999"
            value={prod.price || ""}
            onChange={e => setProd({ ...prod, price: parseFloat(e.target.value) })}
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-slate-700">Brand</label>
          <input
            className="w-full px-4 py-2 rounded border border-slate-300 focus:border-blue-500 outline-none shadow"
            type="text"
            placeholder="e.g. Apple"
            value={prod.brand || ""}
            onChange={e => setProd({ ...prod, brand: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-slate-700">Category*</label>
          <select
            className="w-full px-4 py-2 rounded border border-slate-300 focus:border-blue-500 outline-none shadow"
            value={prod.category || ""}
            onChange={e => setProd({ ...prod, category: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat =>
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            )}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block mb-2 font-medium text-slate-700">Description</label>
          <textarea
            className="w-full px-4 py-2 rounded border border-slate-300 focus:border-blue-500 outline-none shadow"
            placeholder="Describe the product..."
            value={prod.description || ""}
            onChange={e => setProd({ ...prod, description: e.target.value })}
            rows={2}
          />
        </div>
        <div>
          <label className="mb-2 font-medium text-slate-700 flex items-center gap-2"><FiImage /> Image URL</label>
          <input
            className="w-full px-4 py-2 rounded border border-slate-300 focus:border-blue-500 outline-none shadow"
            type="text"
            placeholder="https://...jpg"
            value={prod.image || ""}
            onChange={e => setProd({ ...prod, image: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-slate-700">Stock*</label>
          <input
            className="w-full px-4 py-2 rounded border border-slate-300 focus:border-blue-500 outline-none shadow"
            type="number"
            min={0}
            placeholder="e.g. 30"
            value={prod.stock || ""}
            onChange={e => setProd({ ...prod, stock: parseInt(e.target.value) })}
            required
          />
        </div>
        <button className="sm:col-span-2 w-full mt-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold tracking-wide py-2 rounded-lg shadow transition" type="submit">
          Create Product
        </button>
      </form>
    </section>
  );
}
