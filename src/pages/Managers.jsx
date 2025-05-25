import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getManagers, addManager, deleteManager } from "../controllers/users";
import { Modal } from "../components/Modal";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Managers() {
    const { register, handleSubmit, reset } = useForm();
    const [showModal, setShowModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [page, setPage] = useState(0);

    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['managers', page],
        queryFn: () => getManagers(page),
        keepPreviousData: true,
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteManager(id),
        onSuccess: () => queryClient.invalidateQueries(['managers']),
    });

    const addMutation = useMutation({
        mutationFn: addManager,
        onSuccess: () => {
            queryClient.invalidateQueries(['managers']);
            setShowModal(false);
            reset();
        },
    });

    const onSubmit = (formData) => {
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        addMutation.mutate({
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            email: formData.email,
            password: formData.password,
        });
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading managers: {error.message}</div>;

    const managers = data.content;
    const pageInfo = data.page;

    return (
        <div className="flex flex-col w-full p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-3xl text-center w-full">Managers</h3>
            </div>

            <div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-emerald-600 text-white px-3 py-2 rounded hover:bg-emerald-700"
                >
                    Create Admin
                </button>
            </div>

            <table className="min-w-full border-collapse mt-2">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 border">ID</th>
                        <th className="px-4 py-2 border">First Name</th>
                        <th className="px-4 py-2 border">Last Name</th>
                        <th className="px-4 py-2 border">Email</th>
                        <th className="px-4 py-2 border">Username</th>
                        <th className="px-4 py-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {managers.map((manager) => (
                        <tr key={manager.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border">{manager.id}</td>
                            <td className="px-4 py-2 border">{manager.firstName}</td>
                            <td className="px-4 py-2 border">{manager.lastName}</td>
                            <td className="px-4 py-2 border">{manager.email}</td>
                            <td className="px-4 py-2 border">{manager.userName}</td>
                            <td className="px-4 py-2 border text-center">
                                <button
                                    onClick={() => deleteMutation.mutate(manager.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {managers.length === 0 && (
                        <tr>
                            <td
                                colSpan={6}
                                className="px-4 py-6 text-center text-gray-500"
                            >
                                No managers found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

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
                    Page <strong>{pageInfo.number + 1} of {pageInfo.totalPages}</strong> — Total: {pageInfo.totalElements} entries
                </span>

                <button
                    onClick={() =>
                        setPage((prev) =>
                            pageInfo && prev + 1 < pageInfo.totalPages ? prev + 1 : prev
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

            {/* Create Admin Modal */}
            {showModal && (
                <Modal onClose={() => setShowModal(false)} title="Create Admin">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
                        <input
                            {...register("firstName")}
                            type="text"
                            placeholder="First Name"
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                        <input
                            {...register("lastName")}
                            type="text"
                            placeholder="Last Name"
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                        <input
                            {...register("username")}
                            type="text"
                            placeholder="Username"
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="Email"
                            className="w-full border px-3 py-2 rounded"
                            required
                        />

                        <div className="relative">
                            <input
                                {...register("password")}
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full border px-3 py-2 rounded pr-10"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                {...register("confirmPassword")}
                                type={showConfirm ? "text" : "password"}
                                placeholder="Confirm Password"
                                className="w-full border px-3 py-2 rounded pr-10"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                onClick={() => setShowConfirm((prev) => !prev)}
                            >
                                {showConfirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                type="button"
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}