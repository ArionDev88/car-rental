import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getExpenses, addExpense, deleteExpense, getExpenseById, updateExpense, downloadReport } from '../controllers/expenses';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Modal } from '../components/Modal';
import { getCars } from '../controllers/revenues';
import { ToastContainer, toast } from 'react-toastify';

export default function Expenses() {
    const queryClient = useQueryClient();
    const { register, handleSubmit, watch, reset } = useForm();
    const [filters, setFilters] = useState({
        from: '',
        to: '',
        carIds: []
    });
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const [isCarDropdownOpen, setIsCarDropdownOpen] = useState(false);
    const [isEditExpenseModalOpen, setIsEditExpenseModalOpen] = useState(false);
    const [selectedExpenseId, setSelectedExpenseId] = useState(null);

    const selectedCarIds = watch("carIds") || [];
    const fromDate = watch("from") || "";

    const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
    const { register: registerModal, handleSubmit: handleSubmitModal, reset: resetModalForm } = useForm();
    const { register: registerEditModal, handleSubmit: handleSubmitEditModal, reset: resetEditModalForm } = useForm();


    const { data: expenses, isLoading, error } = useQuery({
        queryKey: ['expenses', filters, page],
        queryFn: () => getExpenses({
            from: filters.from || "",
            to: filters.to || "",
            carIds: filters.carIds || [],
            page: page,
            pageSize: pageSize
        }),

        onSuccess: (data) => {
            console.log('Expenses fetched successfully:', data);
        },

        onError: (error) => {
            console.error('Error fetching expenses:', error);
            toast.error(error.message || 'Failed to fetch expenses');
        }
    });

    const { data: cars, isLoading: isCarsLoading, error: carsError } = useQuery({
        queryKey: ['cars'],
        queryFn: getCars,

        onSuccess: (data) => {
            console.log('Cars fetched successfully:', data);
        },

        onError: (error) => {
            console.error('Error fetching cars:', error);
        }
    });

    const { data: expenseById, isLoading: isExpenseLoading, error: expenseError } = useQuery({
        queryKey: ['expenseById', selectedExpenseId],
        queryFn: () => {
            return getExpenseById(selectedExpenseId);
        },
        enabled: selectedExpenseId !== null,
    });

    const addExpenseMutation = useMutation({
        mutationFn: async (newExpenseData) => {
            await addExpense({
                carId: newExpenseData.carId,
                description: newExpenseData.description,
                amount: parseFloat(newExpenseData.amount),
                date: newExpenseData.date
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['expenses']);
            setIsAddExpenseModalOpen(false);
            resetModalForm();
            toast.success("Expense added successfully!");
        },
        onError: (err) => {
            console.error("Failed to add expense:", err);
            toast.error(err.message || "Failed to add expense. Please try again.");
        }
    });

    const updateExpenseMutation = useMutation({
        mutationFn: async (expenseData) => {
            await updateExpense(expenseData.id, {
                carId: expenseData.carId,
                description: expenseData.description,
                amount: parseFloat(expenseData.amount),
                date: expenseData.date
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['expenses']);
            setIsEditExpenseModalOpen(false);
            resetEditModalForm();
            setSelectedExpenseId(null);
            toast.success("Expense updated successfully!");
        },
        onError: (err) => {
            console.error("Failed to update expense:", err);
            toast.error(err.message || "Failed to update expense. Please try again.");
        }
    });

    const deleteExpenseMutation = useMutation({
        mutationFn: async (expenseId) => {
            await deleteExpense(expenseId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['expenses']);
            toast.success("Expense deleted successfully!");
        },
        onError: (err) => {
            console.error("Failed to delete expense:", err);
            toast.error(err.message || "Failed to delete expense. Please try again.");
        }
    });


    const onSubmit = (data) => {
        setFilters({
            from: data.from || "",
            to: data.to || "",
            carIds: data.carIds || [],
        });
        setPage(0);
    };

    const handleResetFilters = () => {
        reset({
            from: "",
            to: "",
            carIds: [],
        });
        setFilters({
            from: "",
            to: "",
            carIds: [],
        });
        setPage(0);
    };

    const handleAddExpenseSubmit = (data) => {
        addExpenseMutation.mutate(data);
    };

    const handleEditExpense = (expenseId) => {
        setSelectedExpenseId(expenseId);
        setIsEditExpenseModalOpen(true);
    }

    const handleEditExpenseSubmit = (data) => {
        if (!selectedExpenseId) return;
        updateExpenseMutation.mutate({
            id: selectedExpenseId,
            ...data
        });
    }

    const handleDeleteExpense = async (expenseId) => {
        deleteExpenseMutation.mutate(expenseId);
    }

    const handleDownloadReport = async () => {
            try {
                const report = await downloadReport(filters);
                const blob = new Blob([report], { type: "application/pdf" });
                const url = window.URL.createObjectURL(blob);
                window.open(url, "_blank");
                
            } catch (error) {
                console.error("Failed to download report:", error);
            }
        }

    return (
        <div className='p-4 space-y-6 w-full'>
            {/* --- Filter Form --- */}
            <div className="border border-gray-300 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">Filter Expenses</h2>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-wrap items-end gap-4 justify-between"
                >
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="from" className="text-sm font-medium">
                                From
                            </label>
                            <input
                                type="date"
                                id="from"
                                {...register("from")}
                                className="border rounded px-2 py-1"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="to" className="text-sm font-medium">
                                To
                            </label>
                            <input
                                type="date"
                                id="to"
                                {...register("to")}
                                className="border rounded px-2 py-1"
                                min={fromDate}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="carIds" className="block text-sm font-medium text-gray-700">
                                Cars:
                            </label>
                            {isCarsLoading ? (
                                <div>Loading cars…</div>
                            ) : carsError ? (
                                <div className="text-red-600">Failed to load cars.</div>
                            ) : (
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsCarDropdownOpen(!isCarDropdownOpen)}
                                        className="mt-1 block w-full px-4 py-1 rounded-md border border-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-left"
                                    >
                                        {selectedCarIds.length === 0
                                            ? "Select Cars"
                                            : `${selectedCarIds.length} selected`}
                                    </button>

                                    {isCarDropdownOpen && (
                                        <div className="absolute z-10 mt-1 w-80 bg-white border border-gray-300 rounded-md shadow-lg">
                                            <div className="p-2 space-y-2 max-h-60 overflow-auto">
                                                {cars?.map((car) => (
                                                    <label
                                                        key={car.id}
                                                        className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            value={car.id}
                                                            {...register("carIds")}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span>{car.licensePlate}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="flex gap-1.5">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Apply Filters
                        </button>
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                        >
                            Reset Filters
                        </button>
                    </div>
                </form>
            </div>

            <div className="flex justify-between mb-4">
                <button className='bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 mr-2'
                    onClick={handleDownloadReport}
                >
                    Download Report
                </button>
                <button
                    onClick={() => {
                        resetModalForm();
                        setIsAddExpenseModalOpen(true);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    Add Expense
                </button>
            </div>

            {/* --- Table / Loading / Error States --- */}
            {isLoading ? (
                <div>Loading expenses…</div>
            ) : error ? (
                <div className="text-red-600">An error occurred fetching data.</div>
            ) : (
                <>
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 border">ID</th>
                                <th className="px-4 py-2 border">License Plate</th>
                                <th className="px-4 py-2 border">Amount</th>
                                <th className="px-4 py-2 border">Description</th>
                                <th className="px-4 py-2 border">Date</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses?.content?.map((e) => (
                                <tr key={e.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border">{e.id}</td>
                                    <td className="px-4 py-2 border">{e.carLicensePlate || 'N/A'}</td>
                                    <td className="px-4 py-2 border"> {e.amount?.toFixed(2)}</td>
                                    <td className="px-4 py-2 border">{e.description}</td>
                                    <td className="px-4 py-2 border">{e.date || e.createdDate}</td>
                                    <td className="px-4 py-2 border">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => handleEditExpense(e.id)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteExpense(e.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {expenses?.content?.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6} // Changed colspan to 6 for the new Actions column
                                        className="px-4 py-6 text-center text-gray-500"
                                    >
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* --- Pagination Controls --- */}
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
                                {expenses?.page?.number + 1} of {expenses?.page?.totalPages}
                            </strong>{" "}
                            — Total: {expenses?.page?.totalElements} entries
                        </span>

                        <button
                            onClick={() =>
                                setPage((old) =>
                                    expenses && old + 1 < expenses.page.totalPages
                                        ? old + 1
                                        : old
                                )
                            }
                            disabled={
                                !expenses ||
                                page + 1 >= (expenses ? expenses.page.totalPages : 1)
                            }
                            className={`px-3 py-1 rounded ${!expenses || page + 1 >= expenses.page.totalPages
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {/* --- Add Expense Modal --- */}
            {isAddExpenseModalOpen && (
                <Modal onClose={() => setIsAddExpenseModalOpen(false)}>
                    <h3 className="text-xl font-bold mb-4">Add New Expense</h3>
                    <form onSubmit={handleSubmitModal(handleAddExpenseSubmit)} className="space-y-4">
                        {/* Date Field */}
                        <div>
                            <label htmlFor="expenseDate" className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                id="expenseDate"
                                {...registerModal("date", { required: true })}
                                defaultValue={new Date().toISOString().split('T')[0]} // Set default to today's date
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>

                        {/* Amount Field */}
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                id="amount"
                                {...registerModal("amount", { required: true, valueAsNumber: true })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>

                        {/* Description Field */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                id="description"
                                {...registerModal("description", { required: true })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            ></textarea>
                        </div>

                        {/* Car ID Dropdown */}
                        <div>
                            <label htmlFor="carId" className="block text-sm font-medium text-gray-700">Car</label>
                            {isCarsLoading ? (
                                <p>Loading cars...</p>
                            ) : carsError ? (
                                <p className="text-red-600">Error loading cars.</p>
                            ) : (
                                <select
                                    id="carId"
                                    {...registerModal("carId", { required: true })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                >
                                    <option value="">Select a car</option>
                                    {cars?.map((car) => (
                                        <option key={car.id} value={car.id}>
                                            {car.licensePlate}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setIsAddExpenseModalOpen(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={addExpenseMutation.isPending}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {addExpenseMutation.isPending ? "Adding..." : "Add Expense"}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {isEditExpenseModalOpen && (
                <Modal onClose={() => {
                    setIsEditExpenseModalOpen(false);
                    setSelectedExpenseId(null);
                    resetEditModalForm();
                }}>
                    <h3 className="text-xl font-bold mb-4">Edit Expense</h3>
                    {isExpenseLoading ? (
                        <div>Loading expense details...</div>
                    ) : expenseError ? (
                        <div className="text-red-600">Error loading expense details</div>
                    ) : (
                        <form onSubmit={handleSubmitEditModal(handleEditExpenseSubmit)} className="space-y-4">
                            {/* Date Field */}
                            <div>
                                <label htmlFor="editDate" className="block text-sm font-medium text-gray-700">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    id="editDate"
                                    defaultValue={expenseById?.date?.split('T')[0]}
                                    {...registerEditModal("date", { required: true })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>

                            {/* Amount Field */}
                            <div>
                                <label htmlFor="editAmount" className="block text-sm font-medium text-gray-700">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    step="1"
                                    id="editAmount"
                                    defaultValue={expenseById?.amount}
                                    {...registerEditModal("amount", { required: true, valueAsNumber: true })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>

                            {/* Description Field */}
                            <div>
                                <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="editDescription"
                                    defaultValue={expenseById?.description}
                                    {...registerEditModal("description", { required: true })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>

                            {/* Car ID Dropdown */}
                            <div>
                                <label htmlFor="editCarId" className="block text-sm font-medium text-gray-700">
                                    Car
                                </label>
                                {isCarsLoading ? (
                                    <p>Loading cars...</p>
                                ) : carsError ? (
                                    <p className="text-red-600">Error loading cars.</p>
                                ) : (
                                    <select
                                        id="editCarId"
                                        defaultValue={cars?.find(car => car.licensePlate === expenseById?.carLicensePlate)?.id}
                                        {...registerEditModal("carId", { required: true })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    >
                                        <option value="">Select a car</option>
                                        {cars?.map((car) => (
                                            <option key={car.id} value={car.id}>
                                                {car.licensePlate}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditExpenseModalOpen(false);
                                        setSelectedExpenseId(null);
                                    }}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateExpenseMutation.isPending}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {updateExpenseMutation.isPending ? "Updating..." : "Update Expense"}
                                </button>
                            </div>
                        </form>
                    )}
                </Modal>
            )}

            <ToastContainer />
        </div>
    );
}