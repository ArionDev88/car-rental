import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import { Outlet } from "react-router-dom";

export default function HomePage() {

    return (
        <div className="flex flex-col h-screen w-full">
            <TopNav />
            <Outlet />
        </div>
    )
}