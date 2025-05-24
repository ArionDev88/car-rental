import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRevenues, getCars, downloadRevenuesReport } from "../controllers/revenues";
import { useForm } from "react-hook-form";

export default function Revenues() {
    const { register, handleSubmit, watch, reset } = useForm();
    const [filters, setFilters] = useState({
        from: "",
        to: "",
        carIds: [],
    });
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const selectedCarIds = watch("carIds") || [];
    const fromDate = watch("from");
    const [isCarDropdownOpen, setIsCarDropdownOpen] = useState(false);

    const {
        data: revenues,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["revenues", filters, page],
        queryFn: () =>
            getRevenues({
                from: filters.from,
                to: filters.to,
                carIds: filters.carIds,
                page: page,
                size: pageSize,
            }),
    });

    const {
        data: cars,
        isLoading: isCarsLoading,
        error: carsError,
    } = useQuery({
        queryKey: ["cars"],
        queryFn: getCars,
    });

    const onSubmit = (data) => {
        setFilters({
            from: data.from || "",
            to: data.to || "",
            carIds: data.carIds || [],
        });
        setPage(0);
    };

    // Function to reset filters
    const handleResetFilters = () => {
        reset({ // Reset the form fields
            from: "",
            to: "",
            carIds: [],
        });
        setFilters({ // Reset the filter state
            from: "",
            to: "",
            carIds: [],
        });
        setPage(0); // Reset pagination to the first page
    };

    const handleDownloadReport = async () => {
        try {
            const report = await downloadRevenuesReport(filters);
            const blob = new Blob([report], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
            
        } catch (error) {
            console.error("Failed to download report:", error);
        }
    }

    return (
        <div className="p-4 space-y-6">
            {/* ————— Filter Form ————— */}
            <div className="border border-gray-300 rounded-lg p-4"> {/* Added border here */}
                <h2 className="text-lg font-semibold mb-4">Filter Revenues</h2>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-wrap items-end gap-4 justify-between"
                >
                    <div className="flex flex-wrap items-end gap-4">
                        {/* From Date Filter */}
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

                        {/* To Date Filter */}
                        <div className="flex flex-col">
                            <label htmlFor="to" className="text-sm font-medium">
                                To
                            </label>
                            <input
                                type="date"
                                id="to"
                                {...register("to")}
                                className="border rounded px-2 py-1"
                                min={fromDate} // Ensure "To" date is not before "From" date
                            />
                        </div>

                        {/* Cars Dropdown Filter */}
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
                            type="button" // Important: set type="button" to prevent form submission
                            onClick={handleResetFilters}
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                        >
                            Reset Filters
                        </button>
                    </div>
                </form>
            </div>

            {/* ————— Table / Loading / Error States ————— */}
            {isLoading ? (
                <div>Loading revenues…</div>
            ) : error ? (
                <div className="text-red-600">An error occurred fetching data.</div>
            ) : (
                <>
                    <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 mr-2"
                        onClick={handleDownloadReport}>
                        Download Report
                    </button>
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 border">ID</th>
                                <th className="px-4 py-2 border">Type</th>
                                <th className="px-4 py-2 border">Amount</th>
                                <th className="px-4 py-2 border">Description</th>
                                <th className="px-4 py-2 border">Created Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {revenues?.content.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border">{r.id}</td>
                                    <td className="px-4 py-2 border">{r.revenueType}</td>
                                    <td className="px-4 py-2 border">
                                        {r.amount.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 border">{r.description}</td>
                                    <td className="px-4 py-2 border">{r.createdDate}</td>
                                </tr>
                            ))}
                            {revenues?.content.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-6 text-center text-gray-500"
                                    >
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* ————— Pagination Controls ————— */}
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
                                {revenues?.page.number + 1} of {revenues?.page.totalPages}
                            </strong>{" "}
                            — Total: {revenues?.page.totalElements} entries
                        </span>

                        <button
                            onClick={() =>
                                setPage((old) =>
                                    revenues && old + 1 < revenues.page.totalPages
                                        ? old + 1
                                        : old
                                )
                            }
                            disabled={
                                !revenues ||
                                page + 1 >= (revenues ? revenues.page.totalPages : 1)
                            }
                            className={`px-3 py-1 rounded ${!revenues || page + 1 >= revenues.page.totalPages
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}