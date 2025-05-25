import { useQuery } from "@tanstack/react-query";
import { getClients } from "../controllers/users";
import { useState } from "react";

export default function Clients() {
    const [page, setPage] = useState(0);

    const { data, isLoading, error } = useQuery({
        queryKey: ['clients', page],
        queryFn: () => getClients(page),
        keepPreviousData: true,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading clients: {error.message}</div>;

    const clients = data.content;
    const pageInfo = data.page;

    return (
        <div className="flex flex-col w-full p-4">
            <h3 className="text-center text-3xl">Clients</h3>
            <table className="min-w-full border-collapse mt-4">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 border">ID</th>
                        <th className="px-4 py-2 border">Full Name</th>
                        <th className="px-4 py-2 border">Email</th>
                        <th className="px-4 py-2 border">Username</th>
                        <th className="px-4 py-2 border">Enrollment Date</th>
                        <th className="px-4 py-2 border">Total</th>
                        <th className="px-4 py-2 border">Past</th>
                        <th className="px-4 py-2 border">Future</th>
                        <th className="px-4 py-2 border">Active</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr key={client.clientId} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border">{client.clientId}</td>
                            <td className="px-4 py-2 border">{client.clientFullName}</td>
                            <td className="px-4 py-2 border">{client.clientEmail}</td>
                            <td className="px-4 py-2 border">{client.clientUsername}</td>
                            <td className="px-4 py-2 border">{client.clientEnrollmentDate}</td>
                            <td className="px-4 py-2 border">{client.totalReservationNumber}</td>
                            <td className="px-4 py-2 border">{client.pastReservationNumber}</td>
                            <td className="px-4 py-2 border">{client.futureReservationNumber}</td>
                            <td className="px-4 py-2 border">{client.activeReservationNumber}</td>
                        </tr>
                    ))}
                    {clients.length === 0 && (
                        <tr>
                            <td
                                colSpan={9}
                                className="px-4 py-6 text-center text-gray-500"
                            >
                                No records found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
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
                        {pageInfo.number + 1} of {pageInfo.totalPages}
                    </strong>{" "}
                    — Total: {pageInfo.totalElements} entries
                </span>

                <button
                    onClick={() =>
                        setPage((prev) =>
                            pageInfo && prev + 1 < pageInfo.totalPages
                                ? prev + 1
                                : prev
                        )
                    }
                    disabled={!pageInfo || page + 1 >= pageInfo.totalPages}
                    className={`px-3 py-1 rounded ${!pageInfo || page + 1 >= pageInfo.totalPages
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