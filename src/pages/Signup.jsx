import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { signUp } from '../controllers/authController';
import { useAuthStore } from '../stores/authStore';
export default function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            if (data.password !== data.confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            const response = await signUp({
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                email: data.email,
                password: data.password
            });
            useAuthStore.setState({
                token: response.token,
                role: response.role,
                userId: response.userId,
            });
            navigate('/homepage');
        } catch (error) {
            console.error('Error signing up:', error);
        }
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Image Section */}
            <div className="flex-1 bg-gradient-to-r from-blue-600/80 to-blue-800/80">
                <img
                    src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800"
                    alt="Sports Car"
                    className="h-full w-full object-cover mix-blend-multiply"
                />
            </div>

            {/* Form Section */}
            <div className="flex flex-1 items-center justify-center p-8 md:p-16">
                <div className="w-full max-w-md">
                    <h2 className="mb-8 text-center text-4xl font-bold text-gray-900">
                        Join <span className="text-blue-600">LuxDrive</span>
                    </h2>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex-1">
                            <label className="flex items-center rounded-lg border-2 border-gray-200 p-3 transition-all duration-300 focus-within:border-blue-600">
                                <FaUser className="mr-3 text-xl text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className="flex-1 border-none outline-none"
                                    {
                                    ...register('firstName', { required: 'First Name is required' })
                                    }
                                />
                            </label>
                            {/* {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>} */}
                        </div>
                        <div className="flex-1">
                            <label className="flex items-center rounded-lg border-2 border-gray-200 p-3 transition-all duration-300 focus-within:border-blue-600">
                                <FaUser className="mr-3 text-xl text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className="flex-1 border-none outline-none"
                                    {
                                    ...register('lastName', { required: 'Last Name is required' })
                                    }
                                />
                            </label>
                            {/* {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>} */}
                        </div>

                        {/* Username Input */}
                        <div>
                            <label className="flex items-center rounded-lg border-2 border-gray-200 p-3 transition-all duration-300 focus-within:border-blue-600">
                                <FaUser className="mr-3 text-xl text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="flex-1 border-none outline-none"
                                    {
                                    ...register('username', { required: 'Username is required' })
                                    }
                                />
                            </label>
                            {/* {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>} */}
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="flex items-center rounded-lg border-2 border-gray-200 p-3 transition-all duration-300 focus-within:border-blue-600">
                                <FaEnvelope className="mr-3 text-xl text-gray-500" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="flex-1 border-none outline-none"
                                    {
                                    ...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: "Entered value does not match email format"
                                        }
                                    })
                                    }
                                />
                            </label>
                            {/* {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>} */}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="flex items-center rounded-lg border-2 border-gray-200 p-3 transition-all duration-300 focus-within:border-blue-600">
                                <FaLock className="mr-3 text-xl text-gray-500" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="flex-1 border-none outline-none"
                                    {
                                    ...register('password', { required: 'Password is required' })
                                    }
                                />
                            </label>
                            {/* {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>} */}
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label className="flex items-center rounded-lg border-2 border-gray-200 p-3 transition-all duration-300 focus-within:border-blue-600">
                                <FaLock className="mr-3 text-xl text-gray-500" />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="flex-1 border-none outline-none"
                                    {
                                    ...register('confirmPassword', {
                                        required: 'Confirm Password is required',
                                        // validate: value => value === getValues("password") || "The passwords do not match" // If using getValues
                                    })
                                    }
                                />
                            </label>
                            {/* {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>} */}
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 px-4 py-4 font-bold text-white transition-colors hover:bg-blue-700 cursor-pointer"
                        >
                            Sign Up
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-600">
                        Already have an account?{' '}
                        <Link to="/" className="font-medium text-blue-600 hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );

}