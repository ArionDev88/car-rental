import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getBranches, createBranch } from "../controllers/branches";
import { Modal } from "../components/Modal";

export default function Branches() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset } = useForm();

    const { data: branches, isLoading, isError } = useQuery({
        queryKey: ["branches"],
        queryFn: getBranches,
    });

    const createBranchMutation = useMutation({
        mutationFn: createBranch,
        onSuccess: () => {
            queryClient.invalidateQueries(["branches"]);
            setIsModalOpen(false);
            reset();
        },
    });

    const onSubmit = (data) => {
        createBranchMutation.mutate(data);
    };

    // Placeholder handlers for edit/delete actions
    const handleEdit = (branchId) => {
        // TODO: open an edit modal or navigate to edit form
        console.log("Edit branch", branchId);
    };

    const handleDelete = (branchId) => {
        // TODO: call delete API and invalidate the query
        console.log("Delete branch", branchId);
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading branches</div>;

     return (
        <div className="p-6 m-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Branches</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    + Branch
                </button>
            </div>

            <div className="mx-auto">
                <table className="w-full table-auto border-collapse bg-white shadow-sm mx-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2 text-left">Name</th>
                            <th className="border px-4 py-2 text-left">Address</th>
                            <th className="border px-4 py-2 text-left">City</th>
                            <th className="border px-4 py-2 text-left">Phone</th>
                            <th className="border px-4 py-2 text-center">Edit</th>
                            <th className="border px-4 py-2 text-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {branches.content.map((branch) => (
                            <tr key={branch.id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">{branch.name}</td>
                                <td className="border px-4 py-2">{branch.address}</td>
                                <td className="border px-4 py-2">{branch.city}</td>
                                <td className="border px-4 py-2">{branch.phone || "—"}</td>
                                <td className="border px-4 py-2 text-center">
                                    <button
                                        onClick={() => handleEdit(branch.id)}
                                        className="text-blue-500 hover:text-blue-700"
                                        aria-label="Edit branch"
                                    >
                                        ✏️
                                    </button>
                                </td>
                                <td className="border px-4 py-2 text-center">
                                    <button
                                        onClick={() => handleDelete(branch.id)}
                                        className="text-red-500 hover:text-red-700"
                                        aria-label="Delete branch"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Buttons */}
                <div className="flex justify-center space-x-2 mt-4">
                    <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                        Previous
                    </button>
                    <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                        Next
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <h3 className="text-xl font-semibold mb-4">Create New Branch</h3>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-3"
                    >
                        <div>
                            <label className="block font-medium">Name</label>
                            <input
                                {...register("name", { required: true })}
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                placeholder="Branch Name"
                            />
                        </div>

                        <div>
                            <label className="block font-medium">Address</label>
                            <input
                                {...register("address", { required: true })}
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                placeholder="123 Main St"
                            />
                        </div>

                        <div>
                            <label className="block font-medium">City</label>
                            <input
                                {...register("city", { required: true })}
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                placeholder="Tirana"
                            />
                        </div>

                        <div>
                            <label className="block font-medium">Phone (E.164)</label>
                            <input
                                {...register("phone", {
                                    pattern: {
                                        value: /^\+?[1-9]\d{1,14}$/,
                                        message: "Must be in E.164 format",
                                    },
                                })}
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                placeholder="+355123456789"
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    reset();
                                }}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                disabled={createBranchMutation.isLoading}
                            >
                                {createBranchMutation.isLoading ? "Saving…" : "Create"}
                            </button>
                        </div>

                        {createBranchMutation.isError && (
                            <p className="text-red-600 text-sm">
                                {createBranchMutation.error.message}
                            </p>
                        )}
                    </form>
                </Modal>
            )}
        </div>
    );
}
