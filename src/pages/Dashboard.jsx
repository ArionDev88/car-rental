import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { getClientDashboard } from '../controllers/clientDashboard';
import { useLoaderData } from 'react-router-dom';

// loader to fetch dashboard info
export async function loader() {
    const info = await getClientDashboard();
    return info;
}

export default function Dashboard() {
    const info = useLoaderData();

    // derive active reservations if needed
    const activeCount = info.totalReservationNumber;

    return (
        <div className="p-8 overflow-auto flex-grow bg-gray-50">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Welcome, {info.clientFullName}!</h1>
                <p className="text-gray-600">Your recent activity and quick actions</p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-gray-500 text-sm mb-2">Active Reservations</h3>
                    <p className="text-3xl font-bold">{activeCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-gray-500 text-sm mb-2">Pending Payments</h3>
                    <p className="text-3xl font-bold">${info.pendingPayment.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-gray-500 text-sm mb-2">Paid Payments</h3>
                    <p className="text-3xl font-bold">${info.paidPayment.toFixed(2)}</p>
                </div>
            </div>

            {/* Reservations Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold mb-6">Your Reservations</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Upcoming', 'Current', 'Past'].map((category) => (
                        <div key={category} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold">{category}</h3>
                                <button
                                    className="text-sm text-primary hover:underline"
                                    onClick={() => console.log(`Navigate to ${category} list`)}
                                >
                                    See full list →
                                </button>
                            </div>

                            {/* TODO: replace static user.reservations with dynamic info.{category.toLowerCase()}Reservations.content */}
                            {/* This example still uses static data or pagination from API */}
                            <p className="text-gray-500 text-sm text-center py-4">
                                No {category.toLowerCase()} reservations
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg">
                            🚗 Browse Available Vehicles
                        </button>
                        <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg">
                            📝 View Rental History
                        </button>
                        <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg">
                            ⚙️ Account Settings
                        </button>
                    </div>
                </div>

                {/* Recommended Vehicles */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 border rounded-lg">
                            <img
                                src="https://images.unsplash.com/photo-1553440569-bcc63803a83d"
                                className="w-20 h-20 object-cover rounded"
                                alt="Car"
                            />
                            <div>
                                <h3 className="font-semibold">Toyota RAV4</h3>
                                <p className="text-gray-600">$65/day • SUV</p>
                                <button className="text-blue-600 text-sm mt-1">
                                    Quick Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Dashboard.loader = loader;