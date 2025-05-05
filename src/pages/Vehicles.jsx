import React, { useState } from 'react';

export default function Vehicles() {
    // Dummy data array
    const cars = [
        {
            id: 1,
            make: 'Toyota',
            model: 'Camry',
            price: 59,
            type: 'Sedan',
            year: 2022,
            seats: 5,
            transmission: 'Automatic',
            image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d'
        },
        {
            id: 2,
            make: 'Ford',
            model: 'Explorer',
            price: 75,
            type: 'SUV',
            year: 2023,
            seats: 7,
            transmission: 'Automatic',
            image: 'https://images.unsplash.com/photo-1494976388901-8329f0ecb118'
        },
        // Add more dummy cars as needed
    ];

    // State for filters
    const [filters, setFilters] = useState({
        searchTerm: '',
        selectedType: 'all',
        selectedTransmission: 'all',
        priceRange: 1000
    });

    // Filtered cars
    const filteredCars = cars.filter(car => {
        return (
            (car.make.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                car.model.toLowerCase().includes(filters.searchTerm.toLowerCase())
            ) && (
                filters.selectedType === 'all' ||
                car.type.toLowerCase() === filters.selectedType
            ) && (
                filters.selectedTransmission === 'all' ||
                car.transmission.toLowerCase() === filters.selectedTransmission
            ) && (
                car.price <= filters.priceRange
            )
        );
    });

    return (
        <div className="p-8">
            {/* Filters Section */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Find Your Perfect Car</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search make or model..."
                        className="input input-bordered w-full"
                        value={filters.searchTerm}
                        onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                    />

                    {/* Car Type Dropdown */}
                    <select
                        className="select select-bordered w-full"
                        value={filters.selectedType}
                        onChange={(e) => setFilters({ ...filters, selectedType: e.target.value })}
                    >
                        <option value="all">All Types</option>
                        <option value="sedan">Sedan</option>
                        <option value="suv">SUV</option>
                        <option value="truck">Truck</option>
                        <option value="van">Van</option>
                    </select>

                    {/* Transmission Dropdown */}
                    <select
                        className="select select-bordered w-full"
                        value={filters.selectedTransmission}
                        onChange={(e) => setFilters({ ...filters, selectedTransmission: e.target.value })}
                    >
                        <option value="all">All Transmissions</option>
                        <option value="automatic">Automatic</option>
                        <option value="manual">Manual</option>
                    </select>

                    {/* Price Range Slider */}
                    <div className="space-y-2">
                        <label className="label">
                            <span className="label-text">Max Daily Price: ${filters.priceRange}</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            value={filters.priceRange}
                            className="range range-primary"
                            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Cars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map(car => (
                    <div key={car.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                        <figure>
                            <img
                                src={car.image}
                                alt={`${car.make} ${car.model}`}
                                className="h-48 w-full object-cover"
                            />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">
                                {car.make} {car.model}
                                <div className="badge badge-secondary">{car.year}</div>
                            </h2>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-2xl font-bold">${car.price}/day</p>
                                    <p className="text-sm text-gray-500">${car.price * 7}/week</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span>🚗</span>
                                        <span>{car.type}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>⚙️</span>
                                        <span>{car.transmission}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="card-actions justify-end">
                                <button className="btn btn-primary w-full">
                                    Rent Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredCars.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-500 mb-4">No vehicles match your filters</p>
                    <button
                        className="btn btn-ghost"
                        onClick={() => setFilters({
                            searchTerm: '',
                            selectedType: 'all',
                            selectedTransmission: 'all',
                            priceRange: 1000
                        })}
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}