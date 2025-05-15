import { FaUser, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../stores/authStore';
import { login } from '../controllers/authController';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const handleLogin = async (data) => {
        try {
            const response = await login({
                email: data.email,
                password: data.password
            });
            useAuthStore.setState({
                token: response.token,
                role: response.role,
                userId: response.userId,
            });

            if (response.role === 'MANAGER') {
                navigate('/homepage/all-reservations');
            } else {
                navigate('/homepage');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Image Section */}
            <div className="flex-1 bg-gradient-to-r from-blue-600/80 to-blue-800/80">
                <img
                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800"
                    alt="Luxury Car"
                    className="h-full w-full object-cover mix-blend-multiply"
                />
            </div>

            {/* Form Section */}
            <div className="flex flex-1 items-center justify-center p-8 md:p-16">
                <div className="w-full max-w-md">
                    <h2 className="mb-8 text-center text-4xl font-bold text-gray-900">
                        Welcome Back to <span className="text-blue-600">LuxDrive</span>
                    </h2>

                    <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
                        <div>
                            <label className="flex items-center rounded-lg border-2 border-gray-200 p-3 transition-all duration-300 focus-within:border-blue-600">
                                <FaUser className="mr-3 text-xl text-gray-500" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="flex-1 border-none outline-none"
                                    required
                                    {
                                    ...register('email', { required: 'Email is required' })
                                    }
                                />
                            </label>
                        </div>

                        <div>
                            <label className="flex items-center rounded-lg border-2 border-gray-200 p-3 transition-all duration-300 focus-within:border-blue-600">
                                <FaLock className="mr-3 text-xl text-gray-500" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="flex-1 border-none outline-none"
                                    required
                                    {
                                    ...register('password', { required: 'Password is required' })
                                    }
                                />
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 px-4 py-4 font-bold text-white transition-colors hover:bg-blue-700 cursor-pointer"
                        >
                            Login
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-600">
                        New user?{' '}
                        <Link to="/signup" className="font-medium text-blue-600 hover:underline">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}