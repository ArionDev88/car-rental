import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoNotifications } from 'react-icons/io5';
import { FaUser, FaHome, FaCar, FaShoppingCart, FaChartBar, FaUsers } from 'react-icons/fa';
import { useAuthStore } from '../stores/authStore';

const simpleUserItems = [
    { icon: <FaHome />, path: "/homepage" },
    { icon: <FaCar />, path: "browse-vehicles" },
    // { icon: <FaShoppingCart />, path: "/shopping-cart" },
];


export default function TopNav() {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const userRole = useAuthStore.getState().role;

    // TODO: Implement logic to determine user role and select appropriate nav items.
    // For this example, we'll use simpleUserItems.
    // You could also pass userRole as a prop and conditionally choose items.
    const navItemsToDisplay = simpleUserItems;

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleNavigate = (path) => {
        navigate(path);
        setShowDropdown(false);
    };
    
    const handleLogout = () => {
        useAuthStore.getState().clearAuth();
        navigate('/');
        setShowDropdown(false);
    };

    const goToProfile = () => {
        navigate('/profile');
        setShowDropdown(false);
    };

    // Helper to generate a title from path
    const generateTitleFromPath = (path) => {
        const cleanedPath = path.startsWith('/') ? path.substring(1) : path;
        return cleanedPath
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="flex justify-between items-center py-2 px-4 bg-[#000080] shadow-sm w-full text-white">
            {/* Left section: LuxDrive and Navigation Icons */}
            <div className="flex items-center space-x-4">
                {/* LuxDrive Name - clickable */}
                <div 
                    className="text-xl font-bold cursor-pointer hover:text-gray-300"
                    onClick={() => handleNavigate(simpleUserItems[0]?.path || '/')} // Navigate to first item's path or fallback
                >
                    LuxDrive
                </div>

                {/* Navigation Icons */}
                <div className="flex items-center space-x-1 sm:space-x-2"> {/* Adjusted space for responsiveness */}
                    {userRole === 'CLIENT' && navItemsToDisplay.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => handleNavigate(item.path)}
                            className="p-2 rounded-full hover:bg-blue-800 cursor-pointer"
                            title={generateTitleFromPath(item.path)} // Tooltip for the icon
                        >
                            {/* Clone icon to apply consistent styling */}
                            {React.cloneElement(item.icon, { className: "h-6 w-6" })}
                        </button>
                    ))}
                </div>
            </div>

            {/* Right section: Notification and User Icons */}
            <div className="flex items-center space-x-3">
                {/* Notification Icon */}
                <button className="p-2 rounded-full hover:bg-blue-800 cursor-pointer" title="Notifications">
                    <IoNotifications className="h-6 w-6 text-white" />
                </button>

                {/* User Icon with Dropdown */}
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="p-2 rounded-full hover:bg-blue-800 cursor-pointer"
                        title="User Menu"
                    >
                        <FaUser className="h-6 w-6 text-white" />
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 text-gray-700">
                            <button 
                                onClick={goToProfile}
                                className="flex w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                            >
                                My Profile
                            </button>
                            <button 
                                className="flex w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                onClick={handleLogout}
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