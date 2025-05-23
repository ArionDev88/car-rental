import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPastReservation } from "../controllers/reservations";
import { makeReview, removeReview } from "../controllers/reviews";

export default function PastReservations() {
  const queryClient = useQueryClient();

  // Store selected stars per carId
  const [selectedStars, setSelectedStars] = useState({});

  const {
    data: pastReservations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["past-reservations"],
    queryFn: getPastReservation,
  });

  // --- PAGINATION STATE ---
  const itemsPerPage = 5; // adjust as needed
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = pastReservations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedReservations = pastReservations.slice(
    startIdx,
    startIdx + itemsPerPage
  );

  const handleStarClick = async (carId, rating) => {
    // Update UI immediately for this carId
    setSelectedStars((prev) => ({ ...prev, [carId]: rating }));

    try {
      // Call your “submit rating” endpoint
      await makeReview(carId, rating);
      queryClient.invalidateQueries(["past-reservations"]);
      console.log(`Submitted rating ${rating} for car ${carId}`);
    } catch (e) {
      console.error("Failed to submit rating", e);
      // On failure, revert to API value (will be reset below on re-render)
      setSelectedStars((prev) => {
        const copy = { ...prev };
        delete copy[carId];
        return copy;
      });
    }
  };

  const handleRemoveRating = async (carId) => {
    try {
      await removeReview(carId);
      // Clear local override for this carId
      setSelectedStars((prev) => {
        const copy = { ...prev };
        copy[carId] = 0;
        return copy;
      });
      queryClient.invalidateQueries(["past-reservations"]);
    } catch (e) {
      console.error("Failed to remove rating", e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-500">Loading past reservations…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-red-600">An error occurred while fetching data.</p>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-600">No past reservations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 m-auto">
      {/* ─── Heading ─── */}
      <h2 className="text-3xl font-bold text-gray-800 text-center">Past Reservations</h2>

      {paginatedReservations.map((reservation) => {
        const { carResponseDTO: car, startDate, endDate, totalAmount, status, createdAt } =
          reservation;

        // Get the first review's rating (if any)
        const defaultRating = car.reviewResponseDTOS?.[0]?.rating ?? 0;
        // If user clicked stars, use that; otherwise use default
        const displayStars =
          selectedStars[car.id] != null ? selectedStars[car.id] : defaultRating;

        return (
          <div
            key={`${car.id}-${startDate}`}
            className="border rounded-lg shadow-sm overflow-hidden"
          >
            {/* ─── Reservation Header ─── */}
            <div className="bg-gray-100 px-3 py-2 flex flex-col md:flex-row md:items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Dates:</span>{" "}
                  {new Date(startDate).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  –{" "}
                  {new Date(endDate).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Total:</span> €
                  {totalAmount.toLocaleString()}{" "}
                  <span className="mx-1">|</span>
                  <span className="font-semibold">Status:</span> {status}
                </p>
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Booked on:</span>{" "}
                  {new Date(createdAt).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* ─── Car Card ─── */}
            <div className="bg-white p-3 md:p-4 flex flex-col md:flex-row gap-4">
              {/* Left: 2×2 Image Grid */}
              <div className="w-full md:w-1/3 grid grid-rows-2 grid-cols-2 gap-1">
                {car.imageUrls[0] && (
                  <img
                    src={car.imageUrls[0]}
                    alt={`${car.brand.brandName} ${car.model.carModelName} #1`}
                    className="col-span-2 row-span-1 h-36 w-full object-cover rounded"
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

              {/* Right: Car Details */}
              <div className="flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">
                      {car.brand.brandName} {car.model.carModelName}
                    </h3>
                    {car.status === "AVAILABLE" ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                        Available
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                        {car.status}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm">
                    <strong>License:</strong> {car.licensePlate} &nbsp; | &nbsp;
                    <strong>Year:</strong> {car.year} &nbsp; | &nbsp;
                    <strong>Mileage:</strong> {car.mileage.toLocaleString()} km
                  </p>

                  <p className="text-xl font-semibold text-blue-600">
                    €{car.pricePerDay.toLocaleString()} / day
                  </p>

                  <p className="text-xs text-gray-500">
                    <strong>Category:</strong> {car.category}
                  </p>

                  <div>
                    <h4 className="font-medium text-gray-700 text-sm mb-1">Features:</h4>
                    <ul className="flex flex-wrap gap-1">
                      {car.features.map((feat) => (
                        <li
                          key={feat}
                          className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-[10px]"
                        >
                          {feat.replace(/_/g, " ")}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t mt-2">
                  <p className="text-xs text-gray-700">
                    <strong>Branch:</strong> {car.branch.name}, {car.branch.city}
                  </p>
                  <p className="text-xs text-gray-700">
                    <strong>Address:</strong> {car.branch.address}
                  </p>
                </div>

                {/* ─── Clickable Stars + “Remove Rating” Button ─── */}
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
          </div>
        );
      })}

      {/* ─── Pagination Controls ─── */}
      <div className="flex justify-center items-center space-x-2 pt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-3 py-1 rounded ${
                pageNum === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
