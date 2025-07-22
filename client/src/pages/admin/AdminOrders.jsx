import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiClipboard } from "react-icons/fi";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setOrders(res.data.data || res.data));
  }, []);

  if (orders.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500">
        <FiClipboard className="mx-auto text-5xl mb-4 text-blue-300" />
        <p>No orders yet.</p>
      </div>
    );
  }

  return (
    <section className="bg-white/90 shadow-lg rounded-xl p-7">
      <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2 mb-4">
        <FiClipboard /> Orders
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg">
          <thead>
            <tr className="bg-blue-50">
              <th className="px-4 py-2">Order #</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Items</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t hover:bg-blue-50">
                <td className="px-4 py-2">{o._id.slice(-5)}</td>
                <td className="px-4 py-2">{o.user}</td>
                <td className="px-4 py-2">
                  <ul className="text-xs list-disc pl-2">
                    {o.items.map((it, i) => (
                      <li key={i}>
                        {it.product} x {it.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2">${(o.total || 0).toFixed(2)}</td>
                <td className="px-4 py-2">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
