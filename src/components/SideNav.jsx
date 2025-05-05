import { FaHome, FaCar, FaShoppingCart, FaChartBar, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const simpleUserItems = [
    { name: "Homepage", icon: <FaHome />, path: "/homepage" },
    { name: "Browse Vehicles", icon: <FaCar />, path: "browse-vehicles" },
    { name: "Shopping Cart", icon: <FaShoppingCart />, path: "/shopping-cart" },
];

const managerItems = [
    ...simpleUserItems,
    { name: "Statistics", icon: <FaChartBar />, path: "/statistics" },
    { name: "Manage Users", icon: <FaUsers />, path: "/manage-users" },
];

export default function SideNav({ userType }) {
    const navigate = useNavigate();
    const navItems = userType === "manager" ? managerItems : simpleUserItems;

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="bg-[#000080] text-white w-full h-full p-4">

            <div className="text-2xl font-bold text-center pb-2">LuxDrive</div>
            <div className="relative w-[calc(100%+2rem)] left-[-1rem] h-[1px] bg-white"></div>

            <ul className="mt-6 space-y-1">
                {navItems.map((item, index) => (
                    <li
                        key={index}
                        className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded"
                        onClick={() => handleNavigation(item.path)}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}