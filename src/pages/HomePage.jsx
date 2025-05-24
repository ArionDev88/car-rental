import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function HomePage() {
    const role = useAuthStore.getState().role;

    return (
        <div className="flex flex-col h-screen w-full">
            <TopNav />
            
            <main className={`flex `}>
                {role === 'MANAGER' && <SideNav />}
                {/* This is where child routes will be rendered */}
                <Outlet />
            </main>

        </div>
    )
}