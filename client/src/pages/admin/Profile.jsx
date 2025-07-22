import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiUser } from "react-icons/fi";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setProfile(res.data.data || res.data));
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <section className="bg-white/90 shadow-lg rounded-xl p-7 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2 mb-4">
        <FiUser /> Admin Profile
      </h2>
      <div className="text-gray-700 flex flex-col gap-2">
        <div>
          <span className="font-semibold">Email:</span> {profile.email}
        </div>
        <div>
          <span className="font-semibold">Role:</span> {profile.role}
        </div>
      </div>
    </section>
  );
}
