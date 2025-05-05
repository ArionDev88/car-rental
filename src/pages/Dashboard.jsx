// src/pages/Dashboard.jsx
import React from 'react';


export default function Dashboard() {
    // Example user data - replace with actual data from your auth system
    const user = {
        name: "John Doe",
        reservations: [
            {
                id: 1,
                car: "Toyota Camry",
                date: "2024-03-20",
                status: "Starts in 3 days",
                category: "Upcoming"
            },
            {
                id: 2,
                car: "Honda Civic",
                date: "2024-03-18",
                status: "Active now",
                category: "Current"
            },
            {
                id: 3,
                car: "Ford Focus",
                date: "2024-03-15",
                status: "Completed",
                category: "Past"
            },
        ]
    };

    return (
        <div className="p-8 overflow-auto flex-grow bg-gray-50">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
                <p className="text-gray-600">Your recent activity and quick actions</p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-gray-500 text-sm mb-2">Active Reservations</h3>
                    <p className="text-3xl font-bold">2</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-gray-500 text-sm mb-2">Pending Payments</h3>
                    <p className="text-3xl font-bold">$0.00</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-gray-500 text-sm mb-2">Loyalty Points</h3>
                    <p className="text-3xl font-bold">1,250</p>
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

                            {user.reservations
                                .filter(r => r.category.toLowerCase() === category.toLowerCase())
                                .slice(0, 2)
                                .map(reservation => (
                                    <div key={reservation.id} className="flex items-center justify-between p-3 mb-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <h4 className="font-medium">{reservation.car}</h4>
                                            <p className="text-sm text-gray-600">{reservation.date}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${category === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                                            category === 'Current' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {reservation.status}
                                        </span>
                                    </div>
                                ))
                            }

                            {/* Empty State */}
                            {user.reservations.filter(r => r.category === category).length === 0 && (
                                <p className="text-gray-500 text-sm text-center py-4">
                                    No {category.toLowerCase()} reservations
                                </p>
                            )}
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
                        {/* Add more recommended vehicles */}
                    </div>
                </div>
            </div>
        </div>
    );
}
