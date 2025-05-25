import { getClientDashboard } from '../controllers/clientDashboard';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPromotions } from '../controllers/promotions';

// loader to fetch dashboard info
export async function loader() {
    const info = await getClientDashboard();
    return info;
}

export default function Dashboard() {
    const info = useLoaderData();
    const navigate = useNavigate();

    const activeCount = info.activeReservationNumber;

    const { data: promotions } = useQuery({
        queryKey: ['promotions'],
        queryFn: getPromotions,
    });

    // Extract cars from the first promotion, limit to two
    const recommendedCars = promotions && promotions.length > 0
        ? promotions[0].cars.slice(0, 2)
        : [];

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
                    {['Future', 'Active', 'Past'].map((category) => {
                        const reservations = info[`${category.toLowerCase()}Reservations`].content;
                        const displayCategory = category === 'Future' ? 'Upcoming' : category; // Display "Upcoming" for "Future" data

                        const firstReservation = reservations.length > 0 ? reservations.slice(-1)[0] : null;
                        return (
                            <div key={category} className="border rounded-lg p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold">{displayCategory}</h3>
                                    <button
                                        className="text-sm text-primary hover:underline cursor-pointer"
                                        onClick={() => {
                                            switch (category) {
                                                case 'Future':
                                                    navigate('/homepage/future-reservations');
                                                    break;
                                                case 'Active':
                                                    navigate('/homepage/active-reservations');
                                                    break;
                                                case 'Past':
                                                    navigate('/homepage/past-reservations');
                                                    break;
                                                default:
                                                    break;
                                            }
                                        }}
                                    >
                                        See full list →
                                    </button>
                                </div>

                                {firstReservation ? (
                                    <div className="text-sm">
                                        <p className="font-medium">Car: {firstReservation.carLicense}</p>
                                        <p className="text-gray-600">
                                            From: {firstReservation.startDate} to {firstReservation.endDate}
                                        </p>
                                        <p className="text-gray-600">
                                            Amount: ${firstReservation.totalAmount.toFixed(2)}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm text-center py-4">
                                        No {displayCategory.toLowerCase()} reservations
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg"
                            onClick={() => navigate('/homepage/browse-vehicles')}
                        >
                            🚗 Browse Available Vehicles
                        </button>
                        <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                            onClick={() => navigate('/homepage/my-reservations')}
                        >
                            📝 View Rental History
                        </button>
                        <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg"
                            onClick={() => navigate('/homepage/my-profile')}
                        >
                            ⚙️ Account Settings
                        </button>
                    </div>
                </div>

                {/* Recommended Vehicles */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
                    <div className="space-y-4">
                        {recommendedCars.length > 0 ? (
                            recommendedCars.map((car) => (
                                <div key={car.id} className="flex items-center gap-4 p-3 border rounded-lg">
                                    <img
                                        src={car.imageUrls[0]}
                                        className="w-20 h-20 object-cover rounded"
                                        alt={`${car.brand.brandName} ${car.model.carModelName}`}
                                    />
                                    <div>
                                        <h3 className="font-semibold">{car.brand.brandName} {car.model.carModelName}</h3>
                                        <p className="text-gray-600">${car.pricePerDay.toFixed(2)}/day • {car.category}</p>
                                        <button className="text-blue-600 text-sm mt-1" onClick={() => navigate(`/homepage/browse-vehicles/${car.id}`)}>
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm text-center py-4">No recommended vehicles available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

Dashboard.loader = loader;