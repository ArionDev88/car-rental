import { getProfile, updateProfile } from "../controllers/users";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function MyProfile() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();

    const {
        data: profile,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
    });

    if (isLoading) {
        return <div>Loading profile…</div>;
    }

    if (error) {
        return <div>Error loading profile.</div>;
    }

    // Stub submit handler; updating is not hooked up yet
    const onSubmit = async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            return;
        }
        try {
            await updateProfile({
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                email: data.email,
                password: data.newPassword,
            });
            
            navigate("/homepage");
            toast.success("Profile updated successfully!");
        }catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.message || "Failed to update profile. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-2xl mx-auto p-4">
            {/* First Name */}
            <div className="mb-4">
                <label htmlFor="firstName" className="block font-medium mb-1">
                    First Name
                </label>
                <input
                    id="firstName"
                    type="text"
                    {...register("firstName")}
                    className="w-full border rounded px-3 py-2"
                    defaultValue={profile.firstName}
                />
                {errors.firstName && (
                    <p className="text-sm text-red-600">{errors.firstName.message}</p>
                )}
            </div>

            {/* Last Name */}
            <div className="mb-4">
                <label htmlFor="lastName" className="block font-medium mb-1">
                    Last Name
                </label>
                <input
                    id="lastName"
                    type="text"
                    {...register("lastName")}
                    className="w-full border rounded px-3 py-2"
                    defaultValue={profile.lastName}
                />
                {errors.lastName && (
                    <p className="text-sm text-red-600">{errors.lastName.message}</p>
                )}
            </div>

            {/* Username */}
            <div className="mb-4">
                <label htmlFor="username" className="block font-medium mb-1">
                    Username
                </label>
                <input
                    id="username"
                    type="text"
                    {...register("username")}
                    className="w-full border rounded px-3 py-2"
                    defaultValue={profile.userName}
                />
                {errors.username && (
                    <p className="text-sm text-red-600">{errors.username.message}</p>
                )}
            </div>

            {/* Email */}
            <div className="mb-4">
                <label htmlFor="email" className="block font-medium mb-1">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="w-full border rounded px-3 py-2"
                    defaultValue={profile.email}
                />
                {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
            </div>

            {/* New Password */}
            <div className="mb-4">
                <label htmlFor="newPassword" className="block font-medium mb-1">
                    New Password
                </label>
                <input
                    id="newPassword"
                    type="password"
                    {...register("newPassword")}
                    className="w-full border rounded px-3 py-2"
                />
                {errors.newPassword && (
                    <p className="text-sm text-red-600">{errors.newPassword.message}</p>
                )}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
                <label htmlFor="confirmPassword" className="block font-medium mb-1">
                    Confirm Password
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    className="w-full border rounded px-3 py-2"
                />
                {errors.confirmPassword && (
                    <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
            </div>

            {/* Submit button (currently just logs the data) */}
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Save Changes
            </button>

            <ToastContainer />
        </form>
    );
}
