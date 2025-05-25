import { useQuery } from "@tanstack/react-query";
import { getClients } from "../controllers/users";
export default function Clients() {

    const { data: clients, isLoading, error } = useQuery({
        queryKey: ['clients'],
        queryFn: getClients,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading clients: {error.message}</div>;
    }

    return (
        <>
        
        </>
    );

}