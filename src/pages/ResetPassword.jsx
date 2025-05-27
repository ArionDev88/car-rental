import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { resetPassword } from "../controllers/authController";
import { ToastContainer, toast } from "react-toastify";

export default function ResetPassword() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = async (data) => {
        try {
            await resetPassword({
                token: data.token,
                newPassword: data.newPassword
            });
            navigate('/');
            toast.success("Password reset successfully!");
        } catch (error) {
            console.error("Error resetting password:", error);
            toast.error(error.message || "Failed to reset password. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="token" className="block text-sm font-medium text-gray-700">Reset Token</label>
                        <input
                            type="text"
                            id="token"
                            {...register("token", { required: "Token is required" })}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.token ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.token && <p className="text-red-500 text-sm mt-1">{errors.token.message}</p>}
                    </div>

                    <div className="mb-4 relative">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                        <div className="mt-1 flex items-center border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus-within:ring-blue-500 focus-within:border-blue-500">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                {...register("newPassword", { required: "New password is required" })}
                                className="flex-1 block w-full px-3 py-2 border-none outline-none rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="pr-3 text-gray-500 focus:outline-none"
                            >
                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
                    </div>

                    <div className="mb-4 relative">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <div className="mt-1 flex items-center border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus-within:ring-blue-500 focus-within:border-blue-500">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                {...register("confirmPassword", {
                                    required: "Confirmation password is required",
                                    validate: (value) => value === getValues("newPassword") || "Passwords do not match"
                                })}
                                className="flex-1 block w-full px-3 py-2 border-none outline-none rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="pr-3 text-gray-500 focus:outline-none"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Reset Password
                    </button>
                </form>
            </div>

            <ToastContainer />
        </div>
    )
}
