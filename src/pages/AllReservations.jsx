import { useState } from "react";
import { getReservations, updateReservationStatus, downloadReservationsReport } from "../controllers/reservations";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export default function AllReservations() {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            from: "",
            to: "",
            status: "",
        },
    });

    const [currentFilters, setCurrentFilters] = useState({});
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const fetchReservations = useQuery({
        queryKey: ["reservations", currentFilters, page],
        queryFn: () => getReservations({ ...currentFilters, page, pageSize }),
        onError: (error) => {
            console.error("Error fetching reservations:", error);
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ reservationId, status }) =>
            updateReservationStatus(reservationId, status),
        onSuccess: () => {
            queryClient.invalidateQueries(["reservations"]);
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
        setCurrentFilters(filters);
        setPage(0);
    };

    const handleMakeActive = (reservationId) => {
        updateStatusMutation.mutate({ reservationId, status: "ACTIVE" });
    };

    const handleComplete = (reservationId) => {
        updateStatusMutation.mutate({ reservationId, status: "COMPLETED" });
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

    const showActionsColumn = fetchReservations.data?.content.some(
        (res) =>
            res.status === "PENDING" ||
            res.status === "PAID" ||
            res.status === "CONFIRMED" ||
            res.status === "NO_SHOW"
    );

    const handleDownloadReport = async () => {
        try {
            const report = await downloadReservationsReport();
            const blob = new Blob([report], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
        }catch (error) {
            console.error("Error downloading report:", error);
        }
    }

    return (
        <div className="w-full p-4">
            <h1 className="text-2xl font-bold mb-6">All Reservations</h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded-lg shadow-md mb-8"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label
                            htmlFor="from"
                            className="block text-sm font-medium text-gray-700"
                        >
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
                        <label
                            htmlFor="to"
                            className="block text-sm font-medium text-gray-700"
                        >
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
                        <label
                            htmlFor="status"
                            className="block text-sm font-medium text-gray-700"
                        >
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
                        onClick={() => {
                            reset();
                            setCurrentFilters({});
                            setPage(0);
                        }}
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

            <button className='bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 mr-2 mb-4'
                onClick={handleDownloadReport}
            >
                Download Report
            </button>

            {fetchReservations.isLoading ? (
                <div className="text-center text-gray-500">Loading reservations…</div>
            ) : fetchReservations.isError ? (
                <div className="text-center text-red-500">
                    Error: {String(fetchReservations.error)}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {fetchReservations.data && fetchReservations.data.content.length > 0 ? (
                        <>
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 border">ID</th>
                                        <th className="px-4 py-2 border">Car License</th>
                                        <th className="px-4 py-2 border">Client Username</th>
                                        <th className="px-4 py-2 border">Start Date</th>
                                        <th className="px-4 py-2 border">End Date</th>
                                        <th className="px-4 py-2 border">Total Amount</th>
                                        <th className="px-4 py-2 border">Status</th>
                                        {showActionsColumn && (
                                            <th className="px-4 py-2 border">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {fetchReservations.data.content.map((reservation) => (
                                        <tr key={reservation.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border">{reservation.id}</td>
                                            <td className="px-4 py-2 border">
                                                {reservation.carLicense}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {reservation.clientUsername}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {reservation.startDate}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {reservation.endDate}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                ${reservation.totalAmount.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reservation.status === "ACTIVE" ||
                                                        reservation.status === "CONFIRMED"
                                                        ? "bg-green-100 text-green-800"
                                                        : reservation.status === "PENDING" ||
                                                            reservation.status === "PAID"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {reservation.status}
                                                </span>
                                            </td>
                                            {showActionsColumn && (
                                                <td className="px-4 py-2 border">
                                                    {reservation.status === "PENDING" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleConfirm(reservation.id)}
                                                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm mr-2"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancel(reservation.id)}
                                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    )}
                                                    {reservation.status === "CONFIRMED" && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleMakeActive(reservation.id)}
                                                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                                                            >
                                                                Make Active
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancel(reservation.id)}
                                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    )}
                                                    {reservation.status === "PAID" && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleMakeActive(reservation.id)}
                                                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                                                            >
                                                                Make Active
                                                            </button>
                                                            <button
                                                                onClick={() => handleNoShow(reservation.id)}
                                                                className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 text-sm"
                                                            >
                                                                No Show
                                                            </button>
                                                        </div>
                                                    )}
                                                    {reservation.status === "ACTIVE" && (
                                                        <button
                                                            onClick={() => handleComplete(reservation.id)}
                                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                                                        >
                                                            Complete
                                                        </button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    {fetchReservations.data.content.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={showActionsColumn ? 8 : 7}
                                                className="px-4 py-6 text-center text-gray-500"
                                            >
                                                No reservations found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <div className="flex items-center justify-between mt-4">
                                <button
                                    onClick={() => setPage((old) => Math.max(old - 1, 0))}
                                    disabled={page === 0}
                                    className={`px-3 py-1 rounded ${page === 0
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                >
                                    Previous
                                </button>

                                <span className="text-sm">
                                    Page{" "}
                                    <strong>
                                        {fetchReservations.data.page.number + 1} of{" "}
                                        {fetchReservations.data.page.totalPages}
                                    </strong>{" "}
                                    — Total: {fetchReservations.data.page.totalElements} entries
                                </span>

                                <button
                                    onClick={() =>
                                        setPage((old) =>
                                            fetchReservations.data &&
                                                old + 1 < fetchReservations.data.page.totalPages
                                                ? old + 1
                                                : old
                                        )
                                    }
                                    disabled={
                                        !fetchReservations.data ||
                                        page + 1 >= fetchReservations.data.page.totalPages
                                    }
                                    className={`px-3 py-1 rounded ${!fetchReservations.data ||
                                        page + 1 >= fetchReservations.data.page.totalPages
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            No reservations found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
