import { useForm } from "react-hook-form";
import { forgotPassword } from "../controllers/authController";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
export default function ForgotPassword() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (data) => {
        try {
            await forgotPassword(data);
            navigate('/reset-password')
            toast.success("Reset password link sent to your email!");
        } catch (error) {
            console.error("Error sending reset password link:", error);
            toast.error(error.message || "Failed to send reset password link. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            {...register("email", { required: "Email is required" })}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
                    >
                        Send Reset Link
                    </button>
                </form>
            </div>

            <ToastContainer />
        </div>
    )
}