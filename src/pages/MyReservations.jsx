import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMyReservations,
    cancelReservation,
    editReservation,
} from "../controllers/reservations";

export default function MyReservations() {
    const [pageNumber, setPageNumber] = useState(0);
    const pageSize = 10;
    const queryClient = useQueryClient();

    // ---------------------------------------------------
    // 1) Mutation: cancel a reservation
    // ---------------------------------------------------
    const cancelMutation = useMutation({
        mutationFn: (id) => cancelReservation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["my-reservations", pageNumber],
            });
        },
        onError: (error) => {
            console.error("Error cancelling reservation:", error);
        },
    });

    // ---------------------------------------------------
    // 2) Mutation: edit reservation (dates and/or payment)
    // ---------------------------------------------------
    const editMutation = useMutation({
        mutationFn: ({ id, carId, startDate, endDate, paymentOption }) =>
            editReservation(id, { carId, startDate, endDate, paymentOption }),
        onSuccess: (data) => {
            if (data?.url) {
                window.location.href = data.url;
            } else {
                queryClient.invalidateQueries({
                    queryKey: ["my-reservations", pageNumber],
                });
                setEditingId(null);
            }
        },
        onError: (error) => {
            console.error("Error editing reservation:", error);
        },
    });

    // ---------------------------------------------------
    // 3) Query: fetch paginated reservations
    // ---------------------------------------------------
    const {
        data: pagedData,
        isLoading,
        error,
        isFetching,
    } = useQuery({
        queryKey: ["my-reservations", pageNumber],
        queryFn: () =>
            getMyReservations({
                page: pageNumber,
                size: pageSize,
            }),
        keepPreviousData: true,
    });

    // ---------------------------------------------------
    // 4) Local state for editing
    // ---------------------------------------------------
    const [editingId, setEditingId] = useState(null);
    const [newDates, setNewDates] = useState({ start: "", end: "" });
    const [payNowChecked, setPayNowChecked] = useState(false);

    if (isLoading) return <div>Loading reservations…</div>;
    if (error)
        return (
            <div className="text-red-600">
                Error loading reservations: {error.message}
            </div>
        );

    const reservations = pagedData.content;
    const { number, totalPages } = pagedData.page;

    return (
        <div className="p-4 w-full">
            {/* ───────────────────────────────────────────── */}
            {/* FULL-WIDTH CARD LIST */}
            {/* ───────────────────────────────────────────── */}
            <div className="flex flex-col gap-4">
                {reservations.map((reservation) => {
                    const {
                        id,
                        carId,
                        carLicense,
                        clientUsername,
                        startDate,
                        endDate,
                        totalAmount,
                        status,
                        createdAt,
                    } = reservation;

                    const isEditableOrPayable =
                        status === "PENDING" || status === "CONFIRMED";
                    const isCancellable = isEditableOrPayable;
                    const currentlyEditing = editingId === id;

                    return (
                        <div
                            key={id}
                            className="w-full bg-white border border-gray-200 shadow-sm rounded-lg p-4"
                        >
                            <div className="flex flex-wrap items-center text-sm">
                                {/* ID */}
                                <span className="flex-none px-2">
                                    <span className="font-medium text-gray-700">#{id}</span>
                                </span>

                                {/* Car License */}
                                <span className="flex-none px-2 border-l border-gray-300">
                                    <span className="text-gray-600">
                                        Car License: {carLicense}
                                    </span>
                                </span>

                                {/* Client Username */}
                                <span className="flex-none px-2 border-l border-gray-300">
                                    <span className="text-gray-600">
                                        Client: {clientUsername}
                                    </span>
                                </span>

                                {/* Status */}
                                <span className="flex-none px-2 border-l border-gray-300">
                                    <span>Status: </span>
                                    <span
                                        className={`ml-1 text-sm font-semibold ${status === "PAID" ? "text-green-600" : "text-yellow-600"
                                            }`}
                                    >
                                        {status}
                                    </span>
                                </span>

                                {/* Amount */}
                                <span className="flex-none px-2 border-l border-gray-300">
                                    <span className="text-gray-600">
                                        Amount: ${totalAmount.toFixed(2)}
                                    </span>
                                </span>

                                {/* Created At */}
                                <span className="flex-none px-2 border-l border-gray-300">
                                    <span className="text-gray-500">
                                        Created at: {createdAt}
                                    </span>
                                </span>

                                {/* Reservation Time */}
                                <span className="flex-none px-2 border-l border-gray-300">
                                    {currentlyEditing ? (
                                        <>
                                            <input
                                                type="date"
                                                value={newDates.start}
                                                onChange={(e) =>
                                                    setNewDates((prev) => ({
                                                        ...prev,
                                                        start: e.target.value,
                                                    }))
                                                }
                                                className="border border-gray-300 rounded-md px-2 py-1 mr-1 text-gray-700"
                                            />
                                            →
                                            <input
                                                type="date"
                                                value={newDates.end}
                                                onChange={(e) =>
                                                    setNewDates((prev) => ({
                                                        ...prev,
                                                        end: e.target.value,
                                                    }))
                                                }
                                                min={newDates.start}
                                                className="border border-gray-300 rounded-md px-2 py-1 ml-1 text-gray-700"
                                            />
                                        </>
                                    ) : (
                                        <span className="text-gray-600">
                                            Reservation: {startDate} → {endDate}
                                        </span>
                                    )}
                                </span>
                            </div>

                            {/* If editing, show “Pay now” checkbox */}
                            {currentlyEditing && (
                                <div className="mt-2">
                                    <label className="inline-flex items-center text-sm">
                                        <input
                                            type="checkbox"
                                            checked={payNowChecked}
                                            onChange={(e) => setPayNowChecked(e.target.checked)}
                                            className="form-checkbox h-4 w-4 text-green-600"
                                        />
                                        <span className="ml-2 text-gray-700">Pay now</span>
                                    </label>
                                </div>
                            )}

                            {/* Buttons go in left-bottom corner */}
                            <div className="mt-3 flex items-center justify-start space-x-2">
                                {/* Cancel button (only when not editing) */}
                                {isCancellable && !currentlyEditing && (
                                    <button
                                        onClick={() => cancelMutation.mutate(id)}
                                        disabled={cancelMutation.isLoading}
                                        className={`px-3 py-1 rounded-md text-white font-medium ${cancelMutation.isLoading
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-red-600 hover:bg-red-700"
                                            }`}
                                    >
                                        {cancelMutation.isLoading ? "Cancelling…" : "Cancel"}
                                    </button>
                                )}

                                {/* Edit Dates button (only when not editing) */}
                                {isEditableOrPayable && !currentlyEditing && (
                                    <button
                                        onClick={() => {
                                            setEditingId(id);
                                            setNewDates({ start: startDate, end: endDate });
                                            setPayNowChecked(false);
                                        }}
                                        className="px-3 py-1 rounded-md bg-yellow-600 text-white font-medium hover:bg-yellow-700"
                                    >
                                        Edit Dates
                                    </button>
                                )}

                                {/* “Pay Now” button immediately calls API with existing dates */}
                                {isEditableOrPayable && !currentlyEditing && (
                                    <button
                                        onClick={() =>
                                            editMutation.mutate({
                                                id,
                                                carId,
                                                startDate,
                                                endDate,
                                                paymentOption: "PAY_NOW",
                                            })
                                        }
                                        disabled={editMutation.isLoading}
                                        className={`px-3 py-1 rounded-md text-white font-medium ${editMutation.isLoading
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-green-600 hover:bg-green-700"
                                            }`}
                                    >
                                        {editMutation.isLoading ? "Processing…" : "Pay Now"}
                                    </button>
                                )}

                                {/* Save/Cancel when in editing mode */}
                                {currentlyEditing && (
                                    <>
                                        <button
                                            onClick={() =>
                                                editMutation.mutate({
                                                    id,
                                                    carId,
                                                    startDate: newDates.start,
                                                    endDate: newDates.end,
                                                    paymentOption: payNowChecked ? "PAY_NOW" : null,
                                                })
                                            }
                                            disabled={editMutation.isLoading}
                                            className={`px-3 py-1 rounded-md text-white font-medium ${editMutation.isLoading
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-blue-600 hover:bg-blue-700"
                                                }`}
                                        >
                                            {editMutation.isLoading ? "Saving…" : "Save"}
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            disabled={editMutation.isLoading}
                                            className="px-3 py-1 rounded-md bg-gray-300 text-gray-700 font-medium hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ───────────────────────────────────────────── */}
            {/* PAGINATION CONTROLS */}
            {/* ───────────────────────────────────────────── */}
            <div className="flex items-center justify-center mt-6 space-x-4">
                <button
                    onClick={() => setPageNumber((old) => Math.max(old - 1, 0))}
                    disabled={number === 0 || isFetching}
                    className={`
            px-3 py-1 rounded-md font-medium
            ${number === 0 || isFetching
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }
          `}
                >
                    Previous
                </button>

                <span className="text-sm text-gray-700">
                    Page{" "}
                    <span className="font-semibold text-blue-600">{number + 1}</span> of{" "}
                    <span className="font-semibold text-blue-600">{totalPages}</span>
                </span>

                <button
                    onClick={() =>
                        setPageNumber((old) => (old < totalPages - 1 ? old + 1 : old))
                    }
                    disabled={number + 1 >= totalPages || isFetching}
                    className={`
            px-3 py-1 rounded-md font-medium
            ${number + 1 >= totalPages || isFetching
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }
          `}
                >
                    Next
                </button>
            </div>

            {isFetching && (
                <div className="mt-2 text-center text-sm text-gray-500">Updating…</div>
            )}
        </div>
    );
}
