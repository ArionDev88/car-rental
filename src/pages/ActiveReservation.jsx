import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentReservation } from "../controllers/reservations";
import { makeReview, removeReview } from "../controllers/reviews";

export default function ActiveReservation() {
    const [selectedStars, setSelectedStars] = useState(null);
    const queryClient = useQueryClient();
    const {
        data: reservation,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["current-reservation"],
        queryFn: getCurrentReservation,
    });

    const defaultRating =
        reservation?.carResponseDTO?.reviewResponseDTOS?.[0]?.rating ?? 0;

    const displayStars = selectedStars !== null ? selectedStars : defaultRating;

    const handleStarClick = async (carId, rating) => {
        // Update UI immediately
        setSelectedStars(rating);
        try {
            // Call your “submit rating” endpoint, passing carId and rating
            await makeReview(carId, rating);
            queryClient.invalidateQueries(["current-reservation"]);


            console.log(`Submit rating ${rating} for car ${carId}`);
        } catch (e) {
            console.error("Failed to submit rating", e);
            setSelectedStars(0);
        }

    };

    const handleRemoveRating = async (carId) => {
        try {
            await removeReview(carId);
            queryClient.invalidateQueries(["current-reservation"]);
            setSelectedStars(0);
        } catch (e) {
            console.error("Failed to remove rating", e);
        }
    };

    if (isLoading) {
        return <div className="text-center py-8">Loading your active reservation…</div>;
    }

    if (error) {
        return (
            <div className="text-red-500 text-center py-8">
                Error loading reservation: {error.message}
            </div>
        );
    }

    if (!reservation || !reservation.carResponseDTO) {
        return <div className="text-center py-8">No active reservation found.</div>;
    }

    const car = reservation.carResponseDTO;
    const displayRating = Math.round(car.averageRating || 0);
    const stars = Array.from({ length: 5 }, (_, idx) =>
        idx < displayRating ? "★" : "☆"
    ).join("");

    return (
        <div
            key={car.id}
            className="bg-white p-3 rounded-lg shadow-md flex flex-col md:flex-row gap-6"
        >
            {/* ─── Left: Single Image (instead of full 2×2 grid) ─── */}
            <div className="w-full md:w-1/3 grid grid-rows-2 grid-cols-2 gap-2">
                {car.imageUrls[0] && (
                    <img
                        src={car.imageUrls[0]}
                        alt={`${car.brand.brandName} ${car.model.carModelName} #1`}
                        className="col-span-2 row-span-1 h-48 w-full object-cover rounded"
                    />
                )}
                {car.imageUrls[1] && (
                    <img
                        src={car.imageUrls[1]}
                        alt={`${car.brand.brandName} ${car.model.carModelName} #2`}
                        className="h-full w-full object-cover rounded"
                    />
                )}
                {car.imageUrls[2] && (
                    <img
                        src={car.imageUrls[2]}
                        alt={`${car.brand.brandName} ${car.model.carModelName} #3`}
                        className="h-full w-full object-cover rounded"
                    />
                )}
            </div>

            {/* ─── Right: Car Details ─── */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">
                            {car.brand.brandName} {car.model.carModelName}
                        </h2>
                        {car.status === "AVAILABLE" ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                                Available
                            </span>
                        ) : (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded">
                                {car.status}
                            </span>
                        )}
                    </div>

                    <p className="mt-2 text-gray-600">
                        <strong>License:</strong> {car.licensePlate} &nbsp; | &nbsp;
                        <strong>Year:</strong> {car.year} &nbsp; | &nbsp;
                        <strong>Mileage:</strong> {car.mileage.toLocaleString()} km
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-blue-600">
                        €{car.pricePerDay.toLocaleString()} / day
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        <strong>Category:</strong> {car.category}
                    </p>

                    <div className="mt-4">
                        <h3 className="font-medium text-gray-700 mb-1">Features:</h3>
                        <ul className="flex flex-wrap gap-2">
                            {car.features.map((feat) => (
                                <li
                                    key={feat}
                                    className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                                >
                                    {feat.replace(/_/g, " ")}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-4 border-t mt-4">
                    <p className="text-sm text-gray-700">
                        <strong>Branch:</strong> {car.branch.name}, {car.branch.city}
                    </p>
                    <p className="text-sm text-gray-700">
                        <strong>Address:</strong> {car.branch.address}
                    </p>
                </div>

                {/* ─── Rating Display + “Remove Rating” Button ─── */}
                <div className="mt-4 flex items-center justify-between">
                    <div>
                        {Array.from({ length: 5 }, (_, idx) => {
                            const starValue = idx + 1;
                            return (
                                <button
                                    key={starValue}
                                    type="button"
                                    onClick={() => handleStarClick(car.id, starValue)}
                                    className="text-2xl text-yellow-500 focus:outline-none"
                                >
                                    {starValue <= displayStars ? "★" : "☆"}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={() => handleRemoveRating(car.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm cursor-pointer"
                    >
                        Remove Rating
                    </button>
                </div>
            </div>
        </div>
    );
}
