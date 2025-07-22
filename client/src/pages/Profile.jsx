import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiX, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/user/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(response.data.data);
            setFormData(response.data.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:3000/api/user/profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(formData);
            setEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(profile);
        setEditing(false);
        setMessage(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8 border border-gray-200/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                                {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{profile?.name || 'User'}</h1>
                                <p className="text-gray-600">{profile?.email}</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${profile?.role === 'admin'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {profile?.role === 'admin' ? 'Administrator' : 'Customer'}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setEditing(!editing)}
                            className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <FiEdit2 size={16} />
                            {editing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl ${message.type === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Profile Information */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-200/50">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <FiUser className="text-blue-500" />
                                Full Name
                            </label>
                            {editing ? (
                                <input
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            ) : (
                                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                                    {profile?.name || 'Not provided'}
                                </p>
                            )}
                        </div>

                        {/* Email (read-only) */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <FiMail className="text-blue-500" />
                                Email Address
                            </label>
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                                {profile?.email}
                            </p>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <FiPhone className="text-blue-500" />
                                Phone Number
                            </label>
                            {editing ? (
                                <input
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    type="tel"
                                    value={formData.phone || ''}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Enter phone number"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                                    {profile?.phone || 'Not provided'}
                                </p>
                            )}
                        </div>

                        {/* Member Since */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <FiCalendar className="text-blue-500" />
                                Member Since
                            </label>
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}
                            </p>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <FiMapPin className="text-blue-500" />
                                Street Address
                            </label>
                            {editing ? (
                                <input
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    type="text"
                                    value={formData.address?.street || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        address: { ...formData.address, street: e.target.value }
                                    })}
                                    placeholder="Enter street address"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                                    {profile?.address?.street || 'Not provided'}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                City
                            </label>
                            {editing ? (
                                <input
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    type="text"
                                    value={formData.address?.city || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        address: { ...formData.address, city: e.target.value }
                                    })}
                                    placeholder="Enter city"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                                    {profile?.address?.city || 'Not provided'}
                                </p>
                            )}
                        </div>
                    </div>


                    {/* Save/Cancel Buttons */}
                    {editing && (
                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <FiSave size={16} />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors flex items-center gap-2"
                            >
                                <FiX size={16} />
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
