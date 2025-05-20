import { useState } from "react";
import { getReservations, updateReservationStatus } from "../controllers/reservations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export default function AllReservations() {
    const queryClient = useQueryClient();
    const [currentFilters, setCurrentFilters] = useState({});
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            from: "",
            to: "",
            status: "",
        },
    });

    const fetchReservations = useMutation({
        mutationFn: (filters) => getReservations(filters),
        onError: (error) => {
            console.error("Error fetching reservations:", error);
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ reservationId, status }) => updateReservationStatus(reservationId, status),
        onSuccess: () => {
            queryClient.invalidateQueries(["reservations"]); // Invalidate and refetch reservations after update
            fetchReservations.mutate(currentFilters); // Re-fetch with current filters
        },
        onError: (error) => {
            console.error("Error updating reservation status:", error);
        },
    });

    const onSubmit = (data) => {
        const filters = {
            from: data.from,
            to: data.to,
            status: data.status,
        };
        fetchReservations.mutate(filters);
        setCurrentFilters(filters); // Store current filters for re-fetching
    };

    const handleConfirm = (reservationId) => {
        updateStatusMutation.mutate({ reservationId, status: "CONFIRMED" });
    };

    const handleCancel = (reservationId) => {
        updateStatusMutation.mutate({ reservationId, status: "CANCELLED" });
    };

    const handleNoShow = (reservationId) => {
        updateStatusMutation.mutate({ reservationId, status: "NO_SHOW" });
    };

    const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
    if (!hasFetchedOnce) {
        fetchReservations.mutate({});
        setHasFetchedOnce(true);
    }

    const showActionsColumn = fetchReservations.data?.content.some(
        (res) => res.status === 'PENDING' || res.status === 'PAID' || res.status === 'CONFIRMED'
    );

    return (
        <div className="w-full p-8">
            <h1 className="text-2xl font-bold mb-6">All Reservations</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="from" className="block text-sm font-medium text-gray-700">
                            Available From:
                        </label>
                        <input
                            type="date"
                            id="from"
                            {...register("from")}
                            className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                    </div>
                    <div>
                        <label htmlFor="to" className="block text-sm font-medium text-gray-700">
                            Available To:
                        </label>
                        <input
                            type="date"
                            id="to"
                            {...register("to")}
                            className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status:
                        </label>
                        <select
                            id="status"
                            {...register("status")}
                            className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        >
                            <option value="">All</option>
                            <option value="ACTIVE">Active</option>
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PAID">Paid</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="NO_SHOW">No Show</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Apply Filters
                    </button>
                </div>
            </form>

            {fetchReservations.isLoading ? (
                <div className="text-center text-gray-500">Loading reservations...</div>
            ) : fetchReservations.isError ? (
                <div className="text-center text-red-500">Error: {fetchReservations.error.message}</div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {fetchReservations.data && fetchReservations.data.content.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Car License
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Client Username
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Start Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        End Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Amount
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    {showActionsColumn && (
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {fetchReservations.data.content.map((reservation) => (
                                    <tr key={reservation.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {reservation.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {reservation.carLicense}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {reservation.clientUsername}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {reservation.startDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {reservation.endDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${reservation.totalAmount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reservation.status === 'ACTIVE' || reservation.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                                reservation.status === 'PENDING' || reservation.status === 'PAID' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {reservation.status}
                                            </span>
                                        </td>
                                        {showActionsColumn && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {reservation.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleConfirm(reservation.id)}
                                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancel(reservation.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                                {reservation.status === 'CONFIRMED' && (
                                                    <button
                                                        onClick={() => handleCancel(reservation.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                                {reservation.status === 'PAID' && (
                                                    <button
                                                        onClick={() => handleNoShow(reservation.id)}
                                                        className="text-orange-600 hover:text-orange-900"
                                                    >
                                                        No Show
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center text-gray-500 py-8">No reservations found.</div>
                    )}
                </div>
            )}
        </div>
    );
}
