import { FaHome, FaCar, FaLocationArrow, FaChartBar, FaUsers, FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const managerItems = [
    { name: "Reservations", icon: <FaList />, path: "/all-reservations" },
    { name: "Manage Users", icon: <FaUsers />, path: "/manage-users" },
    { name: "Create Vehicle", icon: <FaCar />, path: "create-car" },
    { name: "Branches", icon: <FaLocationArrow />, path: "branches" },
];

export default function SideNav() {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="bg-[#000080] text-white w-64 h-full left-0 p-4">

            <ul className="mt-6 space-y-1">
                {managerItems.map((item, index) => (
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