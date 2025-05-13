import React, { useState, useMemo } from 'react';

export default function VehicleMarketplace() {
    const cars = [
        {
            id: 1,
            make: 'Audi',
            model: 'A1 Sportback 25 TFSI',
            price: 21950,
            year: '11/2024',
            mileage: 4000,
            color: 'Silver',
            purchaseType: 'Buy',
            power: '70 kW (95 PS)',
            fuelType: 'Petrol',
            features: ['PDC', 'LED', 'Heated seats', 'Cruise control'],
            dealer: 'W. POTTHOFF GmbH',
            location: '59075 Hamm',
            image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d',
            sponsored: true,
            details: 'Accident-free • Demo vehicle • Reg 11/2024 • 4,000 km • 70 kW (95 PS) • Petrol',
            consumption: '5.3 l/100km (comb.) • 120 g CO₂/km (comb.) • CO₂ class D (comb.)'
        },
        {
            id: 2,
            make: 'Volkswagen',
            model: 'Golf GTI Performance',
            price: 34900,
            year: '06/2023',
            mileage: 12000,
            color: 'Red',
            purchaseType: 'Rent',
            power: '180 kW (245 PS)',
            fuelType: 'Petrol',
            features: ['Tempomat', 'Camera', 'Sports suspension'],
            dealer: 'Auto Center Berlin',
            location: '10115 Berlin',
            image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7',
            sponsored: false,
            details: 'Accident-free • Reg 06/2023 • 12,000 km • 180 kW (245 PS) • Petrol',
            consumption: '6.9 l/100km (comb.) • 158 g CO₂/km (comb.) • CO₂ class E (comb.)'
        },
    ];

    const [filters, setFilters] = useState({
        priceMin: '',
        priceMax: '',
        yearMin: '',
        yearMax: '',
        color: 'All',
        purchaseType: 'All'
    });

    const [results, setResults] = useState(cars);

    // Get unique filter options
    const colors = useMemo(() => [...new Set(cars.map(car => car.color))], [cars]);
    const purchaseTypes = ['Buy', 'Rent'];
    const currentYear = new Date().getFullYear();

    const applyFilters = () => {
        const filtered = cars.filter(car => {
            const carYear = parseInt(car.year.split('/')[1]);
            return (
                (!filters.priceMin || car.price >= filters.priceMin) &&
                (!filters.priceMax || car.price <= filters.priceMax) &&
                (!filters.yearMin || carYear >= filters.yearMin) &&
                (!filters.yearMax || carYear <= filters.yearMax) &&
                (filters.color === 'All' || car.color === filters.color) &&
                (filters.purchaseType === 'All' || car.purchaseType === filters.purchaseType)
            );
        });
        setResults(filtered);
    };

    const resetFilters = () => {
        setFilters({
            priceMin: '',
            priceMax: '',
            yearMin: '',
            yearMax: '',
            color: 'All',
            purchaseType: 'All'
        });
        setResults(cars);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 min-h-screen">
            {/* Filters Sidebar */}
            <div className="w-full md:w-80 bg-white p-4 rounded-lg shadow-md">

                {/* Price Filter */}
                <div className="mb-4">
                    <h2 className="font-bold mb-2">Price (€)</h2>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="From"
                            className="w-full p-2 border rounded"
                            value={filters.priceMin}
                            onChange={e => setFilters({ ...filters, priceMin: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="To"
                            className="w-full p-2 border rounded"
                            value={filters.priceMax}
                            onChange={e => setFilters({ ...filters, priceMax: e.target.value })}
                        />
                    </div>
                </div>

                {/* Year Filter */}
                <div className="mb-4">
                    <h2 className="font-bold mb-2">Year</h2>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="From"
                            className="w-full p-2 border rounded"
                            value={filters.yearMin}
                            onChange={e => setFilters({ ...filters, yearMin: e.target.value })}
                            min="2000"
                            max={currentYear + 1}
                        />
                        <input
                            type="number"
                            placeholder="To"
                            className="w-full p-2 border rounded"
                            value={filters.yearMax}
                            onChange={e => setFilters({ ...filters, yearMax: e.target.value })}
                            min="2000"
                            max={currentYear + 1}
                        />
                    </div>
                </div>

                {/* Color Filter */}
                <div className="mb-4">
                    <h2 className="font-bold mb-2">Color</h2>
                    <select
                        className="w-full p-2 border rounded"
                        value={filters.color}
                        onChange={e => setFilters({ ...filters, color: e.target.value })}
                    >
                        <option value="All">All Colors</option>
                        {colors.map(color => (
                            <option key={color} value={color}>{color}</option>
                        ))}
                    </select>
                </div>

                {/* Purchase Type Filter */}
                <div className="mb-6">
                    <h2 className="font-bold mb-2">Purchase Type</h2>
                    <select
                        className="w-full p-2 border rounded"
                        value={filters.purchaseType}
                        onChange={e => setFilters({ ...filters, purchaseType: e.target.value })}
                    >
                        <option value="All">All Types</option>
                        {purchaseTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <button
                        onClick={applyFilters}
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >
                        Apply Filters
                    </button>
                    <button
                        onClick={resetFilters}
                        className="w-full bg-gray-200 p-2 rounded hover:bg-gray-300"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Car Listings (kept exactly the same as before) */}
            <div className="flex-1 space-y-4">
                {results.map(car => (
                    <div key={car.id} className="bg-white p-6 rounded-lg shadow-md">
                        {car.sponsored && (
                            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm mb-4 inline-block">
                                Sponsored
                            </div>
                        )}

                        <div className="flex gap-6">
                            <img
                                src={car.image}
                                alt={car.make}
                                className="w-48 h-48 object-cover rounded-lg"
                            />

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold">{car.make} {car.model}</h2>
                                        <p className="text-gray-600 mt-1">{car.details}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">€{car.price.toLocaleString()}<sup>1</sup></p>
                                        <p className="text-sm text-gray-500">Insurance from €10.94/month</p>
                                    </div>
                                </div>

                                <div className="my-4">
                                    <p className="text-sm text-gray-600">{car.consumption}</p>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="font-semibold">{car.dealer} • {car.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};