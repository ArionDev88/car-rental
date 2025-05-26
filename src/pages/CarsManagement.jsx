import { getAllCars } from "../controllers/cars";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { deleteCar } from "../controllers/cars";

export default function CarsManagement() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const { data: cars, isLoading, error } = useQuery({
        queryKey: ['cars', page],
        queryFn: getAllCars,
    });

    const queryClient = useQueryClient();
    const deleteCarMutation = useMutation({
        mutationFn: deleteCar,
        onSuccess: () => {
            queryClient.invalidateQueries(['cars', page]);
        },
        onError: (error) => {
            console.error("Error deleting car:", error);
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading cars: {error.message}</div>;
    
    const handleDeleteCar = (carId) => {
        deleteCarMutation.mutate(carId);
    }

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.content.map((car) => (
                    <div key={car.id} className="border rounded-lg shadow-lg p-4 cursor-pointer"
                        onClick={() => navigate(`car/${car.id}`)}
                    >
                        {/* Car Images */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {car.imageUrls.slice(0, 3).map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Car ${index + 1}`}
                                    className="h-32 w-full object-cover rounded"
                                />
                            ))}
                        </div>

                        {/* Basic Info */}
                        <div className="mb-4">
                            <h2 className="text-xl font-bold">
                                {car.brand.brandName} {car.model.carModelName}
                            </h2>
                            <p className="text-gray-600">{car.year} • {car.mileage} km</p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-lg font-semibold">
                                    ${car.pricePerDay.toFixed(2)}/day
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {car.category}
                                </span>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Features:</h3>
                            <div className="flex flex-wrap gap-2">
                                {car.features.map((feature, index) => (
                                    <span
                                        key={index}
                                        className="bg-gray-100 px-2 py-1 rounded text-sm"
                                    >
                                        {feature.replace(/_/g, ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Branch Info */}
                        <div className="border-t pt-4">
                            <p className="text-sm text-gray-600">
                                Located at: {car.branch.address}, {car.branch.city}
                            </p>
                        </div>

                        {/* Delete Button */}
                        <div className="mt-4">
                            <button className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCar(car.id);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-4">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 0}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>Page {page + 1} of {cars.page.totalPages}</span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= cars.page.totalPages - 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>

        </div>
    );
}