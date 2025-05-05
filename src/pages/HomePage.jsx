import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import { Outlet } from "react-router-dom";

export default function HomePage() {
    
    return (
        <div className="flex h-screen w-full">
            <div className="w-1/5">
                <SideNav userType="simple" />
            </div>

            <div className="w-4/5 flex flex-col">
                <TopNav />
                

                <Outlet />
            </div>


        </div>
    )
}