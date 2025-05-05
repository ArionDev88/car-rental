import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoNotifications } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';

export default function TopNav() {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <div className="flex justify-end items-center py-2 px-4 bg-[#000080] shadow-sm w-full">
            <div className="flex items-center space-x-3">
                {/* Notification Icon */}
                <button className="p-2 rounded-full hover:bg-blue-800 cursor-pointer">
                    <IoNotifications className="h-6 w-6 text-white" />
                </button>

                {/* User Icon with Dropdown */}
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="p-2 rounded-full hover:bg-blue-800 cursor-pointer"
                    >
                        <FaUser className="h-6 w-6 text-white" />
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                            <button className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full cursor-pointer">
                                My Profile
                            </button>
                            <button className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full cursor-pointer"
                                onClick={() => {
                                    navigate('/');
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}